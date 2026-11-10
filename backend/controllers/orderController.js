import Order from '../models/Order.js';
import Food from '../models/Food.js';
import User from '../models/User.js';

// @desc    Create new order with server-calculated total
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, promoCode, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items specified' });
    }

    if (!deliveryAddress || !deliveryAddress.fullName || !deliveryAddress.phone || !deliveryAddress.street || !deliveryAddress.pincode) {
      return res.status(400).json({ message: 'Complete delivery address is required' });
    }

    // SERVER-SIDE PRICE AND TOTAL CALCULATION (Never trust client prices)
    const verifiedOrderItems = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const foodId = item.foodId || item._id;
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);

      const dbFood = await Food.findById(foodId);
      if (!dbFood) {
        return res.status(404).json({ message: `Item with id ${foodId} not found in catalog` });
      }

      if (!dbFood.available) {
        return res.status(400).json({ message: `"${dbFood.name}" is currently sold out` });
      }

      const itemTotal = dbFood.price * quantity;
      calculatedSubtotal += itemTotal;

      verifiedOrderItems.push({
        foodId: dbFood._id,
        name: dbFood.name,
        price: dbFood.price,
        quantity: quantity,
        image: dbFood.image
      });
    }

    // Delivery fee: ₹40 standard, free over ₹500
    const deliveryFee = calculatedSubtotal >= 500 ? 0 : 40;

    // Promo code validation: FOODIE30 offers 30% discount capped at ₹150
    let discount = 0;
    if (promoCode && promoCode.toUpperCase() === 'FOODIE30') {
      discount = Math.min(Math.round(calculatedSubtotal * 0.3), 150);
    }

    const totalAmount = Math.max(0, calculatedSubtotal + deliveryFee - discount);

    const order = new Order({
      userId: req.user._id,
      items: verifiedOrderItems,
      deliveryAddress: {
        fullName: deliveryAddress.fullName,
        phone: deliveryAddress.phone,
        street: deliveryAddress.street,
        city: deliveryAddress.city || 'Bangalore',
        state: deliveryAddress.state || 'Karnataka',
        pincode: deliveryAddress.pincode
      },
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: paymentMethod === 'Simulated Online Payment' ? 'Completed' : 'Pending',
      subtotal: calculatedSubtotal,
      deliveryFee,
      discount,
      totalAmount,
      status: 'Placed',
      notes: notes || ''
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.foodId', 'name image category')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('items.foodId', 'name image');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure only order owner or admin can view
    if (
      order.userId._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const allowedStatuses = [
      'Placed',
      'Confirmed',
      'Preparing',
      'Out for Delivery',
      'Delivered',
      'Cancelled'
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    } else if (status === 'Delivered' && order.paymentMethod === 'Cash on Delivery') {
      order.paymentStatus = 'Completed';
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get admin overview statistics
// @route   GET /api/orders/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalFoodItems = await Food.countDocuments();

    // Calculate revenue from non-cancelled orders
    const completedOrders = await Order.find({ status: { $ne: 'Cancelled' } });
    const totalRevenue = completedOrders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

    // Status breakdown
    const pendingOrders = await Order.countDocuments({ status: { $in: ['Placed', 'Confirmed', 'Preparing'] } });
    const activeDeliveries = await Order.countDocuments({ status: 'Out for Delivery' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

    // Recent 5 orders
    const recentOrders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      totalOrders,
      totalRevenue,
      totalCustomers,
      totalFoodItems,
      breakdown: {
        pendingOrders,
        activeDeliveries,
        deliveredOrders,
        cancelledOrders
      },
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

