const Coupon = require('../models/Coupon');

// @desc Validate coupon code
// @route POST /api/coupons/validate
const validateCoupon = async (req, res) => {
  const { code, orderAmount } = req.body;

  if (!code) return res.status(400).json({ message: 'Coupon code required' });

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

  if (!coupon) {
    return res.status(404).json({ message: 'Invalid or inactive coupon code' });
  }

  if (new Date() > new Date(coupon.expiryDate)) {
    return res.status(400).json({ message: 'Coupon code has expired' });
  }

  const subtotal = Number(orderAmount) || 0;
  if (subtotal < coupon.minOrderValue) {
    return res.status(400).json({
      message: `Minimum order value of ₹${coupon.minOrderValue} required for this coupon`
    });
  }

  let discount = 0;
  if (coupon.discountType === 'flat') {
    discount = coupon.discountValue;
  } else if (coupon.discountType === 'percentage') {
    discount = Math.round((subtotal * coupon.discountValue) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  }

  res.json({
    valid: true,
    code: coupon.code,
    discountAmount: discount,
    description: coupon.description || `₹${discount} OFF applied!`
  });
};

// @desc Get all active coupons
// @route GET /api/coupons
const getCoupons = async (req, res) => {
  const coupons = await Coupon.find({ isActive: true, expiryDate: { $gte: new Date() } });
  res.json(coupons);
};

// @desc Admin create coupon
// @route POST /api/coupons/admin
const createCoupon = async (req, res) => {
  const { code, discountType, discountValue, minOrderValue, maxDiscount, expiryDate, description } = req.body;

  const existing = await Coupon.findOne({ code: code.toUpperCase() });
  if (existing) {
    return res.status(400).json({ message: 'Coupon code already exists' });
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    discountType: discountType || 'flat',
    discountValue: Number(discountValue),
    minOrderValue: Number(minOrderValue) || 0,
    maxDiscount: Number(maxDiscount) || 1000,
    expiryDate: expiryDate ? new Date(expiryDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    description: description || ''
  });

  res.status(201).json(coupon);
};

// @desc Admin delete coupon
// @route DELETE /api/coupons/admin/:id
const deleteCoupon = async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (coupon) {
    await coupon.deleteOne();
    res.json({ message: 'Coupon removed' });
  } else {
    res.status(404).json({ message: 'Coupon not found' });
  }
};

module.exports = { validateCoupon, getCoupons, createCoupon, deleteCoupon };
