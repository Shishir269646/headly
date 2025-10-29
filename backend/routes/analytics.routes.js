
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { authenticate: protect } = require('../middlewares/auth.middleware');
const { authorize: restrictTo } = require('../middlewares/rbac.middleware');
const catchAsync = require('../utils/asyncHandler');

/**
 * Admin Routes (Protected)
 */
// Get all analytics data
router.get(
    '/',
    protect,
    restrictTo('admin'),
    catchAsync(analyticsController.getAnalytics)
);

module.exports = router;
