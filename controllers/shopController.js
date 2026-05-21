const asyncHandler = require('express-async-handler');
const ShopProduct = require('../models/ShopProduct');

// @desc    Get all shop products (filter, search, pagination)
// @route   GET /api/shop
// @access  Public
const getShopProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    rating,
    sort = '-createdAt',
    page = 1,
    limit = 20,
    featured,
  } = req.query;

  const query = { isActive: true };

  if (keyword) {
    query.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
      { tags: { $regex: keyword, $options: 'i' } },
    ];
  }

  if (category) query.category = category;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (rating) query.rating = { $gte: Number(rating) };
  if (featured === 'true') query.isFeatured = true;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    ShopProduct.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    ShopProduct.countDocuments(query),
  ]);

  res.json({
    success: true,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    products,
  });
});

// @desc    Get single shop product
// @route   GET /api/shop/:id
// @access  Public
const getShopProduct = asyncHandler(async (req, res) => {
  const product = await ShopProduct.findOne({
    $or: [{ _id: req.params.id }, { slug: req.params.id }],
    isActive: true,
  }).populate('category', 'name slug');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, product });
});

// @desc    Get featured shop products
// @route   GET /api/shop/featured
// @access  Public
const getFeaturedShopProducts = asyncHandler(async (req, res) => {
  const products = await ShopProduct.find({ isActive: true, isFeatured: true })
    .populate('category', 'name slug')
    .sort('-rating')
    .lean();

  res.json({ success: true, total: products.length, products });
});

// @desc    Create shop product
// @route   POST /api/shop
// @access  Admin
const createShopProduct = asyncHandler(async (req, res) => {
  const product = await ShopProduct.create(req.body);
  res.status(201).json({ success: true, product });
});

// @desc    Update shop product
// @route   PUT /api/shop/:id
// @access  Admin
const updateShopProduct = asyncHandler(async (req, res) => {
  const product = await ShopProduct.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, product });
});

// @desc    Delete shop product (soft delete)
// @route   DELETE /api/shop/:id
// @access  Admin
const deleteShopProduct = asyncHandler(async (req, res) => {
  const product = await ShopProduct.findByIdAndUpdate(
    req.params.id,
    { isActive: false }
  );

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, message: 'Product removed' });
});

module.exports = {
  getShopProducts,
  getShopProduct,
  getFeaturedShopProducts,
  createShopProduct,
  updateShopProduct,
  deleteShopProduct,
};