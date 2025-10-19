
const express = require('express');
const router = express.Router();
const webhookController = require('../../controllers/webhook.controller');
const { authenticate } = require('../../middlewares/auth.middleware');
const { authorize } = require('../../middlewares/rbac.middleware');

// Webhook endpoint (uses secret header for auth)
router.post('/revalidate', webhookController.triggerRevalidate);

// Webhook logs (admin only)
router.get('/logs', authenticate, authorize('admin'), webhookController.getWebhookLogs);
router.post('/logs/:id/retry', authenticate, authorize('admin'), webhookController.retryFailedWebhook);

module.exports = router;