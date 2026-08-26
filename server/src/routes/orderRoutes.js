const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', createOrder);
router.get('/myorders', getMyOrders);
router.get('/admin/all', admin, getAllOrders);
router.put('/admin/:id/status', admin, updateOrderStatus);
router.get('/:id', getOrderById);

module.exports = router;
