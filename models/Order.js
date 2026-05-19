const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        image: String,
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],

    // ✅ Car cleaning — physical shipping নেই, service address আছে
    address: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: String,
      country: { type: String, default: 'Bangladesh' },
    },

    // ✅ Service scheduling — কবে কখন আসবে
    scheduledDate: {
      type: Date,
      required: [true, 'Service date is required'],
    },
    scheduledTime: {
      type: String,
      required: [true, 'Service time is required'],
      enum: ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'],
    },

    paymentMethod: {
      type: String,
      enum: ['cod', 'bkash', 'nagad', 'card', 'bank'],
      required: true,
    },
    paymentResult: {
      id: String,
      status: String,
      transactionId: String,
      paidAt: Date,
    },

    itemsPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 }, // সবসময় 0
    taxPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },

    status: {
      type: String,
      enum: [
        'pending',      // order placed
        'confirmed',    // admin confirmed
        'on-the-way',   // team রওনা দিয়েছে
        'in-progress',  // কাজ চলছে
        'completed',    // কাজ শেষ
        'cancelled',    // বাতিল
      ],
      default: 'pending',
    },

    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isCompleted: { type: Boolean, default: false },  // ✅ isDelivered → isCompleted
    completedAt: Date,

    note: String,
    trackingNumber: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);