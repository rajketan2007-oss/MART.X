import React, { useState } from 'react';
import { Tag, X, Sparkles, Copy, Check } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useCart } from '../../context/CartContext';

const PromoStrip = () => {
  const [dismissed, setDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const { addToast } = useUI();
  const { applyCoupon } = useCart();

  if (dismissed) return null;

  const handleCopyAndApply = () => {
    navigator.clipboard.writeText('EXTRAD300');
    setCopied(true);
    applyCoupon('EXTRAD300');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-extrad-dark via-slate-800 to-extrad-dark text-white text-xs font-semibold py-2 px-4 shadow-sm relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            onClick={() => setShowModal(true)}
            className="flex-1 flex items-center justify-center gap-2 cursor-pointer hover:underline"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>FLAT ₹300 OFF on your first purchase! Use Code: <strong className="text-amber-300 tracking-wider underline">EXTRAD300</strong></span>
            <span className="hidden sm:inline bg-extrad-pink text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ml-2">
              CLAIM NOW
            </span>
          </div>

          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Coupon Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-extrad-peach">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-extrad-peach text-extrad-pink flex items-center justify-center mx-auto mb-3">
                <Tag className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-extrad-dark mb-1">Welcome Discount Offer</h3>
              <p className="text-xs text-extrad-muted mb-6">
                Get flat ₹300 instant discount on orders of ₹999 or more across fashion, accessories, and electronics!
              </p>

              <div className="bg-dashed border-2 border-dashed border-extrad-pink bg-extrad-peach/50 p-4 rounded-xl flex items-center justify-between gap-3 mb-6">
                <div>
                  <span className="text-xs font-bold text-extrad-muted block">PROMO CODE</span>
                  <span className="text-xl font-black text-extrad-dark tracking-widest">EXTRAD300</span>
                </div>
                <button
                  onClick={handleCopyAndApply}
                  className="gradient-bg text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" /> APPLIED
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> COPY & APPLY
                    </>
                  )}
                </button>
              </div>

              <div className="text-left text-xs text-extrad-muted space-y-1.5 bg-gray-50 p-3 rounded-lg">
                <p>• Valid for new & existing registered shoppers</p>
                <p>• Minimum cart subtotal: ₹999</p>
                <p>• Applies automatically to all fashion categories</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PromoStrip;
