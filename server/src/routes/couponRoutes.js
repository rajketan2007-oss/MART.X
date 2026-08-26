const express = require('express');
const router = express.Router();
const { validateCoupon, getCoupons, createCoupon, deleteCoupon } = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getCoupons);
router.post('/validate', validateCoupon);
router.post('/admin', protect, admin, createCoupon);
router.delete('/admin/:id', protect, admin, deleteCoupon);

module.exports = router;
