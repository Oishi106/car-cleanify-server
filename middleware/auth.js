const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// ── JWT Token generate ────────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// ── Protect Route (JWT verify) ────────────────────────────
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    // আমাদের নিজের JWT হলে
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user || !req.user.isActive) {
      res.status(401);
      throw new Error('User not found or deactivated');
    }

    next();
  } catch (err) {
    // NextAuth JWT হলে (NEXTAUTH_SECRET দিয়ে verify)
    try {
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET);
      // NextAuth token এ sub = user id অথবা email থাকে
      req.user = await User.findOne({
        $or: [{ _id: decoded.sub }, { email: decoded.email }],
      }).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('User not found');
      }
      next();
    } catch (nextAuthErr) {
      res.status(401);
      throw new Error('Not authorized, token invalid');
    }
  }
});

// ── Admin only ────────────────────────────────────────────
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403);
  throw new Error('Access denied: Admin only');
};

module.exports = { protect, adminOnly, generateToken };
