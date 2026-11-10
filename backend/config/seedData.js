import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import User from '../models/User.js';
import Food from '../models/Food.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';

dotenv.config();

export const categories = [
  {
    name: 'Biryani',
    description: 'Fragrant basmati rice slow-cooked with aromatic spices and tender cuts',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
    iconName: 'Flame'
  },
  {
    name: 'Pizza',
    description: 'Fresh dough hand-tossed with artisanal cheese and rich Italian sauce',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
    iconName: 'Pizza'
  },
  {
    name: 'Burgers',
    description: 'Juicy gourmet patties grilled to perfection with crispy fries',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    iconName: 'Beef'
  },
  {
    name: 'Indian Meals',
    description: 'Hearty traditional thalis, creamy gravies, and fresh butter naans',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80',
    iconName: 'Utensils'
  },
  {
    name: 'Desserts',
    description: 'Sweet sensations, rich chocolate cakes, and chilled traditional treats',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop&q=80',
    iconName: 'Cake'
  },
  {
    name: 'Beverages',
    description: 'Refreshing cold pressed juices, artisanal shakes, and iced mocktails',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
    iconName: 'Coffee'
  }
];

export const foods = [
  // Biryani
  {
    name: 'Royal Hyderabadi Dum Biryani',
    description: 'Authentic kacchi dum biryani layered with marinated chicken, saffron-infused basmati rice, caramelized onions, and royal spices. Served with creamy mirchi ka salan and raita.',
    category: 'Biryani',
    price: 349,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    ratingCount: 384,
    available: true,
    isVeg: false,
    preparationTime: '30-40 mins',
    featured: true,
    isBestSeller: true
  },
  {
    name: 'Lucknowi Mutton Biryani',
    description: 'Tender baby lamb cooked in fragrant yakhni broth, subtly spiced with kewra water and green cardamom, paired with seasoned raita.',
    category: 'Biryani',
    price: 449,
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    ratingCount: 215,
    available: true,
    isVeg: false,
    preparationTime: '35-45 mins',
    featured: true,
    isBestSeller: false
  },
  {
    name: 'Paneer Tikka Dum Biryani',
    description: 'Char-grilled cottage cheese cubes tossed in spicy tandoori marinade, layered with aged basmati rice and fresh mint leaves.',
    category: 'Biryani',
    price: 299,
    image: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    ratingCount: 198,
    available: true,
    isVeg: true,
    preparationTime: '25-35 mins',
    featured: false,
    isBestSeller: true
  },

  // Pizza
  {
    name: 'Artisan Margherita Pizza',
    description: 'Handcrafted sourdough base topped with San Marzano tomato reduction, fresh buffalo mozzarella, virgin olive oil, and organic basil leaves.',
    category: 'Pizza',
    price: 379,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    ratingCount: 420,
    available: true,
    isVeg: true,
    preparationTime: '20-25 mins',
    featured: true,
    isBestSeller: true
  },
  {
    name: 'Fiery Pepperoni & Jalapeño Pizza',
    description: 'Crispy wood-fired crust loaded with spicy beef pepperoni slices, pickled jalapeños, red chili flakes, and melted aged mozzarella.',
    category: 'Pizza',
    price: 499,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    ratingCount: 310,
    available: true,
    isVeg: false,
    preparationTime: '20-30 mins',
    featured: true,
    isBestSeller: false
  },
  {
    name: 'Truffle Mushroom Gourmet Pizza',
    description: 'Wild portobello and button mushrooms sautéed in garlic thyme oil, white truffle glaze, fontina cheese, and baby rocket arugula.',
    category: 'Pizza',
    price: 459,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    rating: 4.6,
    ratingCount: 154,
    available: true,
    isVeg: true,
    preparationTime: '25-30 mins',
    featured: false,
    isBestSeller: false
  },

  // Burgers
  {
    name: 'Double Smash Cheddar Burger',
    description: 'Two crispy-edged smashed beef patties smothered with double American cheddar, caramelized shallots, dill pickles, and secret Foodie sauce on a toasted brioche bun.',
    category: 'Burgers',
    price: 299,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    ratingCount: 520,
    available: true,
    isVeg: false,
    preparationTime: '15-20 mins',
    featured: true,
    isBestSeller: true
  },
  {
    name: 'Crispy Korean Fried Chicken Burger',
    description: 'Ultra-crispy buttermilk chicken breast drenched in gochujang sweet-spicy glaze, crunchy sesame slaw, and spicy garlic aioli.',
    category: 'Burgers',
    price: 279,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    ratingCount: 340,
    available: true,
    isVeg: false,
    preparationTime: '20-25 mins',
    featured: false,
    isBestSeller: true
  },
  {
    name: 'Gourmet Truffle Veggie Burger',
    description: 'Quinoa, black bean, and charred corn patty topped with smashed avocado, melted Swiss cheese, heirloom tomato, and herb ranch on seeded multigrain bun.',
    category: 'Burgers',
    price: 249,
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=800&auto=format&fit=crop&q=80',
    rating: 4.5,
    ratingCount: 180,
    available: true,
    isVeg: true,
    preparationTime: '15-20 mins',
    featured: false,
    isBestSeller: false
  },

  // Indian Meals
  {
    name: 'Butter Chicken & Garlic Naan Combo',
    description: 'Tender tandoori chicken cooked in velvety, slow-simmered tomato butter gravy with fenugreek leaves. Accompanied by two hot garlic butter naans.',
    category: 'Indian Meals',
    price: 369,
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    ratingCount: 610,
    available: true,
    isVeg: false,
    preparationTime: '25-35 mins',
    featured: true,
    isBestSeller: true
  },
  {
    name: 'Royal Paneer Lababdar Thali',
    description: 'Cottage cheese simmered in spiced onion-tomato cashew gravy, accompanied by Dal Makhani, jeera rice, butter roti, gulab jamun, and salad.',
    category: 'Indian Meals',
    price: 329,
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    ratingCount: 290,
    available: true,
    isVeg: true,
    preparationTime: '25-35 mins',
    featured: false,
    isBestSeller: true
  },
  {
    name: 'Dal Makhani Slow-Simmered (24 Hrs)',
    description: 'Black lentils slow-cooked overnight over glowing charcoal with churned butter and fresh cream. The quintessential North Indian comfort food.',
    category: 'Indian Meals',
    price: 239,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    ratingCount: 245,
    available: true,
    isVeg: true,
    preparationTime: '20-25 mins',
    featured: false,
    isBestSeller: false
  },

  // Desserts
  {
    name: 'Molten Belgian Chocolate Lava Cake',
    description: 'Warm dark chocolate souffle with a decadent flowing center of rich Belgian ganache. Dusted with cocoa powder.',
    category: 'Desserts',
    price: 199,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    ratingCount: 430,
    available: true,
    isVeg: true,
    preparationTime: '15 mins',
    featured: true,
    isBestSeller: true
  },
  {
    name: 'Royal Shahi Gulab Jamun (2 Pcs)',
    description: 'Soft melt-in-mouth milk solids dumplings soaked in cardamom and saffron infused sugar syrup, topped with slivered pistachios.',
    category: 'Desserts',
    price: 129,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    ratingCount: 310,
    available: true,
    isVeg: true,
    preparationTime: '10 mins',
    featured: false,
    isBestSeller: false
  },
  {
    name: 'Classic New York Cheesecake',
    description: 'Dense and creamy baked Philadelphia cheesecake on a crunchy cinnamon graham cracker crust, topped with fresh strawberry compote.',
    category: 'Desserts',
    price: 229,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    ratingCount: 190,
    available: true,
    isVeg: true,
    preparationTime: '10 mins',
    featured: false,
    isBestSeller: false
  },

  // Beverages
  {
    name: 'Alphonso Mango Lassi',
    description: 'Thick creamy churned yogurt blended with authentic Ratnagiri Alphonso mango pulp, saffron strands, and crushed green pistachios.',
    category: 'Beverages',
    price: 139,
    image: 'https://images.unsplash.com/photo-1571006687085-f5e2786a5dfc?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    ratingCount: 380,
    available: true,
    isVeg: true,
    preparationTime: '10 mins',
    featured: true,
    isBestSeller: true
  },
  {
    name: 'Cold Brew Caramel Frappe',
    description: '16-hour steeped Arabica cold brew whipped with whole milk, salted caramel drizzle, and topped with silky whipped cream.',
    category: 'Beverages',
    price: 179,
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    ratingCount: 220,
    available: true,
    isVeg: true,
    preparationTime: '10 mins',
    featured: false,
    isBestSeller: false
  },
  {
    name: 'Fresh Mint Lime Cooler',
    description: 'Zesty cold-pressed Persian lime juice with fresh garden mint leaves, rock salt, and sparkling soda on crushed ice.',
    category: 'Beverages',
    price: 99,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
    rating: 4.6,
    ratingCount: 165,
    available: true,
    isVeg: true,
    preparationTime: '10 mins',
    featured: false,
    isBestSeller: false
  }
];

