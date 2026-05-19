const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,        // ✅ রাখো — category filter কাজে লাগবে
    },

    // ✅ Car cleaning এর জন্য নতুন fields
    duration: {
      type: String,          // "30 mins", "2 hours", "Monthly"
      required: [true, 'Service duration is required'],
    },
    features: {
      type: [String],        // ["Foam Wash", "Tire Cleaning", ...]
      default: [],
    },
    popular: {
      type: Boolean,
      default: false,
    },

    // ✅ Single image (তোমার JSON অনুযায়ী)
    image: {
      type: String,
      default: '',
    },

    tags: [String],          // ✅ রাখো — search/filter এ কাজে লাগবে

    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,        // ✅ রাখো — homepage featured section
    },
    isActive: {
      type: Boolean,
      default: true,         // ✅ রাখো — service hide/show control
    },
  },
  { timestamps: true }
);

// Slug auto-generate
productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Rating update method
productSchema.methods.updateRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    const total = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.rating = parseFloat((total / this.reviews.length).toFixed(1));
    this.numReviews = this.reviews.length;
  }
};

module.exports = mongoose.model('Product', productSchema);