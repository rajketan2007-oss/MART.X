const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc Add review to product
// @route POST /api/reviews
const createReview = async (req, res) => {
  const { productId, rating, comment } = req.body;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  const alreadyReviewed = await Review.findOne({
    product: productId,
    user: req.user._id
  });

  if (alreadyReviewed) {
    return res.status(400).json({ message: 'Product already reviewed by you' });
  }

  const review = await Review.create({
    product: productId,
    user: req.user._id,
    userName: req.user.name,
    rating: Number(rating),
    comment
  });

  // Recalculate average product rating
  const reviews = await Review.find({ product: productId });
  const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

  product.rating = Number(avgRating.toFixed(1));
  product.numReviews = reviews.length;
  await product.save();

  res.status(201).json(review);
};

// @desc Get reviews for product
// @route GET /api/reviews/product/:productId
const getProductReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
  res.json(reviews);
};

module.exports = { createReview, getProductReviews };
