
const User = require('../models/User.model');

const Content = require('../models/Content.model');

const Contact = require('../models/Contact.model');

const Newsletter = require('../models/Newsletter.model');

const Comment = require('../models/Comment.model');

const logger = require('../utils/logger');



/**

 * Generates a date query object for aggregations based on a specified period.

 * @param {number} period - The number of days for the range. 0 or invalid numbers mean "all time".

 * @returns {object} A Mongoose query object for the 'createdAt' field.

 */

const getDateQuery = (period) => {

    const days = parseInt(period, 10);

    if (!days || days <= 0) {

        return {}; // Return an empty object for "all time"

    }

    const startDate = new Date();

    startDate.setDate(startDate.getDate() - days);

    return { createdAt: { $gte: startDate } };

};



/**

 * Merges multiple time-series data arrays (e.g., views, comments, likes) by date.

 * @param {Array<Array<Object>>} trendArrays - An array of trend data arrays to merge.

 * @returns {Array<Object>} A single, merged and sorted time-series array.

 */

const mergeTrends = (...trendArrays) => {

    const merged = {};

    trendArrays.forEach(arr => {

        arr.forEach(item => {

            const { date, ...metrics } = item;

            if (!merged[date]) {

                merged[date] = { date, views: 0, comments: 0, likes: 0 };

            }

            Object.assign(merged[date], metrics);

        });

    });



    return Object.values(merged).sort((a, b) => new Date(a.date) - new Date(b.date));

};





/**

 * Get comprehensive analytics data for a given period.

 * @param {number} period - The number of days (e.g., 7, 30, 90). Defaults to 30.

 * @returns {Promise<Object>} Comprehensive analytics data.

 */

const getAnalytics = async (period = 30) => {

    try {

        const dateQuery = getDateQuery(period);

        const allTimeQuery = {}; // For stats that are always all-time



        // 1. Overview Stats

        const [

            totalUsers,

            totalPosts,

            totalContacts,

            totalNewsletterSubscribers,

            contentViewStats,

            commentAndLikeStats,

        ] = await Promise.all([

            User.countDocuments(allTimeQuery),

            Content.countDocuments(allTimeQuery),

            Contact.countDocuments(allTimeQuery),

            Newsletter.countDocuments(allTimeQuery),

            Content.aggregate([

                { $match: dateQuery },

                { $group: { _id: null, totalViews: { $sum: '$views' } } },

            ]),

            Comment.aggregate([

                { $match: dateQuery },

                { $group: { _id: null, totalComments: { $sum: 1 }, totalLikes: { $sum: '$likes' } } },

            ]),

        ]);



        const overview = {

            totalUsers,

            totalPosts,

            totalContacts,

            totalNewsletterSubscribers,

            totalViews: contentViewStats[0]?.totalViews || 0,

            totalComments: commentAndLikeStats[0]?.totalComments || 0,

            totalLikes: commentAndLikeStats[0]?.totalLikes || 0,

        };



        // 2. Engagement Trends (Views, Comments, Likes over time)

        const [viewTrends, commentTrends] = await Promise.all([

            Content.aggregate([

                { $match: dateQuery },

                { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, views: { $sum: '$views' } } },

                { $project: { date: '$_id', views: 1, _id: 0 } },

            ]),

            Comment.aggregate([

                { $match: dateQuery },

                { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, comments: { $sum: 1 }, likes: { $sum: '$likes' } } },

                { $project: { date: '$_id', comments: 1, likes: 1, _id: 0 } },

            ]),

        ]);

        

        const engagementTrends = mergeTrends(viewTrends, commentTrends);



        // 3. Category Distribution

        const categoryDistribution = await Content.aggregate([

            { $match: dateQuery },

            { $lookup: { from: 'categories', localField: 'category', foreignField: '_id', as: 'categoryDetails' } },

            { $unwind: '$categoryDetails' },

            { $group: { _id: '$categoryDetails.name', count: { $sum: 1 } } },

            { $project: { name: '$_id', count: 1, _id: 0 } },

            { $sort: { count: -1 } },

        ]);



        // 4. Top Performing Content (by views)

        const topContent = await Content.find(dateQuery)

            .populate('author', 'name')

            .sort({ views: -1 })

            .limit(10)

            .select('title views author slug');



        // 5. Top Authors (by post count and views)

        const topAuthors = await Content.aggregate([

            { $match: dateQuery },

            { $group: { _id: '$author', postCount: { $sum: 1 }, totalViews: { $sum: '$views' } } },

            { $sort: { postCount: -1, totalViews: -1 } },

            { $limit: 5 },

            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'authorDetails' } },

            { $unwind: '$authorDetails' },

            {

                $project: {

                    _id: '$authorDetails._id',

                    name: '$authorDetails.name',

                    postCount: 1,

                    totalViews: 1,

                },

            },

        ]);



        return {

            overview,

            engagementTrends,

            categoryDistribution,

            topContent,

            topAuthors,

        };

    } catch (error) {

        logger.error('Error getting comprehensive analytics:', error.stack);

        throw new Error('Failed to retrieve analytics data.');

    }

};



module.exports = { getAnalytics };




