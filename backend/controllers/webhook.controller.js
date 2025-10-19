
const webhookService = require('../services/webhook.service');
const { successResponse } = require('../utils/responses');
const ApiError = require('../utils/apiError');

exports.triggerRevalidate = async (req, res, next) => {
    try {
        // Verify webhook secret
        const webhookSecret = req.headers['x-webhook-secret'];
        if (webhookSecret !== process.env.WEBHOOK_SECRET) {
            throw new ApiError(401, 'Invalid webhook secret');
        }

        const { slug, action } = req.body;
        const result = await webhookService.triggerRevalidate(slug, action);
        successResponse(res, result, 'Revalidation triggered successfully');
    } catch (error) {
        next(error);
    }
};

exports.getWebhookLogs = async (req, res, next) => {
    try {
        const logs = await webhookService.getWebhookLogs(req.query);
        successResponse(res, logs, 'Webhook logs retrieved successfully');
    } catch (error) {
        next(error);
    }
};

exports.retryFailedWebhook = async (req, res, next) => {
    try {
        const result = await webhookService.retryWebhook(req.params.id);
        successResponse(res, result, 'Webhook retry initiated');
    } catch (error) {
        next(error);
    }
};