export const seedDatabase = async () => {
  console.log('Clearing existing database collections...');
  await User.deleteMany();
  await Food.deleteMany();
  await Category.deleteMany();
  await Order.deleteMany();

  console.log('Seeding categories...');
  await Category.insertMany(categories);

  console.log('Seeding foods...');
  const insertedFoods = await Food.insertMany(foods);

  console.log('Seeding users (Admin & Customer)...');
  const adminUser = await User.create({
    name: 'Admin Manager',
    email: 'admin@foodiehub.com',
    password: 'admin123',
    phone: '+91 98765 43210',
    address: {
      street: '42 Tech Park Avenue, Koramangala',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560034'
    },
    role: 'admin'
  });

  const customerUser = await User.create({
    name: 'Rahul Sharma',
    email: 'customer@foodiehub.com',
    password: 'customer123',
    phone: '+91 98123 45678',
    address: {
      street: 'Flat 402, Sunshine Residency, Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038'
    },
    role: 'customer'
  });

  console.log('Seeding sample orders for realistic dashboard demo...');
  const sampleFood1 = insertedFoods[0]; // Hyderabadi Biryani
  const sampleFood2 = insertedFoods[3]; // Margherita Pizza
  const sampleFood3 = insertedFoods[6]; // Smash Burger

  await Order.create({
    userId: customerUser._id,
    items: [
      {
        foodId: sampleFood1._id,
        name: sampleFood1.name,
        price: sampleFood1.price,
        quantity: 2,
        image: sampleFood1.image
      },
      {
        foodId: insertedFoods[15]._id, // Alphonso Mango Lassi
        name: insertedFoods[15].name,
        price: insertedFoods[15].price,
        quantity: 2,
        image: insertedFoods[15].image
      }
    ],
    deliveryAddress: {
      fullName: 'Rahul Sharma',
      phone: '+91 98123 45678',
      street: 'Flat 402, Sunshine Residency, 12th Main Rd, Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038'
    },
    paymentMethod: 'Simulated Online Payment',
    paymentStatus: 'Completed',
    subtotal: sampleFood1.price * 2 + insertedFoods[15].price * 2,
    deliveryFee: 0,
    discount: 150,
    totalAmount: (sampleFood1.price * 2 + insertedFoods[15].price * 2) - 150,
    status: 'Delivered',
    notes: 'Please ring the bell twice'
  });

  await Order.create({
    userId: customerUser._id,
    items: [
      {
        foodId: sampleFood2._id,
        name: sampleFood2.name,
        price: sampleFood2.price,
        quantity: 1,
        image: sampleFood2.image
      },
      {
        foodId: sampleFood3._id,
        name: sampleFood3.name,
        price: sampleFood3.price,
        quantity: 1,
        image: sampleFood3.image
      }
    ],
    deliveryAddress: {
      fullName: 'Rahul Sharma',
      phone: '+91 98123 45678',
      street: 'Flat 402, Sunshine Residency, 12th Main Rd, Indiranagar',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560038'
    },
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'Pending',
    subtotal: sampleFood2.price + sampleFood3.price,
    deliveryFee: 0,
    discount: 0,
    totalAmount: sampleFood2.price + sampleFood3.price,
    status: 'Preparing',
    notes: 'Extra ketchup please'
  });

  console.log('✅ Seed complete: 18 items, 6 categories, 2 users, 2 orders.');
};

// If run via CLI: `node config/seedData.js`
if (process.argv[1]?.endsWith('seedData.js')) {
  (async () => {
    await connectDB();
    await seedDatabase();
    process.exit(0);
  })();
}
