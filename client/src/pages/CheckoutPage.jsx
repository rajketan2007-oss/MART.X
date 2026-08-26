import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, CreditCard, ShieldCheck, CheckCircle2, Plus, ArrowRight, PackageCheck, Truck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useUI } from '../context/UIContext';
import { createOrderApi } from '../services/api';
import { triggerOrderCelebration } from '../utils/confetti';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, addAddress } = useAuth();
  const { cartItems, totalSellingPrice, productDiscount, couponDiscount, deliveryFee, finalAmount, coupon } = useCart();
  const { addToast } = useUI();

  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Review & Confirmation
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isPlacing, setIsPlacing] = useState(false);

  // Address Modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    pincode: '',
    locality: '',
    address: '',
    city: '',
    state: '',
    addressType: 'Home'
  });

  const addresses = user?.addresses || [];
  const selectedAddress = addresses[selectedAddressIndex] || addresses[0] || null;

  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.name || !addressForm.phone || !addressForm.pincode || !addressForm.address) {
      addToast('Please fill all required address fields', 'error');
      return;
    }

    const res = await addAddress({ ...addressForm, isDefault: addresses.length === 0 });
    if (res.success) {
      setShowAddressModal(false);
      setSelectedAddressIndex(user?.addresses ? user.addresses.length : 0);
      setAddressForm({
        name: user?.name || '',
        phone: user?.phone || '',
        pincode: '',
        locality: '',
        address: '',
        city: '',
        state: '',
        addressType: 'Home'
      });
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      addToast('Please select or add a delivery address', 'error');
      setStep(1);
      return;
    }

    if (!user) {
      addToast('Please login to place an order', 'error');
      navigate('/login?redirect=checkout');
      return;
    }

    setIsPlacing(true);

    const orderPayload = {
      orderItems: cartItems.map((item) => ({
        product: item.product._id || item.product.id,
        name: item.product.name,
        image: item.product.images?.[0] || '',
        brand: item.product.brand,
        price: item.product.price,
        mrp: item.product.mrp || item.product.price,
        quantity: item.quantity,
        size: item.size || 'M',
        color: item.color || ''
      })),
      shippingAddress: selectedAddress,
      paymentMethod,
      itemsPrice: totalSellingPrice,
      discountAmount: couponDiscount,
      couponApplied: coupon ? coupon.code : '',
      deliveryFee,
      totalAmount: finalAmount
    };

    try {
      const res = await createOrderApi(orderPayload);
      setPlacedOrder(res.data);
      triggerOrderCelebration();
      addToast('🎉 Order placed successfully!', 'success');
      setStep(4); // Order Confirmed
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place order';
      addToast(msg, 'error');
    } finally {
      setIsPlacing(false);
    }
  };

  if (step === 4 && placedOrder) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        <div className="bg-white rounded-2xl border border-extrad-border p-8 text-center shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
            <PackageCheck className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-black text-extrad-dark uppercase tracking-wide">
            ORDER CONFIRMED & PLACED!
          </h1>
          <p className="text-xs text-extrad-muted">
            Thank you for shopping with Extrad. Order ID: <strong className="text-extrad-pink font-extrabold">{placedOrder._id}</strong>
          </p>

          {/* Tracking Stepper */}
          <div className="py-6 border-t border-b border-extrad-border my-6">
            <h4 className="text-xs font-bold text-extrad-dark uppercase tracking-wider mb-4">LIVE STATUS TIMELINE</h4>
            <div className="flex items-center justify-between max-w-md mx-auto">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full gradient-bg text-white flex items-center justify-center font-bold text-xs shadow-md">1</div>
                <span className="text-[10px] font-extrabold text-extrad-pink uppercase">Placed</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-200" />
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-xs">2</div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Processing</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-200" />
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-xs">3</div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Shipped</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-200" />
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center font-bold text-xs">4</div>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Delivered</span>
              </div>
            </div>
          </div>

          <div className="bg-extrad-peach/50 p-4 rounded-xl text-left text-xs space-y-1">
            <p className="font-bold text-extrad-dark">Delivery Address:</p>
            <p className="text-extrad-muted">{placedOrder.shippingAddress.name} ({placedOrder.shippingAddress.phone})</p>
            <p className="text-extrad-muted">{placedOrder.shippingAddress.address}, {placedOrder.shippingAddress.locality}, {placedOrder.shippingAddress.city} - {placedOrder.shippingAddress.pincode}</p>
          </div>

          <div className="flex gap-4 pt-4">
            <Link
              to="/profile?tab=orders"
              className="flex-1 py-3 bg-extrad-dark text-white text-xs font-extrabold uppercase rounded-xl hover:bg-black transition-colors"
            >
              TRACK ORDER STATUS
            </Link>
            <Link
              to="/shop"
              className="flex-1 py-3 gradient-bg text-white text-xs font-extrabold uppercase rounded-xl hover:opacity-90 transition-opacity"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Step Stepper Header */}
      <div className="flex items-center justify-center max-w-xl mx-auto border-b border-extrad-border pb-4">
        <button
          onClick={() => setStep(1)}
          className={`flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider ${
            step >= 1 ? 'text-extrad-pink' : 'text-gray-400'
          }`}
        >
          <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center">1</span>
          ADDRESS
        </button>
        <div className="w-12 h-0.5 bg-gray-200 mx-4" />
        <button
          onClick={() => selectedAddress && setStep(2)}
          className={`flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider ${
            step >= 2 ? 'text-extrad-pink' : 'text-gray-400'
          }`}
        >
          <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center">2</span>
          PAYMENT
        </button>
        <div className="w-12 h-0.5 bg-gray-200 mx-4" />
        <button
          onClick={() => selectedAddress && setStep(3)}
          className={`flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider ${
            step >= 3 ? 'text-extrad-pink' : 'text-gray-400'
          }`}
        >
          <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center">3</span>
          REVIEW
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Step Container */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* STEP 1: DELIVERY ADDRESS */}
          {step === 1 && (
            <div className="bg-white rounded-xl border border-extrad-border p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-extrad-dark uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-extrad-pink" /> SELECT DELIVERY ADDRESS
                </h3>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="text-xs font-extrabold text-extrad-pink hover:underline flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> ADD NEW ADDRESS
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p className="text-xs text-extrad-muted mb-3">No saved addresses found.</p>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="gradient-bg text-white text-xs font-bold px-4 py-2 rounded-lg"
                  >
                    + Add Shipping Address
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr, idx) => (
                    <label
                      key={idx}
                      className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedAddressIndex === idx
                          ? 'border-extrad-pink bg-extrad-peach/30 ring-1 ring-extrad-pink'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={selectedAddressIndex === idx}
                          onChange={() => setSelectedAddressIndex(idx)}
                          className="mt-1 accent-extrad-pink"
                        />
                        <div className="flex-1 text-xs space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-extrad-dark">{addr.name}</span>
                            <span className="bg-extrad-light px-2 py-0.5 rounded text-[10px] font-bold uppercase text-extrad-muted">
                              {addr.addressType}
                            </span>
                          </div>
                          <p className="text-extrad-muted">{addr.address}, {addr.locality}</p>
                          <p className="text-extrad-muted">{addr.city}, {addr.state} - <strong>{addr.pincode}</strong></p>
                          <p className="text-extrad-dark font-semibold">Mobile: {addr.phone}</p>
                        </div>
                      </div>
                    </label>
                  ))}

                  <button
                    onClick={() => setStep(2)}
                    className="w-full py-3.5 gradient-bg text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-md mt-4"
                  >
                    DELIVER TO THIS ADDRESS
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: PAYMENT METHOD */}
          {step === 2 && (
            <div className="bg-white rounded-xl border border-extrad-border p-6 space-y-4">
              <h3 className="text-sm font-black text-extrad-dark uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-extrad-pink" /> SELECT PAYMENT METHOD
              </h3>

              <div className="space-y-3">
                {[
                  { id: 'COD', title: 'Cash on Delivery (COD)', desc: 'Pay with cash upon delivery' },
                  { id: 'UPI', title: 'Google Pay / PhonePe / BHIM UPI', desc: 'Instant 1-click UPI checkout' },
                  { id: 'Razorpay', title: 'Razorpay / Credit / Debit Card', desc: 'Visa, Mastercard, RuPay & Netbanking' },
                  { id: 'Card', title: 'Test Payment Gateway (Instant Pass)', desc: 'Simulated sandbox test checkout' }
                ].map((pm) => (
                  <label
                    key={pm.id}
                    className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === pm.id
                        ? 'border-extrad-pink bg-extrad-peach/30 ring-1 ring-extrad-pink'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === pm.id}
                        onChange={() => setPaymentMethod(pm.id)}
                        className="accent-extrad-pink"
                      />
                      <div>
                        <h4 className="text-xs font-extrabold text-extrad-dark">{pm.title}</h4>
                        <p className="text-[11px] text-extrad-muted">{pm.desc}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-extrad-border text-extrad-dark font-extrabold text-xs uppercase rounded-xl hover:bg-gray-50"
                >
                  BACK TO ADDRESS
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 gradient-bg text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-md"
                >
                  CONTINUE TO ORDER REVIEW
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ORDER REVIEW */}
          {step === 3 && (
            <div className="bg-white rounded-xl border border-extrad-border p-6 space-y-6">
              <h3 className="text-sm font-black text-extrad-dark uppercase tracking-wider">
                REVIEW YOUR ORDER
              </h3>

              {/* Delivery Summary */}
              {selectedAddress && (
                <div className="bg-extrad-peach/30 p-4 rounded-xl border border-extrad-peach flex justify-between items-start">
                  <div className="text-xs space-y-1">
                    <span className="font-bold text-extrad-dark">Deliver to: {selectedAddress.name} ({selectedAddress.phone})</span>
                    <p className="text-extrad-muted">{selectedAddress.address}, {selectedAddress.city} - {selectedAddress.pincode}</p>
                    <p className="text-extrad-dark font-semibold">Payment Mode: {paymentMethod}</p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-xs font-bold text-extrad-pink hover:underline"
                  >
                    CHANGE
                  </button>
                </div>
              )}

              {/* Items List */}
              <div className="space-y-3 divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item._id} className="pt-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.product.images?.[0]} alt="" className="w-12 h-14 object-cover rounded bg-gray-100" />
                      <div>
                        <p className="font-bold text-extrad-dark">{item.product.brand}</p>
                        <p className="text-extrad-muted">{item.product.name}</p>
                        <p className="text-gray-400">Qty: {item.quantity} | Size: {item.size || 'M'}</p>
                      </div>
                    </div>
                    <span className="font-extrabold text-extrad-dark">₹{(item.product.price || 0) * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-extrad-border text-extrad-dark font-extrabold text-xs uppercase rounded-xl hover:bg-gray-50"
                >
                  BACK TO PAYMENT
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacing}
                  className="flex-1 py-3.5 gradient-bg text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:opacity-95 disabled:opacity-50"
                >
                  {isPlacing ? 'PLACING ORDER...' : `CONFIRM & PLACE ORDER (₹${finalAmount})`}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Column Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-xl border border-extrad-border p-5 space-y-4">
            <h3 className="text-xs font-black text-extrad-dark uppercase tracking-wider pb-2 border-b">ORDER SUMMARY</h3>
            <div className="space-y-2 text-xs text-extrad-muted">
              <div className="flex justify-between"><span>Items Total</span><span className="text-extrad-dark font-bold">₹{totalSellingPrice}</span></div>
              {couponDiscount > 0 && <div className="flex justify-between text-emerald-600 font-bold"><span>Coupon Savings</span><span>-₹{couponDiscount}</span></div>}
              <div className="flex justify-between"><span>Delivery</span><span className="text-emerald-600 font-bold">FREE</span></div>
              <div className="flex justify-between text-sm font-black text-extrad-dark pt-2 border-t"><span>Total Amount</span><span>₹{finalAmount}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-extrad-dark">Add Shipping Address</h3>
            <form onSubmit={handleSaveNewAddress} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Full Name" value={addressForm.name} onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })} required className="text-xs p-2.5 bg-gray-50 border rounded-lg" />
                <input type="text" placeholder="Mobile Phone" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} required className="text-xs p-2.5 bg-gray-50 border rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Pincode (6-digit)" value={addressForm.pincode} onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })} required className="text-xs p-2.5 bg-gray-50 border rounded-lg" />
                <input type="text" placeholder="Locality / Area" value={addressForm.locality} onChange={(e) => setAddressForm({ ...addressForm, locality: e.target.value })} required className="text-xs p-2.5 bg-gray-50 border rounded-lg" />
              </div>
              <textarea placeholder="Street Address, House No, Flat" value={addressForm.address} onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })} required className="w-full text-xs p-2.5 bg-gray-50 border rounded-lg" />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="City" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} required className="text-xs p-2.5 bg-gray-50 border rounded-lg" />
                <input type="text" placeholder="State" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} required className="text-xs p-2.5 bg-gray-50 border rounded-lg" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2.5 gradient-bg text-white font-bold text-xs rounded-lg">Save Address</button>
                <button type="button" onClick={() => setShowAddressModal(false)} className="px-4 py-2.5 border text-xs font-bold rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
