
const WebhookLog = require('../models/WebhookLog.model');
const Content = require('../models/Content.model');
const ApiError = require('../utils/apiError');
const fetch = require('node-fetch');

exports.triggerRevalidate = async (slug, action = 'publish') => {
    const content = await Content.findOne({ slug });

    if (!content) {
        throw new ApiError(404, 'Content not found');
    }

    const revalidateUrl = `${process.env.FRONTEND_URL}/api/revalidate`;

    const webhookLog = await WebhookLog.create({
        contentId: content._id,
        slug,
        url: revalidateUrl,
        status: 'pending'
    });

    try {
        const response = await fetch(revalidateUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-revalidate-secret': process.env.REVALIDATE_SECRET
            },
            body: JSON.stringify({
                slug,
                action,
                timestamp: new Date().toISOString()
            }),
            timeout: 10000
        });

        const responseData = await response.json();

        webhookLog.status = response.ok ? 'success' : 'failed';
        webhookLog.statusCode = response.status;
        webhookLog.responseBody = responseData;
        webhookLog.completedAt = new Date();

        if (!response.ok) {
            webhookLog.error = responseData.error || 'Revalidation failed';
        }

        await webhookLog.save();

        return {
            success: response.ok,
            log: webhookLog
        };
    } catch (error) {
        webhookLog.status = 'failed';
        webhookLog.error = error.message;
        webhookLog.nextRetryAt = new Date(Date.now() + 5 * 60 * 1000); // Retry in 5 minutes
        await webhookLog.save();

        throw new ApiError(500, `Webhook failed: ${error.message}`);
    }
};

exports.getWebhookLogs = async (filters) => {
    const { status, contentId, page = 1, limit = 50 } = filters;

    const query = {};
    if (status) query.status = status;
    if (contentId) query.contentId = contentId;

    const logs = await WebhookLog.find(query)
        .populate('contentId', 'title slug')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const total = await WebhookLog.countDocuments(query);

    return {
        logs,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        }
    };
};

exports.retryWebhook = async (logId) => {
    const log = await WebhookLog.findById(logId);

    if (!log) {
        throw new ApiError(404, 'Webhook log not found');
    }

    if (log.status === 'success') {
        throw new ApiError(400, 'This webhook has already succeeded');
    }

    if (log.retryCount >= log.maxRetries) {
        throw new ApiError(400, 'Maximum retry attempts reached');
    }

    log.retryCount += 1;
    log.status = 'pending';
    await log.save();

    return this.triggerRevalidate(log.slug);
};

