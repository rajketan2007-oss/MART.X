import React, { useState } from 'react';
import { Tag, X, Copy, Check, Ticket, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';
import { triggerConfetti } from '../../utils/confetti';

const couponsList = [
  {
    code: 'EXTRAD300',
    title: 'FLAT ₹300 OFF',
    minOrder: 999,
    description: 'Save flat ₹300 on any purchase above ₹999.',
    tag: 'POPULAR'
  },
  {
    code: 'WELCOME100',
    title: 'WELCOME ₹100 OFF',
    minOrder: 499,
    description: 'Flat ₹100 discount on orders above ₹499.',
    tag: 'NEW USERS'
  },
  {
    code: 'FASHION20',
    title: '20% OFF UPTO ₹500',
    minOrder: 1499,
    description: 'Get 20% off up to ₹500 on luxury and fashion styles.',
    tag: 'SPECIAL'
  }
];

const CouponDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [appliedCode, setAppliedCode] = useState('');
  const { applyCoupon } = useCart();
  const { addToast } = useUI();

  const handleApply = (code) => {
    setAppliedCode(code);
    applyCoupon(code);
    triggerConfetti({ particleCount: 40, spread: 50 });
    setTimeout(() => setAppliedCode(''), 3000);
  };

  return (
    <>
      {/* Floating vertical side tab trigger */}
      <motion.button
        whileHover={{ scale: 1.05, x: -3 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-gradient-to-r from-extrad-pink to-extrad-orange text-white text-xs font-black py-4 px-2.5 rounded-l-2xl shadow-neon-pink flex flex-col items-center gap-2 group transition-all"
        style={{ writingMode: 'vertical-rl' }}
      >
        <div className="flex items-center gap-1.5 transform rotate-180">
          <Ticket className="w-4 h-4 text-amber-300 animate-pulse" />
          <span className="tracking-widest uppercase text-[11px]">COUPONS • ₹300 OFF</span>
        </div>
      </motion.button>

      {/* Drawer Overlay with AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 transition-opacity"
          />
        )}
      </AnimatePresence>

      {/* Slide-out Drawer Panel with Framer Motion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-80 sm:w-96 bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="gradient-bg text-white p-5 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Tag className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-black text-base uppercase tracking-tight">Extrad Coupon Corner</h3>
                  <p className="text-xs text-white/80 font-medium">Available promo codes for extra savings</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Coupons List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {couponsList.map((c, idx) => (
                <motion.div
                  key={c.code}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-2xl border border-extrad-border p-4 shadow-xs hover:shadow-card-hover transition-all relative overflow-hidden group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black bg-extrad-peach text-extrad-pink px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {c.tag}
                    </span>
                    <span className="text-xs font-bold text-gray-500">
                      Min. Order: ₹{c.minOrder}
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-extrad-dark mb-1">{c.title}</h4>
                  <p className="text-xs text-extrad-muted mb-3 font-medium">{c.description}</p>

                  <div className="flex items-center justify-between bg-gray-50 p-2.5 rounded-xl border border-dashed border-gray-300">
                    <span className="text-xs font-black text-extrad-dark tracking-widest uppercase">
                      {c.code}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApply(c.code)}
                      className={`text-xs font-black px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all uppercase tracking-wider ${
                        appliedCode === c.code
                          ? 'bg-emerald-500 text-white shadow-emerald-500/50'
                          : 'gradient-bg text-white shadow-xs hover:opacity-90'
                      }`}
                    >
                      {appliedCode === c.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 animate-bounce" /> APPLIED!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> APPLY CODE
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-4 border-t border-extrad-border bg-white text-center">
              <p className="text-xs text-extrad-muted font-medium">
                Coupons will be automatically deducted from your checkout total.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CouponDrawer;
