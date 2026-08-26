const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc Get user cart
// @route GET /api/cart
const getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.product',
    select: 'name brand images price mrp discountPercent stock sizes colors categoryName'
  });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  res.json(cart);
};

// @desc Add item to cart
// @route POST /api/cart
const addToCart = async (req, res) => {
  const { productId, quantity, size, color } = req.body;
  const qty = Number(quantity) || 1;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const existingIndex = cart.items.findIndex(
    item => item.product.toString() === productId && item.size === (size || 'M')
  );

  if (existingIndex > -1) {
    cart.items[existingIndex].quantity += qty;
  } else {
    cart.items.push({
      product: productId,
      quantity: qty,
      size: size || (product.sizes && product.sizes[0]) || 'M',
      color: color || (product.colors && product.colors[0]) || ''
    });
  }

  await cart.save();

  const updatedCart = await Cart.findById(cart._id).populate({
    path: 'items.product',
    select: 'name brand images price mrp discountPercent stock sizes colors categoryName'
  });

  res.json(updatedCart);
};

// @desc Update cart item quantity/size
// @route PUT /api/cart/:itemId
const updateCartItem = async (req, res) => {
  const { quantity, size, color } = req.body;
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  const item = cart.items.id(req.params.itemId);
  if (!item) return res.status(404).json({ message: 'Item not found in cart' });

  if (quantity !== undefined) item.quantity = Math.max(1, Number(quantity));
  if (size) item.size = size;
  if (color) item.color = color;

  await cart.save();

  const updatedCart = await Cart.findById(cart._id).populate({
    path: 'items.product',
    select: 'name brand images price mrp discountPercent stock sizes colors categoryName'
  });

  res.json(updatedCart);
};

// @desc Remove item from cart
// @route DELETE /api/cart/:itemId
const removeFromCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });

  cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
  await cart.save();

  const updatedCart = await Cart.findById(cart._id).populate({
    path: 'items.product',
    select: 'name brand images price mrp discountPercent stock sizes colors categoryName'
  });

  res.json(updatedCart);
};

// @desc Clear cart
// @route DELETE /api/cart
const clearCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.json({ message: 'Cart cleared', items: [] });
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
