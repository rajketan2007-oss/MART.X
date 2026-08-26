const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ['flat', 'percentage'], default: 'flat' },
  discountValue: { type: Number, required: true },
  minOrderValue: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: 1000 },
  expiryDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  description: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
