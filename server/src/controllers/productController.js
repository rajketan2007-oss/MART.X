const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc Fetch products with comprehensive search, filter, and sort
// @route GET /api/products
const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.pageSize) || 12;
    const page = Number(req.query.pageNumber) || 1;

    let query = {};

    // Search keyword
    if (req.query.keyword) {
      query.$or = [
        { name: { $regex: req.query.keyword, $options: 'i' } },
        { brand: { $regex: req.query.keyword, $options: 'i' } },
        { categoryName: { $regex: req.query.keyword, $options: 'i' } },
        { description: { $regex: req.query.keyword, $options: 'i' } }
      ];
    }

    // Category filter (slug or name)
    if (req.query.category) {
      const categories = req.query.category.split(',');
      const catDocs = await Category.find({
        $or: [
          { slug: { $in: categories } },
          { name: { $in: categories.map(c => new RegExp(c, 'i')) } }
        ]
      });
      if (catDocs.length > 0) {
        query.category = { $in: catDocs.map(c => c._id) };
      } else {
        query.categoryName = { $in: categories.map(c => new RegExp(c, 'i')) };
      }
    }

    // Brand filter
    if (req.query.brand) {
      const brands = req.query.brand.split(',');
      query.brand = { $in: brands.map(b => new RegExp(`^${b}$`, 'i')) };
    }

    // Size filter
    if (req.query.size) {
      const sizes = req.query.size.split(',');
      query.sizes = { $in: sizes };
    }

    // Color filter
    if (req.query.color) {
      const colors = req.query.color.split(',');
      query.colors = { $in: colors.map(c => new RegExp(c, 'i')) };
    }

    // Price filter
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Minimum discount filter
    if (req.query.minDiscount) {
      query.discountPercent = { $gte: Number(req.query.minDiscount) };
    }

    // Minimum rating filter
    if (req.query.minRating) {
      query.rating = { $gte: Number(req.query.minRating) };
    }

    // Gender filter
    if (req.query.gender) {
      query.gender = { $in: [req.query.gender, 'Unisex'] };
    }

    // Sort order
    let sort = { createdAt: -1 };
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-asc':
          sort = { price: 1 };
          break;
        case 'price-desc':
          sort = { price: -1 };
          break;
        case 'discount':
          sort = { discountPercent: -1 };
          break;
        case 'rating':
          sort = { rating: -1 };
          break;
        case 'popularity':
          sort = { numReviews: -1, rating: -1 };
          break;
        case 'newest':
          sort = { createdAt: -1 };
          break;
        default:
          sort = { createdAt: -1 };
      }
    }

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    // Get metadata for filter sidebar options
    const allBrands = await Product.distinct('brand');
    const allColors = await Product.distinct('colors');

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
      availableBrands: allBrands,
      availableColors: allColors
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get autosuggestions for live search dropdown
// @route GET /api/products/search/suggest
const getAutosuggestions = async (req, res) => {
  const q = req.query.q || '';
  if (!q || q.trim().length === 0) return res.json([]);

  const products = await Product.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { brand: { $regex: q, $options: 'i' } },
      { categoryName: { $regex: q, $options: 'i' } }
    ]
  }).select('name brand images categoryName price mrp discountPercent').limit(6);

  res.json(products);
};

// @desc Get single product by ID
// @route GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc Create a product (Admin)
// @route POST /api/products
const createProduct = async (req, res) => {
  try {
    const { name, brand, categoryId, description, price, mrp, images, sizes, colors, stock, gender } = req.body;

    const categoryDoc = await Category.findById(categoryId);
    if (!categoryDoc) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    const product = new Product({
      name,
      brand,
      category: categoryDoc._id,
      categoryName: categoryDoc.name,
      description,
      price: Number(price),
      mrp: Number(mrp),
      discountPercent,
      images: Array.isArray(images) ? images : [images],
      sizes: sizes || ['S', 'M', 'L', 'XL'],
      colors: colors || ['Black', 'White', 'Blue'],
      stock: Number(stock) || 10,
      gender: gender || 'Unisex'
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Update product (Admin)
// @route PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.name = req.body.name || product.name;
    product.brand = req.body.brand || product.brand;
    product.description = req.body.description || product.description;
    product.price = req.body.price !== undefined ? Number(req.body.price) : product.price;
    product.mrp = req.body.mrp !== undefined ? Number(req.body.mrp) : product.mrp;
    product.stock = req.body.stock !== undefined ? Number(req.body.stock) : product.stock;
    if (req.body.images) product.images = req.body.images;
    if (req.body.sizes) product.sizes = req.body.sizes;
    if (req.body.colors) product.colors = req.body.colors;

    if (req.body.categoryId) {
      const categoryDoc = await Category.findById(req.body.categoryId);
      if (categoryDoc) {
        product.category = categoryDoc._id;
        product.categoryName = categoryDoc.name;
      }
    }

    if (product.mrp > product.price) {
      product.discountPercent = Math.round(((product.mrp - product.price) / product.mrp) * 100);
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Delete product (Admin)
// @route DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

module.exports = {
  getProducts,
  getAutosuggestions,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
