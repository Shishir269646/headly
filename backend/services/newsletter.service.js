
const crypto = require('crypto');
const Newsletter = require('../models/Newsletter.model');
const logger = require('../utils/logger');
const { AppError } = require('../utils/apiError');

/**
 * Generate confirmation token
 */
const generateConfirmationToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

/**
 * Subscribe to newsletter
 */
const subscribe = async (subscriberData) => {
    try {
        // Check if already subscribed
        const existing = await Newsletter.findOne({ email: subscriberData.email });

        if (existing) {
            // If unsubscribed, resubscribe
            if (existing.status === 'unsubscribed') {
                existing.status = 'subscribed';
                existing.subscribedAt = Date.now();
                existing.unsubscribedAt = null;
                existing.confirmationToken = generateConfirmationToken();
                existing.confirmationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
                existing.confirmed = false;
                await existing.save();
                logger.info(`Newsletter resubscribed: ${subscriberData.email}`);
                return existing;
            }

            // If already subscribed
            throw new AppError('Email already subscribed to newsletter', 400);
        }

        // Create new subscription
        const confirmationToken = generateConfirmationToken();
        const subscription = await Newsletter.create({
            ...subscriberData,
            confirmationToken,
            confirmationExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        });

        logger.info(`New newsletter subscription: ${subscriberData.email}`);
        return subscription;
    } catch (error) {
        logger.error('Error subscribing to newsletter:', error);
        throw error;
    }
};

/**
 * Confirm newsletter subscription
 */
const confirmSubscription = async (token) => {
    const subscription = await Newsletter.findOne({
        confirmationToken: token,
        confirmationExpires: { $gt: Date.now() }
    });

    if (!subscription) {
        throw new AppError('Invalid or expired confirmation token', 400);
    }

    subscription.confirmed = true;
    subscription.confirmationToken = undefined;
    subscription.confirmationExpires = undefined;
    await subscription.save();

    logger.info(`Newsletter confirmed: ${subscription.email}`);
    return subscription;
};

/**
 * Unsubscribe from newsletter
 */
const unsubscribe = async (email) => {
    const subscription = await Newsletter.findOne({ email: email.toLowerCase() });

    if (!subscription) {
        throw new AppError('Email not found in our newsletter list', 404);
    }

    subscription.status = 'unsubscribed';
    subscription.unsubscribedAt = Date.now();
    await subscription.save();

    logger.info(`Newsletter unsubscribed: ${email}`);
    return subscription;
};

/**
 * Get all newsletter subscribers (admin only)
 */
const getSubscribers = async (filter = {}, options = {}) => {
    try {
        const page = parseInt(options.page) || 1;
        const limit = parseInt(options.limit) || 10;
        const skip = (page - 1) * limit;
        const sortBy = options.sortBy || '-createdAt';

        const subscribers = await Newsletter.find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit);

        const total = await Newsletter.countDocuments(filter);

        return {
            subscribers,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        };
    } catch (error) {
        logger.error('Error getting subscribers:', error);
        throw error;
    }
};

/**
 * Get a single subscriber by ID (admin only)
 */
const getSubscriberById = async (subscriberId) => {
    const subscriber = await Newsletter.findById(subscriberId);
    
    if (!subscriber) {
        throw new AppError('Subscriber not found', 404);
    }

    return subscriber;
};

/**
 * Delete a subscriber (admin only)
 */
const deleteSubscriber = async (subscriberId) => {
    const subscriber = await Newsletter.findByIdAndDelete(subscriberId);

    if (!subscriber) {
        throw new AppError('Subscriber not found', 404);
    }

    logger.info(`Subscriber deleted: ${subscriberId}`);
    return subscriber;
};

/**
 * Update subscriber preferences
 */
const updatePreferences = async (email, preferences) => {
    const subscription = await Newsletter.findOneAndUpdate(
        { email: email.toLowerCase() },
        { preferences },
        { new: true, runValidators: true }
    );

    if (!subscription) {
        throw new AppError('Subscriber not found', 404);
    }

    return subscription;
};

module.exports = {
    subscribe,
    confirmSubscription,
    unsubscribe,
    getSubscribers,
    getSubscriberById,
    deleteSubscriber,
    updatePreferences
};


