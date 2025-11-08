const Content = require('../models/Content.model');
const Media = require('../models/Media.model');
const Comment = require('../models/Comment.model');
const User = require('../models/User.model');

/**
 * Get dashboard statistics
 * @param {string} userId - Current user ID
 * @param {string} userRole - Current user role
 */
exports.getDashboardStats = async (userId, userRole) => {
    try {
        // Base query - filter by user if not admin/editor
        const contentQuery = userRole === 'admin' || userRole === 'editor' 
            ? { isDeleted: false }
            : { author: userId, isDeleted: false };

        // Get content counts
        const [
            totalContents,
            publishedContents,
            draftContents,
            scheduledContents,
            totalMedia,
            totalComments,
            pendingComments
        ] = await Promise.all([
            Content.countDocuments(contentQuery),
            Content.countDocuments({ ...contentQuery, status: 'published' }),
            Content.countDocuments({ ...contentQuery, status: 'draft' }),
            Content.countDocuments({ ...contentQuery, status: 'scheduled' }),
            // Media count - all users can see all media (or filter by uploadedBy if needed)
            Media.countDocuments({ isDeleted: false }),
            // Comment counts
            Comment.countDocuments({ isDeleted: false, status: 'approved' }),
            Comment.countDocuments({ isDeleted: false, status: 'pending' })
        ]);

        // Get recent contents
        const recentContents = await Content.find(contentQuery)
            .populate('author', 'name email')
            .populate('featuredImage')
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title status createdAt author featuredImage');

        return {
            stats: {
                totalContents,
                publishedContents,
                draftContents,
                scheduledContents,
                totalMedia,
                totalComments,
                pendingComments
            },
            recentContents
        };
    } catch (error) {
        throw error;
    }
};

