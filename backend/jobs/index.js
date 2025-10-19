const cron = require('node-cron');
const logger = require('../utils/logger');
const publishScheduler = require('./publishScheduler.job');
const webhookRetry = require('./webhookRetry.job');

exports.start = () => {
    // Auto-publish scheduled content (runs every 5 minutes)
    cron.schedule('*/5 * * * *', async () => {
        logger.info('Running scheduled content publisher...');
        try {
            await publishScheduler.run();
        } catch (error) {
            logger.error(`Scheduled publisher error: ${error.message}`);
        }
    });

    // Retry failed webhooks (runs every 10 minutes)
    cron.schedule('*/10 * * * *', async () => {
        logger.info('Running webhook retry job...');
        try {
            await webhookRetry.run();
        } catch (error) {
            logger.error(`Webhook retry error: ${error.message}`);
        }
    });

    logger.info('✅ Cron jobs scheduled');
};
