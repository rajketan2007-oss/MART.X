const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  quantity: { type: Number, required: true },
  size: { type: String, default: 'M' },
  color: { type: String, default: '' }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [orderItemSchema],
  shippingAddress: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    pincode: { type: String, required: true },
    locality: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    addressType: { type: String, default: 'Home' }
  },
  paymentMethod: { type: String, required: true, enum: ['Card', 'UPI', 'COD', 'Razorpay', 'Stripe'] },
  paymentResult: {
    id: { type: String },
    status: { type: String },
    update_time: { type: String },
    email_address: { type: String }
  },
  itemsPrice: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  couponApplied: { type: String, default: '' },
  deliveryFee: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: Date },
  orderStatus: {
    type: String,
    enum: ['Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
    default: 'Placed'
  },
  deliveredAt: { type: Date },
  estimatedDeliveryDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
