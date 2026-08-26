const Wishlist = require('../models/Wishlist');

// @desc Get user wishlist
// @route GET /api/wishlist
const getWishlist = async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
    path: 'products',
    select: 'name brand images price mrp discountPercent rating numReviews stock categoryName'
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  }

  res.json(wishlist);
};

// @desc Toggle item in wishlist (Add if not present, Remove if present)
// @route POST /api/wishlist/toggle
const toggleWishlist = async (req, res) => {
  const { productId } = req.body;
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) {
    wishlist = new Wishlist({ user: req.user._id, products: [] });
  }

  const exists = wishlist.products.includes(productId);
  if (exists) {
    wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
  } else {
    wishlist.products.push(productId);
  }

  await wishlist.save();

  const updatedWishlist = await Wishlist.findById(wishlist._id).populate({
    path: 'products',
    select: 'name brand images price mrp discountPercent rating numReviews stock categoryName'
  });

  res.json({ wishlist: updatedWishlist, added: !exists });
};

// @desc Remove product from wishlist
// @route DELETE /api/wishlist/:productId
const removeFromWishlist = async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

  wishlist.products = wishlist.products.filter(id => id.toString() !== req.params.productId);
  await wishlist.save();

  const updatedWishlist = await Wishlist.findById(wishlist._id).populate({
    path: 'products',
    select: 'name brand images price mrp discountPercent rating numReviews stock categoryName'
  });

  res.json(updatedWishlist);
};

module.exports = { getWishlist, toggleWishlist, removeFromWishlist };
