const Content = require('../models/Content.model');
const webhookService = require('../services/webhook.service');
const logger = require('../utils/logger');

exports.run = async () => {
    try {
        const now = new Date();

        // Find scheduled content that should be published
        const scheduledContents = await Content.find({
            status: 'scheduled',
            publishAt: { $lte: now },
            isDeleted: false
        });

        logger.info(`Found ${scheduledContents.length} content(s) to publish`);

        for (const content of scheduledContents) {
            content.status = 'published';
            await content.save();

            // Trigger webhook
            try {
                await webhookService.triggerRevalidate(content.slug, 'auto-publish');
                logger.info(`Published and revalidated: ${content.title}`);
            } catch (webhookError) {
                logger.error(`Webhook failed for ${content.slug}: ${webhookError.message}`);
            }
        }

        return { published: scheduledContents.length };
    } catch (error) {
        logger.error(`Publish scheduler error: ${error.message}`);
        throw error;
    }
};

