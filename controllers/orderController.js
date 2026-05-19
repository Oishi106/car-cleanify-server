const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { items, scheduledDate, scheduledTime, address, paymentMethod, note } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items');
  }

  let itemsPrice = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product || !product.isActive) {
      throw new Error(`Service not found: ${item.product}`);
    }

    const price = product.discountPrice > 0 ? product.discountPrice : product.price;
    itemsPrice += price * item.quantity;

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.image || '',
      price,
      quantity: item.quantity,
    });
  }

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    address,
    scheduledDate,
    scheduledTime,
    paymentMethod,
    itemsPrice,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: itemsPrice,
    note,
  });

  res.status(201).json({ success: true, order });
});

// @desc    Get my orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ user: req.user._id })
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    Order.countDocuments({ user: req.user._id }),
  ]);

  res.json({ success: true, total, orders });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json({ success: true, order });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = status ? { status } : {};
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('user', 'name email phone')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit)),
    Order.countDocuments(query),
  ]);

  res.json({ success: true, total, orders });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, trackingNumber } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;

  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
  }

  await order.save();
  res.json({ success: true, order });
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (['delivered', 'cancelled'].includes(order.status)) {
    res.status(400);
    throw new Error(`Order already ${order.status}`);
  }

  order.status = 'cancelled';
  await order.save();

  res.json({ success: true, message: 'Order cancelled', order });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
};