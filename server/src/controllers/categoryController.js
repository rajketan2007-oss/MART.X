const Category = require('../models/Category');

// @desc Get all categories
// @route GET /api/categories
const getCategories = async (req, res) => {
  const categories = await Category.find({}).sort({ createdAt: 1 });
  res.json(categories);
};

// @desc Create category (Admin)
// @route POST /api/categories
const createCategory = async (req, res) => {
  const { name, slug, image, discountTag, description } = req.body;
  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    return res.status(400).json({ message: 'Category already exists' });
  }

  const category = await Category.create({
    name,
    slug: slug || name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    image,
    discountTag: discountTag || '30-70% OFF',
    description: description || ''
  });

  res.status(201).json(category);
};

module.exports = { getCategories, createCategory };
