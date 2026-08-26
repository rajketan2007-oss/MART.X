import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, User, LogOut, Package, Shield, Menu, X, ChevronRight, Sparkles, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { fetchAutosuggestionsApi } from '../../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchRef = useRef(null);

  // Debounced search auto-suggestion fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim().length > 1) {
        fetchAutosuggestionsApi(searchTerm.trim())
          .then((res) => {
            setSuggestions(res.data || []);
            setShowSuggestions(true);
          })
          .catch(() => setSuggestions([]));
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      navigate(`/shop?keyword=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleSuggestionClick = (productId) => {
    setShowSuggestions(false);
    setSearchTerm('');
    navigate(`/product/${productId}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-extrad-border shadow-nav transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo & Wordmark (MART.X) */}
          <div className="flex items-center gap-6 lg:gap-10 shrink-0">
            <Link to="/" className="flex items-center gap-1 group">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-black font-sans uppercase">
                MART<span className="text-black font-extrabold">.X</span>
              </span>
            </Link>

            {/* Desktop Navigation Links (SHOP.CO Style) */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-black">
              <Link to="/shop" className="hover:text-gray-600 transition-colors py-2 flex items-center gap-1 font-semibold">
                <span>Shop</span>
              </Link>
              <Link to="/shop?sort=discount" className="hover:text-gray-600 transition-colors py-2">
                On Sale
              </Link>
              <Link to="/shop?sort=newest" className="hover:text-gray-600 transition-colors py-2">
                New Arrivals
              </Link>
              <Link to="/shop" className="hover:text-gray-600 transition-colors py-2">
                Brands
              </Link>
            </nav>
          </div>

          {/* Functional Debounced Search Bar (Pill Shape) */}
          <div ref={searchRef} className="relative flex-1 max-w-xl hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative group">
              <input
                type="text"
                placeholder="Search for products, brands..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm.trim().length > 1 && setShowSuggestions(true)}
                className="w-full bg-[#F0F0F0] hover:bg-[#EAEAEA] text-sm font-normal pl-12 pr-4 py-3 rounded-full text-black placeholder-gray-500 border border-transparent focus:border-black/20 focus:bg-white focus:outline-none transition-all duration-200"
              />
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-500 group-focus-within:text-black transition-colors" />
            </form>

            {/* Search Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-extrad-border overflow-hidden z-50"
                >
                  <div className="p-2.5 text-xs font-black text-extrad-dark bg-gray-50 border-b border-extrad-border uppercase tracking-wider flex items-center justify-between">
                    <span>Products & Suggestions</span>
                    <span className="text-[10px] text-gray-400 font-normal">{suggestions.length} matches</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                    {suggestions.map((prod) => (
                      <div
                        key={prod._id}
                        onClick={() => handleSuggestionClick(prod._id)}
                        className="flex items-center gap-3 p-3 hover:bg-extrad-peach cursor-pointer transition-colors"
                      >
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-10 h-12 object-cover rounded-lg shadow-xs"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-extrad-dark uppercase truncate">{prod.brand}</p>
                          <p className="text-xs text-gray-600 truncate">{prod.name}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-extrad-dark">₹{prod.price}</span>
                          {prod.discountPercent > 0 && (
                            <span className="block text-[10px] text-emerald-600 font-black">
                              {prod.discountPercent}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Action Icons */}
          <div className="flex items-center gap-5 sm:gap-6">

            {/* Profile Dropdown */}
            <div className="relative" onMouseLeave={() => setShowProfileMenu(false)}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                onMouseEnter={() => setShowProfileMenu(true)}
                className="flex flex-col items-center text-extrad-dark hover:text-extrad-pink transition-colors focus:outline-none"
              >
                <User className="w-5 h-5" />
                <span className="text-[10px] font-black tracking-tight uppercase mt-1 hidden sm:block">
                  Profile
                </span>
              </motion.button>

              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-extrad-border p-4 z-50"
                  >
                    {user ? (
                      <div>
                        <div className="pb-3 mb-3 border-b border-extrad-border">
                          <p className="text-sm font-black text-extrad-dark">Hello, {user.name}</p>
                          <p className="text-xs text-extrad-muted truncate">{user.email}</p>
                          {isAdmin && (
                            <span className="inline-block mt-1 px-2.5 py-0.5 text-[10px] font-black bg-purple-100 text-purple-800 rounded-full">
                              ADMIN ACCESS
                            </span>
                          )}
                        </div>
                        <div className="space-y-1">
                          <Link
                            to="/profile"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-extrad-dark hover:bg-extrad-peach hover:text-extrad-pink rounded-xl transition-colors"
                          >
                            <User className="w-4 h-4" /> My Profile & Addresses
                          </Link>
                          <Link
                            to="/profile?tab=orders"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-extrad-dark hover:bg-extrad-peach hover:text-extrad-pink rounded-xl transition-colors"
                          >
                            <Package className="w-4 h-4" /> Orders & Tracking
                          </Link>
                          <Link
                            to="/wishlist"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-extrad-dark hover:bg-extrad-peach hover:text-extrad-pink rounded-xl transition-colors"
                          >
                            <Heart className="w-4 h-4" /> Wishlist ({wishlistCount})
                          </Link>

                          {isAdmin && (
                            <Link
                              to="/admin/dashboard"
                              onClick={() => setShowProfileMenu(false)}
                              className="flex items-center gap-3 px-3 py-2 text-xs font-bold text-purple-700 hover:bg-purple-50 rounded-xl transition-colors"
                            >
                              <Shield className="w-4 h-4" /> Admin Portal
                            </Link>
                          )}
                          
                          <button
                            onClick={() => {
                              setShowProfileMenu(false);
                              logout();
                            }}
                            className="flex items-center gap-3 w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          >
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h4 className="text-sm font-black text-extrad-dark mb-1 uppercase">Welcome to MART.X</h4>
                        <p className="text-xs text-extrad-muted mb-3">To access your wishlist & orders</p>
                        <div className="flex gap-2 mb-2">
                          <Link
                            to="/login"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex-1 text-center py-2.5 px-3 text-xs font-black text-extrad-pink border border-extrad-pink rounded-xl hover:bg-extrad-pink hover:text-white transition-colors"
                          >
                            LOGIN
                          </Link>
                          <Link
                            to="/signup"
                            onClick={() => setShowProfileMenu(false)}
                            className="flex-1 text-center py-2.5 px-3 text-xs font-black text-white gradient-bg rounded-xl shadow-neon-pink hover:opacity-95 transition-opacity"
                          >
                            SIGNUP
                          </Link>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist Link with Animated Counter */}
            <Link to="/wishlist" className="flex flex-col items-center text-extrad-dark hover:text-extrad-pink transition-colors relative">
              <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                <Heart className="w-5 h-5" />
              </motion.div>
              <span className="text-[10px] font-black tracking-tight uppercase mt-1 hidden sm:block">
                Wishlist
              </span>
              <AnimatePresence>
                {wishlistCount > 0 && (
                  <motion.span
                    key={wishlistCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-2 bg-extrad-pink text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-neon-pink"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Bag / Cart Link with Pop Animation */}
            <Link to="/cart" className="flex flex-col items-center text-extrad-dark hover:text-extrad-pink transition-colors relative">
              <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                <ShoppingBag className="w-5 h-5" />
              </motion.div>
              <span className="text-[10px] font-black tracking-tight uppercase mt-1 hidden sm:block">
                Bag
              </span>
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.3, 1] }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute -top-1.5 -right-2 gradient-bg text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-neon-pink"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-extrad-dark hover:text-extrad-pink focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search 3D luxury products, brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-extrad-light text-xs font-semibold pl-9 pr-3 py-2.5 rounded-xl text-extrad-dark border border-gray-200 focus:outline-none focus:border-extrad-pink"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          </form>
        </div>
      </div>

      {/* Mobile Sidebar Navigation Drawer with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white border-t border-extrad-border py-4 px-6 space-y-3 overflow-hidden shadow-2xl"
          >
            <Link
              to="/shop?gender=Men"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-sm font-black text-extrad-dark py-2 border-b border-gray-100 uppercase"
            >
              MEN <ChevronRight className="w-4 h-4 text-extrad-pink" />
            </Link>
            <Link
              to="/shop?gender=Women"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-sm font-black text-extrad-dark py-2 border-b border-gray-100 uppercase"
            >
              WOMEN <ChevronRight className="w-4 h-4 text-extrad-pink" />
            </Link>
            <Link
              to="/shop?gender=Kids"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-sm font-black text-extrad-dark py-2 border-b border-gray-100 uppercase"
            >
              KIDS <ChevronRight className="w-4 h-4 text-extrad-pink" />
            </Link>
            <Link
              to="/shop?category=home-decor"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-sm font-black text-extrad-dark py-2 border-b border-gray-100 uppercase"
            >
              HOME & LIVING <ChevronRight className="w-4 h-4 text-extrad-pink" />
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-sm font-black text-extrad-pink py-2 uppercase"
            >
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> NEW ARRIVALS
              </span>
              <ChevronRight className="w-4 h-4 text-extrad-pink" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
