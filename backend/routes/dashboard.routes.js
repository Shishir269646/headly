const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middlewares/auth.middleware');

/**
 * Get dashboard statistics (authenticated users)
 */
router.get('/stats', authenticate, dashboardController.getDashboardStats);

module.exports = router;

