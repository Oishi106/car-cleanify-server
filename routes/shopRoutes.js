const express = require('express');
const router = express.Router();
const {
  getShopProducts,
  getShopProduct,
  getFeaturedShopProducts,
  createShopProduct,
  updateShopProduct,
  deleteShopProduct,
} = require('../controllers/shopController');
const { protect, adminOnly } = require('../middleware/auth');

// ✅ Specific routes আগে
router.get('/featured', getFeaturedShopProducts);

router.route('/')
  .get(getShopProducts)
  .post(protect, adminOnly, createShopProduct);

router.route('/:id')
  .get(getShopProduct)
  .put(protect, adminOnly, updateShopProduct)
  .delete(protect, adminOnly, deleteShopProduct);

module.exports = router;