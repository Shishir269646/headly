const WebhookLog = require('../models/WebhookLog.model');
const webhookService = require('../services/webhook.service');
const logger = require('../utils/logger');

exports.run = async () => {
    try {
        const now = new Date();

        // Find failed webhooks that are ready for retry
        const failedWebhooks = await WebhookLog.find({
            status: 'failed',
            retryCount: { $lt: 3 },
            nextRetryAt: { $lte: now }
        }).limit(10);

        logger.info(`Found ${failedWebhooks.length} webhook(s) to retry`);

        for (const webhook of failedWebhooks) {
            try {
                await webhookService.retryWebhook(webhook._id);
                logger.info(`Retried webhook for: ${webhook.slug}`);
            } catch (error) {
                logger.error(`Webhook retry failed for ${webhook.slug}: ${error.message}`);
            }
        }

        return { retried: failedWebhooks.length };
    } catch (error) {
        logger.error(`Webhook retry job error: ${error.message}`);
        throw error;
    }
};
