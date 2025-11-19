
const catchAsync = require('../utils/asyncHandler');
const analyticsService = require('../services/analytics.service');
const { successResponse } = require('../utils/responses');

/**
 * Get all analytics data (admin only)
 * GET /api/v1/analytics?period=30
 */
exports.getAnalytics = async (req, res) => {
    const period = req.query.period ? parseInt(req.query.period, 10) : 30;
    const analyticsData = await analyticsService.getAnalytics(period);
    
    successResponse(res, analyticsData, 'Analytics data retrieved successfully');
};
