
const User = require('../models/User.model');
const Content = require('../models/Content.model');
const Contact = require('../models/Contact.model');
const Newsletter = require('../models/Newsletter.model');
const logger = require('../utils/logger');

/**
 * Get general analytics data
 * @returns {Promise<Object>} Analytics data
 */
const getAnalytics = async () => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPosts = await Content.countDocuments();
        const totalContacts = await Contact.countDocuments();
        const totalNewsletterSubscribers = await Newsletter.countDocuments();

        // More detailed analytics
        const userGrowth = await getUserGrowth();
        const contentActivity = await getContentActivity();
        const popularContent = await getPopularContent();

        return {
            totalUsers,
            totalPosts,
            totalContacts,
            totalNewsletterSubscribers,
            userGrowth,
            contentActivity,
            popularContent,
        };
    } catch (error) {
        logger.error('Error getting analytics:', error);
        throw error;
    }
};

/**
 * Get user growth data for the last 7 days
 * @returns {Promise<Object>} User growth data
 */
const getUserGrowth = async () => {
    try {
        const userGrowth = await User.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000),
                    },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        return userGrowth;
    } catch (error) {
        logger.error('Error getting user growth:', error);
        throw error;
    }
};

/**
 * Get content activity data
 * @returns {Promise<Object>} Content activity data
 */
const getContentActivity = async () => {
    try {
        const contentActivity = await Content.aggregate([
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: '$views' },
                    totalLikes: { $sum: '$likes' },
                    totalComments: { $sum: { $size: { $ifNull: ['$comments', []] } } },
                },
            },
        ]);
        return contentActivity[0] || { totalViews: 0, totalLikes: 0, totalComments: 0 };
    } catch (error) {
        logger.error('Error getting content activity:', error);
        throw error;
    }
};

/**
 * Get popular content (top 5 most viewed)
 * @returns {Promise<Array>} Popular content
 */
const getPopularContent = async () => {
    try {
        const popularContent = await Content.find()
            .sort({ views: -1 })
            .limit(5)
            .select('title views likes');
        return popularContent;
    } catch (error) {
        logger.error('Error getting popular content:', error);
        throw error;
    }
};


module.exports = {
    getAnalytics,
    getUserGrowth,
    getContentActivity,
    getPopularContent,
};
