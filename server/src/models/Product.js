const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  categoryName: { type: String, required: true }, // Cached for fast filtering
  description: { type: String, required: true },
  price: { type: Number, required: true }, // Selling price after discount
  mrp: { type: Number, required: true },   // Original MRP
  discountPercent: { type: Number, default: 0 },
  images: [{ type: String, required: true }],
  sizes: [{ type: String }],
  colors: [{ type: String }],
  stock: { type: Number, required: true, default: 10 },
  rating: { type: Number, default: 4.2 },
  numReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  gender: { type: String, enum: ['Men', 'Women', 'Kids', 'Unisex'], default: 'Unisex' },
  pincodeDeliveryDays: { type: Number, default: 3 }
}, { timestamps: true });

// Auto-calculate discount percentage if not provided
productSchema.pre('save', function (next) {
  if (this.mrp && this.price && this.mrp > this.price) {
    this.discountPercent = Math.round(((this.mrp - this.price) / this.mrp) * 100);
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
