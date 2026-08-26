import React, { useState } from 'react';
import { Tag, Check, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CouponInput = () => {
  const [code, setCode] = useState('');
  const [applying, setApplying] = useState(false);
  const { applyCoupon, removeCoupon, coupon } = useCart();

  const handleApply = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setApplying(true);
    await applyCoupon(code.trim());
    setApplying(false);
    setCode('');
  };

  if (coupon) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-black text-emerald-900 tracking-wider">
              COUPON '{coupon.code}' APPLIED
            </span>
            <p className="text-[11px] text-emerald-700 font-semibold">
              You saved ₹{coupon.discountAmount} on this order!
            </p>
          </div>
        </div>
        <button
          onClick={removeCoupon}
          className="text-xs font-bold text-rose-600 hover:underline p-1"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleApply} className="bg-white rounded-xl border border-extrad-border p-4">
      <div className="flex items-center gap-2 mb-2">
        <Tag className="w-4 h-4 text-extrad-pink" />
        <span className="text-xs font-extrabold text-extrad-dark uppercase tracking-wider">
          APPLY COUPON
        </span>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter promo code (e.g. EXTRAD300)"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="flex-1 text-xs bg-extrad-light px-3 py-2 rounded-lg text-extrad-dark font-semibold border border-transparent focus:border-extrad-pink focus:bg-white focus:outline-none uppercase"
        />
        <button
          type="submit"
          disabled={applying || !code.trim()}
          className="gradient-bg text-white text-xs font-extrabold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {applying ? 'Checking...' : 'APPLY'}
        </button>
      </div>
    </form>
  );
};

export default CouponInput;
