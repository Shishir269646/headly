
const catchAsync = require('../utils/asyncHandler');
const analyticsService = require('../services/analytics.service');
const { successResponse } = require('../utils/responses');

/**
 * Get all analytics data (admin only)
 * GET /api/v1/analytics
 */
exports.getAnalytics = catchAsync(async (req, res) => {
    const analytics = await analyticsService.getAnalytics();
    const userGrowth = await analyticsService.getUserGrowth();
    const contentActivity = await analyticsService.getContentActivity();
    const popularContent = await analyticsService.getPopularContent();

    successResponse(res, { ...analytics, userGrowth, contentActivity, popularContent }, 'Analytics data retrieved successfully');
});
