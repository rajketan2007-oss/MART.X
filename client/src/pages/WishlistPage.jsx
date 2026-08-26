import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { triggerConfetti } from '../utils/confetti';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToBag = (product, pId) => {
    addToCart(product, 1, product.sizes?.[0] || 'M');
    removeFromWishlist(pId);
    triggerConfetti({ particleCount: 35, spread: 45 });
  };

  if (wishlistItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-2 shadow-lg shadow-rose-100"
        >
          <Heart className="w-10 h-10" />
        </motion.div>
        <h2 className="text-xl font-black text-extrad-dark uppercase tracking-wider">
          YOUR WISHLIST IS EMPTY
        </h2>
        <p className="text-xs text-extrad-muted max-w-sm mx-auto font-medium">
          Save items you love to your wishlist so you can revisit them anytime and move them straight to your bag!
        </p>
        <Link
          to="/shop"
          className="inline-block gradient-bg text-white text-xs font-black px-7 py-3.5 rounded-xl uppercase tracking-widest shadow-neon-pink hover:opacity-95 transition-opacity"
        >
          EXPLORE FASHION COLLECTIONS
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6"
    >
      <div className="flex items-center justify-between pb-4 border-b border-extrad-border">
        <div>
          <h1 className="text-xl font-black text-extrad-dark uppercase tracking-wider flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span>MY WISHLIST</span>
          </h1>
          <p className="text-xs text-extrad-muted font-medium">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        <Link to="/shop" className="text-xs font-black text-extrad-pink hover:underline uppercase">
          + Continue Browsing
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <AnimatePresence>
          {wishlistItems.map((product, idx) => {
            const pId = product._id || product.id;
            return (
              <motion.div
                key={pId}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl border border-extrad-border overflow-hidden shadow-xs hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 group">
                  <Link to={`/product/${pId}`}>
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeFromWishlist(pId)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 text-gray-500 hover:text-rose-600 flex items-center justify-center shadow-md backdrop-blur-xs"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="text-xs font-black text-extrad-dark uppercase tracking-wider truncate">
                      {product.brand}
                    </h4>
                    <p className="text-xs text-extrad-muted truncate font-normal">{product.name}</p>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-black text-extrad-dark">₹{product.price}</span>
                    {product.mrp > product.price && (
                      <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleMoveToBag(product, pId)}
                    className="w-full py-3 gradient-bg text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-neon-pink hover:opacity-95 transition-opacity flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" /> MOVE TO BAG
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default WishlistPage;
