import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RefreshCw, Award, Send, Check } from 'lucide-react';
import { useUI } from '../../context/UIContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { addToast } = useUI();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      addToast('Thank you for subscribing to MART.X Insider!', 'success');
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-extrad-light border-t border-extrad-border mt-16 text-extrad-dark">
      {/* Guarantees Strip */}
      <div className="bg-white border-b border-extrad-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-extrad-peach text-extrad-pink flex items-center justify-center mb-2">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider">100% ORIGINAL</h4>
            <p className="text-xs text-extrad-muted mt-0.5">Guarantee for all products on mart.x</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-extrad-peach text-extrad-pink flex items-center justify-center mb-2">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider">14 DAY RETURNS</h4>
            <p className="text-xs text-extrad-muted mt-0.5">Return within 14 days of receiving order</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-extrad-peach text-extrad-pink flex items-center justify-center mb-2">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider">FREE SHIPPING</h4>
            <p className="text-xs text-extrad-muted mt-0.5">Get free shipping on orders above ₹999</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-extrad-peach text-extrad-pink flex items-center justify-center mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider">SECURE PAYMENTS</h4>
            <p className="text-xs text-extrad-muted mt-0.5">100% secure payment gateways</p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Column 1: Online Shopping */}
        <div>
          <h3 className="text-xs font-extrabold tracking-widest text-extrad-dark uppercase mb-4">
            ONLINE SHOPPING
          </h3>
          <ul className="space-y-2 text-xs font-medium text-extrad-muted">
            <li><Link to="/shop?gender=Men" className="hover:text-extrad-pink transition-colors">Men's Fashion</Link></li>
            <li><Link to="/shop?gender=Women" className="hover:text-extrad-pink transition-colors">Women's Fashion</Link></li>
            <li><Link to="/shop?gender=Kids" className="hover:text-extrad-pink transition-colors">Kids Wear</Link></li>
            <li><Link to="/shop?category=home-decor" className="hover:text-extrad-pink transition-colors">Home & Living</Link></li>
            <li><Link to="/shop?category=jewellery" className="hover:text-extrad-pink transition-colors">Jewellery & Accessories</Link></li>
            <li><Link to="/shop?category=watches-wearables" className="hover:text-extrad-pink transition-colors">Smartwatches & Gadgets</Link></li>
            <li><Link to="/shop" className="hover:text-extrad-pink transition-colors">MART.X Coupons</Link></li>
          </ul>
        </div>

        {/* Column 2: Customer Policies */}
        <div>
          <h3 className="text-xs font-extrabold tracking-widest text-extrad-dark uppercase mb-4">
            CUSTOMER POLICIES
          </h3>
          <ul className="space-y-2 text-xs font-medium text-extrad-muted">
            <li><Link to="/profile" className="hover:text-extrad-pink transition-colors">Contact Us</Link></li>
            <li><Link to="/profile?tab=orders" className="hover:text-extrad-pink transition-colors">Track Order</Link></li>
            <li><Link to="/profile" className="hover:text-extrad-pink transition-colors">Shipping Policy</Link></li>
            <li><Link to="/profile" className="hover:text-extrad-pink transition-colors">Cancellation & Returns</Link></li>
            <li><Link to="/profile" className="hover:text-extrad-pink transition-colors">Terms of Use</Link></li>
            <li><Link to="/profile" className="hover:text-extrad-pink transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Column 3: App Experience */}
        <div>
          <h3 className="text-xs font-extrabold tracking-widest text-extrad-dark uppercase mb-4">
            EXPERIENCE MART.X APP
          </h3>
          <p className="text-xs text-extrad-muted mb-4">
            Download our app for exclusive deals, instant price drops & early access to sale events.
          </p>
          <div className="flex gap-2 mb-6">
            <div className="border border-gray-300 rounded-lg p-2 bg-white flex items-center gap-2 text-[10px] font-bold cursor-pointer hover:border-extrad-pink transition-colors">
              <span>Google Play</span>
            </div>
            <div className="border border-gray-300 rounded-lg p-2 bg-white flex items-center gap-2 text-[10px] font-bold cursor-pointer hover:border-extrad-pink transition-colors">
              <span>App Store</span>
            </div>
          </div>
        </div>

        {/* Column 4: Newsletter Signup */}
        <div>
          <h3 className="text-xs font-extrabold tracking-widest text-extrad-dark uppercase mb-4">
            MART.X INSIDER NEWSLETTER
          </h3>
          <p className="text-xs text-extrad-muted mb-4">
            Subscribe to get 10% OFF your first order & weekly trend updates!
          </p>
          <form onSubmit={handleSubscribe} className="space-y-2">
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full text-xs bg-white text-extrad-dark px-3 py-2.5 rounded-lg border border-gray-300 focus:border-extrad-pink focus:outline-none pr-10"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 bottom-1 gradient-bg text-white px-3 rounded-md flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                {subscribed ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Copyright Strip */}
      <div className="border-t border-extrad-border py-4 bg-white text-center text-xs text-extrad-muted font-medium">
        <p>© 2026 MART.X E-Commerce Pvt. Ltd. All rights reserved. Styled for modern lifestyle.</p>
      </div>
    </footer>
  );
};

export default Footer;
