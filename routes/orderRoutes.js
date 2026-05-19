const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

// ✅ /my আগে — /:id এর আগে রাখতে হবে
router.get('/my', protect, getMyOrders);

router.route('/')
  .get(protect, adminOnly, getAllOrders)
  .post(protect, createOrder);

router.get('/:id', protect, getOrder);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.put('/:id/cancel', protect, cancelOrder);  // ✅ নতুন

module.exports = router;