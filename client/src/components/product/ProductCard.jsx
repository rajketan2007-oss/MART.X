import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';
import RatingStars from '../common/RatingStars';
import { triggerConfetti } from '../../utils/confetti';

const ProductCard = ({ product, index = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef(null);

  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useUI();

  const productId = product._id || product.id;
  const inWishlist = isInWishlist(productId);

  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80';
  const hoverImage = product.images?.[1] || mainImage;

  // 3D Card Tilt on Mouse Move
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -8;
    const rY = ((x - centerX) / centerX) * 8;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.sizes?.[0] || 'M');
    setIsAdded(true);
    triggerConfetti({ particleCount: 35, spread: 45, origin: { y: 0.8 } });
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className="perspective-1000 h-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        animate={{
          rotateX: rotateX,
          rotateY: rotateY,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="group relative bg-white rounded-2xl border border-extrad-border overflow-hidden shadow-sm hover:shadow-card-hover transition-shadow duration-300 flex flex-col h-full preserve-3d"
      >
        {/* Image Container with Hover Flip & Wishlist Toggle */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <Link to={`/product/${productId}`}>
            <img
              src={isHovered ? hoverImage : mainImage}
              alt={product.name}
              className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-108"
              loading="lazy"
            />
          </Link>

          {/* Shimmer Highlight on Hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />

          {/* Floating Brand Discount Badge */}
          {product.discountPercent > 0 && (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: isHovered ? 1.08 : 1 }}
              className="absolute top-3 left-3 bg-gradient-to-r from-extrad-pink to-extrad-orange text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1 z-10"
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>{product.discountPercent}% OFF</span>
            </motion.div>
          )}

          {/* Wishlist Floating Toggle Button with Pop Animation */}
          <motion.button
            whileTap={{ scale: 0.75 }}
            whileHover={{ scale: 1.15 }}
            onClick={handleWishlistClick}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-colors duration-200 shadow-md z-10 ${
              inWishlist
                ? 'bg-rose-50 text-rose-500 border border-rose-200'
                : 'bg-white/85 text-gray-700 hover:text-rose-500 hover:bg-white'
            }`}
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <motion.div
              animate={inWishlist ? { scale: [1, 1.35, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
            </motion.div>
          </motion.button>

          {/* Rating Badge Overlay */}
          {product.rating > 0 && (
            <div className="absolute bottom-2 left-2 backdrop-blur-md bg-white/90 px-2 py-0.5 rounded-lg text-[11px] shadow-xs flex items-center gap-1 z-10">
              <RatingStars rating={product.rating} numReviews={product.numReviews} />
            </div>
          )}

          {/* Quick Add to Bag Overlay Button */}
          <div className="absolute bottom-0 left-0 right-0 p-2.5 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-gradient-to-t from-black/70 via-black/40 to-transparent z-20">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleQuickAdd}
              className={`w-full py-2.5 font-extrabold text-xs rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-1.5 uppercase tracking-wider ${
                isAdded
                  ? 'bg-emerald-500 text-white shadow-emerald-500/50'
                  : 'bg-white text-extrad-dark hover:bg-extrad-pink hover:text-white'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 animate-bounce" /> Added to Bag
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Product Information */}
        <div className="p-3.5 flex flex-col flex-1 justify-between bg-white">
          <div>
            <h3 className="text-xs font-black text-extrad-dark uppercase tracking-wider truncate mb-0.5">
              {product.brand}
            </h3>
            <Link to={`/product/${productId}`}>
              <p className="text-xs text-extrad-muted font-normal truncate hover:text-extrad-pink transition-colors">
                {product.name}
              </p>
            </Link>
          </div>

          <div className="mt-2.5">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-black text-extrad-dark">₹{product.price}</span>
              {product.mrp > product.price && (
                <>
                  <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
                  <span className="text-[11px] font-black text-amber-600 uppercase tracking-tight">
                    ({product.discountPercent || Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF)
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductCard;
