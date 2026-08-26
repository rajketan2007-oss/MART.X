import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const PriceSummary = ({ onProceed, buttonText = 'PLACE ORDER', disabled = false }) => {
  const {
    totalMRP,
    productDiscount,
    couponDiscount,
    deliveryFee,
    finalAmount,
    cartItems
  } = useCart();

  return (
    <div className="bg-white rounded-xl border border-extrad-border p-5 space-y-4 shadow-sm">
      <h3 className="text-xs font-black text-extrad-dark uppercase tracking-widest pb-3 border-b border-extrad-border">
        PRICE DETAILS ({cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'})
      </h3>

      <div className="space-y-2.5 text-xs">
        <div className="flex justify-between text-extrad-muted font-medium">
          <span>Total MRP</span>
          <span className="text-extrad-dark font-semibold">₹{totalMRP}</span>
        </div>

        {productDiscount > 0 && (
          <div className="flex justify-between text-extrad-muted font-medium">
            <span>Discount on MRP</span>
            <span className="text-emerald-600 font-extrabold">-₹{productDiscount}</span>
          </div>
        )}

        {couponDiscount > 0 && (
          <div className="flex justify-between text-extrad-muted font-medium">
            <span>Coupon Discount</span>
            <span className="text-emerald-600 font-extrabold">-₹{couponDiscount}</span>
          </div>
        )}

        <div className="flex justify-between text-extrad-muted font-medium">
          <span>Convenience / Delivery Fee</span>
          {deliveryFee === 0 ? (
            <span className="text-emerald-600 font-extrabold uppercase">FREE</span>
          ) : (
            <span className="text-extrad-dark font-semibold">₹{deliveryFee}</span>
          )}
        </div>

        <div className="pt-3 border-t border-extrad-border flex justify-between items-baseline text-sm">
          <span className="font-extrabold text-extrad-dark uppercase">Total Amount</span>
          <span className="font-black text-lg text-extrad-dark">₹{finalAmount}</span>
        </div>
      </div>

      <button
        onClick={onProceed}
        disabled={disabled || cartItems.length === 0}
        className="w-full py-3.5 gradient-bg text-white font-extrabold text-xs uppercase tracking-widest rounded-xl shadow-lg hover:opacity-95 transition-opacity disabled:opacity-40"
      >
        {buttonText}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-400 pt-1">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>100% Safe & Secure Checkout</span>
      </div>
    </div>
  );
};

export default PriceSummary;
