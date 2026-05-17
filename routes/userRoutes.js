const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/users - Admin: all users
router.get('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search } = req.query;
  const query = search ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] } : {};
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(query).select('-password').sort('-createdAt').skip(skip).limit(Number(limit)),
    User.countDocuments(query),
  ]);
  res.json({ success: true, total, users });
}));

// PUT /api/users/:id/role - Admin: change role
router.put('/:id/role', protect, adminOnly, asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.json({ success: true, user });
}));

// PUT /api/users/:id/status - Admin: activate/deactivate
router.put('/:id/status', protect, adminOnly, asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive }, { new: true }).select('-password');
  res.json({ success: true, user });
}));

module.exports = router;
