import { connectDB, closeDB } from './config/db.js';
import User from './models/User.js';
import Food from './models/Food.js';
import Order from './models/Order.js';
import Category from './models/Category.js';
import { seedDatabase } from './config/seedData.js';
import express from 'express';
import foodRoutes from './routes/foodRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';

async function runTestSuite() {
  console.log('🚀 [TEST SUITE] Starting FoodieHub API & Database Tests...');

  // 1. Connect to DB
  await connectDB();
  await seedDatabase();

  // 2. Start Express test server on ephemeral port 5099
  const app = express();
  app.use(express.json());
  app.use('/api/foods', foodRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/categories', categoryRoutes);

  const server = app.listen(5099);
  const BASE = 'http://127.0.0.1:5099/api';

  try {
    // TEST 1: Fetch Foods
    console.log('\n[Test 1] Testing GET /api/foods...');
    const foodsRes = await fetch(`${BASE}/foods`);
    const foods = await foodsRes.json();
    console.log(`✅ Loaded ${foods.length} dishes from database.`);
    if (foods.length < 18) throw new Error('Expected at least 18 dishes');

    // TEST 2: Fetch Categories
    console.log('\n[Test 2] Testing GET /api/categories...');
    const catRes = await fetch(`${BASE}/categories`);
    const categories = await catRes.json();
    console.log(`✅ Loaded ${categories.length} categories.`);
    if (categories.length < 6) throw new Error('Expected at least 6 categories');

    // TEST 3: Login as Customer
    console.log('\n[Test 3] Testing Customer Login...');
    const custLoginRes = await fetch(`${BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'customer@foodiehub.com', password: 'customer123' })
    });
    const customer = await custLoginRes.json();
    if (!customer.token) throw new Error('Customer login failed to yield JWT token');
    console.log(`✅ Customer logged in: "${customer.name}" with token.`);

    // TEST 4: Login as Admin
    console.log('\n[Test 4] Testing Admin Login...');
    const adminLoginRes = await fetch(`${BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@foodiehub.com', password: 'admin123' })
    });
    const admin = await adminLoginRes.json();
    if (!admin.token || admin.role !== 'admin') throw new Error('Admin login failed or role mismatch');
    console.log(`✅ Admin logged in: "${admin.name}" (Role: ${admin.role}) with token.`);

    // TEST 5: Create Order with Backend Server-Side Price Calculation
    console.log('\n[Test 5] Testing Order Placement & Server-Side Price Calculation...');
    const testFood1 = foods[0];
    const testFood2 = foods[1];
    
    const expectedSubtotal = (testFood1.price * 2) + (testFood2.price * 1);
    const expectedDelivery = expectedSubtotal >= 500 ? 0 : 40;
    const expectedDiscount = Math.min(Math.round(expectedSubtotal * 0.3), 150);
    const expectedTotal = expectedSubtotal + expectedDelivery - expectedDiscount;

    const orderPayload = {
      items: [
        { foodId: testFood1._id, quantity: 2 },
        { foodId: testFood2._id, quantity: 1 }
      ],
      deliveryAddress: {
        fullName: 'Rahul Sharma',
        phone: '+91 98765 43210',
        street: '123 Test Street, Koramangala',
        city: 'Bangalore',
        pincode: '560034'
      },
      paymentMethod: 'Simulated Online Payment',
      promoCode: 'FOODIE30'
    };

    const orderRes = await fetch(`${BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customer.token}`
      },
      body: JSON.stringify(orderPayload)
    });
    const createdOrder = await orderRes.json();
    console.log(`✅ Order Created: ID #${createdOrder._id.slice(-6).toUpperCase()}`);
    console.log(`   Calculated Subtotal: ₹${createdOrder.subtotal} (Expected: ₹${expectedSubtotal})`);
    console.log(`   Discount:            -₹${createdOrder.discount} (Expected: -₹${expectedDiscount})`);
    console.log(`   Delivery Fee:        ₹${createdOrder.deliveryFee} (Expected: ₹${expectedDelivery})`);
    console.log(`   Final Total Amount:  ₹${createdOrder.totalAmount} (Expected: ₹${expectedTotal})`);
    console.log(`   Payment Status:      ${createdOrder.paymentStatus}`);

    if (createdOrder.subtotal !== expectedSubtotal) {
      throw new Error(`Subtotal mismatch: got ${createdOrder.subtotal}, expected ${expectedSubtotal}`);
    }
    if (createdOrder.discount !== expectedDiscount) {
      throw new Error(`Discount mismatch: got ${createdOrder.discount}, expected ${expectedDiscount}`);
    }
    if (createdOrder.totalAmount !== expectedTotal) {
      throw new Error(`Total mismatch: got ${createdOrder.totalAmount}, expected ${expectedTotal}`);
    }

    // TEST 6: Fetch Customer Orders
    console.log('\n[Test 6] Testing GET /api/orders/myorders...');
    const myOrdersRes = await fetch(`${BASE}/orders/myorders`, {
      headers: { 'Authorization': `Bearer ${customer.token}` }
    });
    const myOrders = await myOrdersRes.json();
    console.log(`✅ Customer has ${myOrders.length} order(s) listed.`);

    // TEST 7: Admin Overview Stats
    console.log('\n[Test 7] Testing GET /api/orders/admin/stats (Admin Only)...');
    const statsRes = await fetch(`${BASE}/orders/admin/stats`, {
      headers: { 'Authorization': `Bearer ${admin.token}` }
    });
    const stats = await statsRes.json();
    console.log(`✅ Admin Metrics: Orders=${stats.totalOrders}, Revenue=₹${stats.totalRevenue}, Customers=${stats.totalCustomers}, Dishes=${stats.totalFoodItems}`);

    // TEST 8: Admin Update Order Status
    console.log('\n[Test 8] Testing PUT /api/orders/:id/status (Updating to "Out for Delivery")...');
    const updateRes = await fetch(`${BASE}/orders/${createdOrder._id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${admin.token}`
      },
      body: JSON.stringify({ status: 'Out for Delivery' })
    });
    const updatedOrder = await updateRes.json();
    console.log(`✅ Order status updated to: "${updatedOrder.status}"`);
    if (updatedOrder.status !== 'Out for Delivery') throw new Error('Status update failed');

    console.log('\n🎉 ALL 8 INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
  } finally {
    server.close();
    await closeDB();
  }
}

runTestSuite().catch((err) => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});
