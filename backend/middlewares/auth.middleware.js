
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const ApiError = require('../utils/apiError');

exports.authenticate = async (req, res, next) => {
  try {
    let token;

    // 1) Try cookie first (httpOnly cookie)
    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    // 2) Fallback: Authorization header "Bearer <token>"
    if (!token && req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
        token = parts[1];
      }
    }

    if (!token) {
      throw new ApiError(401, 'Authentication required. Please login.');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      throw new ApiError(401, 'Invalid token');
    }

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, 'User not found. Token is invalid.');
    }

    if (!user.isActive) {
      throw new ApiError(403, 'Your account has been deactivated.');
    }

    // Attach minimal user info
    req.user = { id: user._id, email: user.email, role: user.role };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new ApiError(401, 'Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(new ApiError(401, 'Token has expired'));
    } else {
      next(error);
    }
  }
};

exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.cookies && req.cookies.accessToken) token = req.cookies.accessToken;

    if (!token && req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && /^Bearer$/i.test(parts[0])) token = parts[1];
    }

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded && decoded.id) {
        const user = await User.findById(decoded.id);
        if (user && user.isActive) {
          req.user = { id: user._id, email: user.email, role: user.role };
        }
      }
    }

    next();
  } catch (err) {
    // ignore errors here and continue without user (optional auth)
    next();
  }
};
