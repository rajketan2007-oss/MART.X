const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @desc Create new order
// @route POST /api/orders
const createOrder = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    discountAmount,
    couponApplied,
    deliveryFee,
    totalAmount
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items provided' });
  }

  if (!shippingAddress) {
    return res.status(400).json({ message: 'Shipping address required' });
  }

  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + 3);

  const order = new Order({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod: paymentMethod || 'COD',
    paymentResult: {
      id: `PAY_${Date.now()}`,
      status: paymentMethod === 'COD' ? 'Pending' : 'Completed',
      update_time: new Date().toISOString(),
      email_address: req.user.email
    },
    itemsPrice: Number(itemsPrice),
    discountAmount: Number(discountAmount) || 0,
    couponApplied: couponApplied || '',
    deliveryFee: Number(deliveryFee) || 0,
    totalAmount: Number(totalAmount),
    isPaid: paymentMethod !== 'COD',
    paidAt: paymentMethod !== 'COD' ? new Date() : null,
    orderStatus: 'Placed',
    estimatedDeliveryDate: estimatedDate
  });

  const createdOrder = await order.save();

  // Clear cart after placing order
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

  res.status(201).json(createdOrder);
};

// @desc Get logged in user orders
// @route GET /api/orders/myorders
const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

// @desc Get order by ID
// @route GET /api/orders/:id
const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email phone');
  if (order) {
    // Check if user owns order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

// @desc Admin get all orders
// @route GET /api/orders/admin/all
const getAllOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
  res.json(orders);
};

// @desc Admin update order status
// @route PUT /api/orders/admin/:id/status
const updateOrderStatus = async (req, res) => {
  const { orderStatus } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    order.orderStatus = orderStatus || order.orderStatus;
    if (orderStatus === 'Delivered') {
      order.deliveredAt = new Date();
      order.isPaid = true;
      if (!order.paidAt) order.paidAt = new Date();
    }
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
};
