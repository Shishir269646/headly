const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');

/**
 * Get dashboard statistics (authenticated users)
 */
router.get('/stats', authenticate, authorize('admin', 'editor', 'author', 'viewer'), dashboardController.getDashboardStats);

module.exports = router;

