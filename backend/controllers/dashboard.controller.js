const dashboardService = require('../services/dashboard.service');
const { successResponse } = require('../utils/responses');

/**
 * Get dashboard statistics
 */
exports.getDashboardStats = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        const data = await dashboardService.getDashboardStats(userId, userRole);
        successResponse(res, data, 'Dashboard statistics retrieved successfully');
    } catch (error) {
        next(error);
    }
};

