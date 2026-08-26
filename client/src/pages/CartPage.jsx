import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import CartItem from '../components/cart/CartItem';
import CouponInput from '../components/cart/CouponInput';
import PriceSummary from '../components/cart/PriceSummary';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-extrad-peach text-extrad-pink flex items-center justify-center mx-auto mb-2">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-black text-extrad-dark uppercase tracking-wider">
          YOUR SHOPPING BAG IS EMPTY
        </h2>
        <p className="text-xs text-extrad-muted max-w-sm mx-auto">
          Explore our latest fashion collections, luxury accessories, and home decor items to add your favorites!
        </p>
        <Link
          to="/shop"
          className="inline-block gradient-bg text-white text-xs font-extrabold px-6 py-3.5 rounded-xl uppercase tracking-widest shadow-lg hover:opacity-90 transition-opacity"
        >
          START SHOPPING
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-xl font-black text-extrad-dark uppercase tracking-wider pb-4 border-b border-extrad-border">
        MY SHOPPING BAG ({cartItems.length} {cartItems.length === 1 ? 'ITEM' : 'ITEMS'})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Bag Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>

        {/* Right: Coupon & Price Details */}
        <div className="lg:col-span-1 space-y-6">
          <CouponInput />
          <PriceSummary
            onProceed={() => navigate('/checkout')}
            buttonText="PROCEED TO CHECKOUT"
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;
