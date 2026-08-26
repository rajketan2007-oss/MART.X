import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Zap, Truck, ShieldCheck, RefreshCw, Star, Check, Sparkles, Box, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProductByIdApi, fetchProductReviewsApi } from '../services/api';
import ImageGallery from '../components/product/ImageGallery';
import RatingStars from '../components/common/RatingStars';
import ReviewForm from '../components/product/ReviewForm';
import SimilarProducts from '../components/product/SimilarProducts';
import Product3DViewer from '../components/3d/Product3DViewer';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useUI } from '../context/UIContext';
import { triggerConfetti } from '../utils/confetti';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useUI();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [viewMode, setViewMode] = useState('gallery'); // 'gallery' or '3d'
  const [isAdding, setIsAdding] = useState(false);

  const inWishlist = product ? isInWishlist(product._id || product.id) : false;

  useEffect(() => {
    setLoading(true);
    fetchProductByIdApi(id)
      .then((res) => {
        setProduct(res.data);
        if (res.data.sizes && res.data.sizes.length > 0) {
          setSelectedSize(res.data.sizes[0]);
        }
        if (res.data.colors && res.data.colors.length > 0) {
          setSelectedColor(res.data.colors[0]);
        }
        loadReviews(id);
      })
      .catch((err) => {
        console.error(err);
        addToast('Product not found', 'error');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const loadReviews = (prodId) => {
    fetchProductReviewsApi(prodId)
      .then((res) => setReviews(res.data || []))
      .catch(() => setReviews([]));
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.length === 6) {
      setPincodeStatus({
        checked: true,
        message: 'Delivery available! Free express delivery in 2-3 business days.'
      });
    } else {
      setPincodeStatus({
        checked: false,
        message: 'Please enter a valid 6-digit postal pincode.'
      });
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, 1, selectedSize, selectedColor);
    setIsAdding(true);
    triggerConfetti({ particleCount: 50, spread: 60 });
    setTimeout(() => setIsAdding(false), 1500);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, 1, selectedSize, selectedColor);
    triggerConfetti({ particleCount: 60, spread: 70 });
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-[3/4] bg-gray-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 w-1/3 rounded-xl" />
            <div className="h-8 bg-gray-200 w-3/4 rounded-xl" />
            <div className="h-10 bg-gray-200 w-1/2 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12"
    >
      {/* Product Details Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: 2D Gallery / 3D Viewer Switcher */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* View Mode Toggle Bar */}
          <div className="flex items-center justify-between bg-gray-100 p-1.5 rounded-2xl">
            <div className="flex items-center gap-2 px-2">
              <span className="text-xs font-black text-extrad-dark uppercase tracking-wider">
                Visual Inspection:
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setViewMode('3d')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-all ${
                  viewMode === '3d'
                    ? 'gradient-bg text-white shadow-neon-pink scale-102'
                    : 'text-gray-600 hover:text-extrad-dark hover:bg-white/50'
                }`}
              >
                <Box className="w-4 h-4" /> 3D 360° Studio
              </button>
              <button
                onClick={() => setViewMode('gallery')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 transition-all ${
                  viewMode === 'gallery'
                    ? 'bg-white text-extrad-dark shadow-md'
                    : 'text-gray-600 hover:text-extrad-dark hover:bg-white/50'
                }`}
              >
                <ImageIcon className="w-4 h-4" /> Photo Gallery
              </button>
            </div>
          </div>

          {/* Interactive Viewer Viewport */}
          <AnimatePresence mode="wait">
            {viewMode === '3d' ? (
              <motion.div
                key="3d"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
              >
                <Product3DViewer
                  categoryName={product.categoryName || product.category || 'Fashion'}
                  productName={product.name}
                />
              </motion.div>
            ) : (
              <motion.div
                key="gallery"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
              >
                <ImageGallery images={product.images || []} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Product Meta & Purchase Options */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-extrabold text-extrad-pink bg-extrad-peach px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {product.categoryName || 'Extrad Luxury'}
              </span>
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                In Stock ({product.stock} left)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-extrad-dark uppercase tracking-wider leading-tight">
              {product.brand}
            </h1>
            <p className="text-sm text-extrad-muted font-normal mt-1 leading-relaxed">{product.name}</p>

            <div className="flex items-center gap-3 mt-3">
              <RatingStars rating={product.rating} numReviews={product.numReviews} size="lg" />
              <span className="text-xs text-gray-300">|</span>
              <span className="text-xs font-bold text-gray-500">
                {product.numReviews || 12} Verified Customer Ratings
              </span>
            </div>
          </div>

          {/* Pricing Banner with Animated Glow */}
          <div className="p-4 bg-gradient-to-r from-extrad-peach via-[#FFF5F7] to-white rounded-2xl border border-extrad-peach flex items-baseline gap-3 shadow-xs">
            <span className="text-3xl font-black text-extrad-dark">₹{product.price}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-base text-gray-400 line-through">₹{product.mrp}</span>
                <span className="text-xs font-black text-amber-600 uppercase tracking-tight bg-amber-50 px-2 py-1 rounded-lg">
                  ({product.discountPercent}% OFF - SAVE ₹{product.mrp - product.price})
                </span>
              </>
            )}
          </div>

          {/* Size Selector with Animated Buttons */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-extrad-dark uppercase tracking-wider">
                  SELECT SIZE
                </span>
                <span className="text-[11px] font-bold text-extrad-pink hover:underline cursor-pointer">
                  SIZE CHART & FIT GUIDE
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((sz) => (
                  <motion.button
                    key={sz}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2.5 text-xs font-black rounded-xl border transition-all ${
                      selectedSize === sz
                        ? 'gradient-bg text-white border-transparent shadow-neon-pink'
                        : 'bg-white text-extrad-dark border-gray-200 hover:border-extrad-pink'
                    }`}
                  >
                    {sz}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons: Add to Bag, Wishlist, Buy Now */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleAddToCart}
                className={`flex-1 py-4 font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 ${
                  isAdding
                    ? 'bg-emerald-500 text-white shadow-emerald-500/50'
                    : 'gradient-bg text-white shadow-neon-pink hover:opacity-95'
                }`}
              >
                {isAdding ? (
                  <>
                    <Check className="w-4 h-4 animate-bounce" /> ADDED TO BAG!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> ADD TO BAG
                  </>
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleWishlist(product)}
                className={`px-6 py-4 border rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xs ${
                  inWishlist
                    ? 'border-rose-300 bg-rose-50 text-rose-600'
                    : 'border-extrad-border bg-white text-extrad-dark hover:border-extrad-pink'
                }`}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-600' : ''}`} />
                <span>{inWishlist ? 'WISHLISTED' : 'WISHLIST'}</span>
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleBuyNow}
              className="w-full py-4 bg-extrad-dark text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg hover:bg-black transition-colors flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" /> BUY NOW (EXPRESS CHECKOUT)
            </motion.button>
          </div>

          {/* Delivery & Pincode Checker */}
          <div className="p-4 bg-white rounded-2xl border border-extrad-border space-y-3 shadow-xs">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-extrad-pink" />
              <span className="text-xs font-black text-extrad-dark uppercase tracking-wider">
                DELIVERY & PINCODE CHECK
              </span>
            </div>
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                maxLength="6"
                placeholder="Enter Pincode (e.g. 560001)"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="flex-1 text-xs bg-extrad-light px-3.5 py-2.5 rounded-xl text-extrad-dark border border-gray-200 focus:outline-none focus:border-extrad-pink transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="text-xs font-black text-white gradient-bg px-5 py-2.5 rounded-xl hover:opacity-95 transition-opacity shadow-sm uppercase tracking-wider"
              >
                CHECK
              </motion.button>
            </form>
            {pincodeStatus && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-xs font-bold ${
                  pincodeStatus.checked ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {pincodeStatus.message}
              </motion.p>
            )}
          </div>

          {/* Assurance Badges */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs font-bold text-gray-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Original Guarantee</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100 text-xs font-bold text-gray-700">
              <RefreshCw className="w-4 h-4 text-extrad-pink shrink-0" />
              <span>14-Day Free Exchange</span>
            </div>
          </div>

          {/* Product Description */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-black text-extrad-dark uppercase tracking-wider">
              PRODUCT DETAILS & FABRIC SPECS
            </h3>
            <p className="text-xs text-extrad-muted leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-2xl border border-gray-100">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="pt-8 border-t border-extrad-border space-y-8">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-extrad-pink" />
          <h3 className="text-lg font-black text-extrad-dark uppercase tracking-wider">
            CUSTOMER REVIEWS & EXPERIENCES ({reviews.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Review Form */}
          <div className="md:col-span-1">
            <ReviewForm
              productId={product._id || product.id}
              onReviewAdded={() => loadReviews(product._id || product.id)}
            />
          </div>

          {/* Review Cards List with Animations */}
          <div className="md:col-span-2 space-y-4">
            {reviews.length === 0 ? (
              <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 text-center space-y-2">
                <Sparkles className="w-6 h-6 text-extrad-pink mx-auto" />
                <p className="text-xs text-extrad-muted font-bold">
                  No reviews yet. Be the first to rate this product!
                </p>
              </div>
            ) : (
              reviews.map((rev, idx) => (
                <motion.div
                  key={rev._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white p-5 rounded-2xl border border-extrad-border space-y-2 shadow-xs"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-extrad-dark">{rev.userName}</span>
                    <RatingStars rating={rev.rating} />
                  </div>
                  <p className="text-xs text-extrad-muted leading-relaxed">{rev.comment}</p>
                  <span className="text-[10px] text-gray-400 block font-medium">
                    Verified Buyer • {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Similar Products Carousel */}
      <SimilarProducts
        categoryName={product.categoryName}
        currentProductId={product._id || product.id}
      />
    </motion.div>
  );
};

export default ProductDetailPage;
