const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getPopularProducts,
  getProductsByDuration,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

// ✅ Specific routes আগে — /:id এর আগে রাখতে হবে
router.get('/popular', getPopularProducts);
router.get('/filter/duration', getProductsByDuration);

// Main CRUD
router.route('/')
  .get(getProducts)
  .post(protect, adminOnly, createProduct);

router.route('/:id')
  .get(getProduct)
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

// Review
router.post('/:id/reviews', protect, addReview);

module.exports = router;