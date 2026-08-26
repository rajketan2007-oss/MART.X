const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');

// @desc Get admin dashboard overview stats
// @route GET /api/admin/stats
const getAdminStats = async (req, res) => {
  const totalUsers = await User.countDocuments({});
  const totalProducts = await Product.countDocuments({});
  const totalOrders = await Order.countDocuments({});

  const orders = await Order.find({ orderStatus: { $ne: 'Cancelled' } });
  const totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

  // Status breakdown
  const placed = await Order.countDocuments({ orderStatus: 'Placed' });
  const processing = await Order.countDocuments({ orderStatus: 'Processing' });
  const shipped = await Order.countDocuments({ orderStatus: 'Shipped' });
  const delivered = await Order.countDocuments({ orderStatus: 'Delivered' });

  // Recent 5 orders
  const recentOrders = await Order.find({})
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    orderStatusBreakdown: { placed, processing, shipped, delivered },
    recentOrders
  });
};

// @desc Get all registered users (Admin)
// @route GET /api/admin/users
const getUsers = async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
};

// @desc Delete / block user (Admin)
// @route DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin account' });
    }
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { getAdminStats, getUsers, deleteUser };
