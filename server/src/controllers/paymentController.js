// @desc Create simulated payment order
// @route POST /api/payment/create-order
const createPaymentOrder = async (req, res) => {
  const { amount, currency } = req.body;

  // Generate simulated test transaction details
  const simulatedPaymentOrder = {
    id: `order_extrad_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    entity: 'order',
    amount: (Number(amount) || 100) * 100, // in paise
    amount_paid: 0,
    amount_due: (Number(amount) || 100) * 100,
    currency: currency || 'INR',
    receipt: `receipt_${Date.now()}`,
    status: 'created',
    created_at: Math.floor(Date.now() / 1000)
  };

  res.json(simulatedPaymentOrder);
};

// @desc Verify payment transaction
// @route POST /api/payment/verify
const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id } = req.body;

  res.json({
    success: true,
    message: 'Payment verified successfully',
    transactionId: razorpay_payment_id || `pay_${Date.now()}`,
    orderId: razorpay_order_id || `order_${Date.now()}`
  });
};

module.exports = { createPaymentOrder, verifyPayment };
