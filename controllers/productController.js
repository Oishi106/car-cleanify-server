const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Get all products (with filter, search, pagination)
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    rating,
    sort = '-createdAt',
    page = 1,
    limit = 12,
    featured,
    popular,
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
  if (popular === 'true') query.popular = true;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    products,
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    $or: [{ _id: req.params.id }, { slug: req.params.id }],
    isActive: true,
  }).populate('category', 'name slug');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, product });
});

// @desc    Create product
// @route   POST /api/products
// @access  Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, product });
});

// @desc    Delete product (soft delete)
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({ success: true, message: 'Product removed' });
});

// @desc    Add review
// @route   POST /api/products/:id/reviews
// @access  Private
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating,
    comment,
  });

  product.updateRating();
  await product.save();

  res.status(201).json({ success: true, message: 'Review added' });
});

// @desc    Get popular services
// @route   GET /api/products/popular
// @access  Public
const getPopularProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true, popular: true })
    .populate('category', 'name slug')
    .sort('-rating')
    .lean();

  res.json({ success: true, total: products.length, products });
});

// @desc    Get services filtered by duration
// @route   GET /api/products/filter/duration?max=60
// @access  Public
const getProductsByDuration = asyncHandler(async (req, res) => {
  const { max } = req.query;

  const toMinutes = (str) => {
    if (!str) return 0;
    if (str.toLowerCase().includes('hour')) return parseFloat(str) * 60;
    return parseFloat(str) || 0;
  };

  const products = await Product.find({ isActive: true })
    .populate('category', 'name slug')
    .lean();

  const filtered = max
    ? products.filter((p) => toMinutes(p.duration) <= Number(max))
    : products;

  res.json({ success: true, total: filtered.length, products: filtered });
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getPopularProducts,
  getProductsByDuration,
};