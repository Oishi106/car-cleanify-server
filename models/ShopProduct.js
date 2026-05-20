const mongoose = require('mongoose');

const shopProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    oldPrice: { type: Number, default: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    image: { type: String, default: '' },
    stock: { type: Number, default: 0 },
    badge: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    tags: [String],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShopProduct', shopProductSchema);