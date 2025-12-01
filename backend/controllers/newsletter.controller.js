
const catchAsync = require('../utils/asyncHandler');
const newsletterService = require('../services/newsletter.service');
const { successResponse } = require('../utils/responses');
const logger = require('../utils/logger');

/**
 * Subscribe to newsletter
 */
exports.subscribe = catchAsync(async (req, res) => {
    // Add metadata if available
    const subscriberData = {
        ...req.body,
        metadata: {
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get('user-agent'),
            source: req.body.source || 'website'
        }
    };

    const subscription = await newsletterService.subscribe(subscriberData);
    
    logger.info(`Newsletter subscription: ${subscription.email}`);
    
    successResponse(res, {
        email: subscription.email,
        subscribedAt: subscription.subscribedAt,
        confirmationRequired: !subscription.confirmed
    }, 'Successfully subscribed to our newsletter! Please check your email to confirm.', 201);
});

/**
 * Confirm newsletter subscription
 */
exports.confirmSubscription = catchAsync(async (req, res) => {
    const subscription = await newsletterService.confirmSubscription(req.params.token);
    
    logger.info(`Newsletter confirmed: ${subscription.email}`);
    
    successResponse(res, {
        email: subscription.email,
        confirmed: subscription.confirmed
    }, 'Your subscription has been confirmed successfully!');
});

/**
 * Unsubscribe from newsletter
 */
exports.unsubscribe = catchAsync(async (req, res) => {
    const subscription = await newsletterService.unsubscribe(req.body.email);
    
    logger.info(`Newsletter unsubscribed: ${subscription.email}`);
    
    successResponse(res, {
        email: subscription.email,
        unsubscribedAt: subscription.unsubscribedAt
    }, 'You have been unsubscribed from our newsletter');
});

/**
 * Get all newsletter subscribers (admin only)
 */
exports.getSubscribers = catchAsync(async (req, res) => {
    const { status, confirmed, page, limit, sortBy } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (confirmed !== undefined) filter.confirmed = confirmed === 'true';
    
    const options = { page, limit, sortBy };
    
    const result = await newsletterService.getSubscribers(filter, options);
    
    successResponse(res, result, 'Subscribers retrieved successfully');
});

/**
 * Get a single subscriber by ID (admin only)
 */
exports.getSubscriberById = catchAsync(async (req, res) => {
    const subscriber = await newsletterService.getSubscriberById(req.params.id);
    
    successResponse(res, subscriber, 'Subscriber retrieved successfully');
});

/**
 * Delete a subscriber (admin only)
 */
exports.deleteSubscriber = catchAsync(async (req, res) => {
    await newsletterService.deleteSubscriber(req.params.id);
    
    successResponse(res, null, 'Subscriber deleted successfully');
});

/**
 * Update subscriber preferences
 */
exports.updatePreferences = catchAsync(async (req, res) => {
    const subscription = await newsletterService.updatePreferences(
        req.params.email,
        req.body
    );
    
    successResponse(res, subscription, 'Preferences updated successfully');
});


