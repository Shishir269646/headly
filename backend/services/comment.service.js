const Comment = require('../models/Comment.model');
const Content = require('../models/Content.model');
const AuditLog = require('../models/AuditLog.model');
const ApiError = require('../utils/apiError');

/**
 * Get all comments for a content (with nested replies)
 */
exports.getCommentsByContent = async (contentId, options = {}) => {
    const { status = 'approved', includeReplies = true } = options;

    const query = {
        content: contentId,
        isDeleted: false,
        status
    };

    // If including replies, get all comments; otherwise only top-level
    if (!includeReplies) {
        query.parent = null;
    }

    const comments = await Comment.find(query)
        .populate('author', 'name email image')
        .populate({
            path: 'parent',
            select: 'body author guestName',
            populate: {
                path: 'author',
                select: 'name email'
            }
        })
        .sort({ createdAt: 1 }) // Oldest first for nested display
        .lean();

    // Organize comments into nested structure
    if (includeReplies) {
        return organizeNestedComments(comments);
    }

    return comments;
};

/**
 * Organize flat comment list into nested structure
 */
function organizeNestedComments(comments) {
    const commentMap = new Map();
    const rootComments = [];

    // First pass: create map of all comments
    comments.forEach(comment => {
        comment.replies = [];
        commentMap.set(comment._id.toString(), comment);
    });

    // Second pass: organize into tree structure
    comments.forEach(comment => {
        if (comment.parent) {
            const parentId = comment.parent._id ? comment.parent._id.toString() : comment.parent.toString();
            const parent = commentMap.get(parentId);
            if (parent) {
                parent.replies.push(comment);
            } else {
                // Parent not found or deleted, treat as root
                rootComments.push(comment);
            }
        } else {
            rootComments.push(comment);
        }
    });

    return rootComments;
}

/**
 * Get comment by ID
 */
exports.getCommentById = async (commentId) => {
    const comment = await Comment.findOne({ _id: commentId, isDeleted: false })
        .populate('author', 'name email image')
        .populate('content', 'title slug')
        .populate('parent', 'body author guestName');

    if (!comment) {
        throw new ApiError(404, 'Comment not found');
    }

    return comment;
};

/**
 * Create a new comment
 */
exports.createComment = async (commentData, userId = null, ipAddress = null, userAgent = null) => {
    const { contentId, parentId, body, guestName, guestEmail, guestWebsite } = commentData;

    // Verify content exists
    const content = await Content.findById(contentId);
    if (!content) {
        throw new ApiError(404, 'Content not found');
    }

    // If parent comment is provided, verify it exists
    if (parentId) {
        const parentComment = await Comment.findById(parentId);
        if (!parentComment || parentComment.isDeleted) {
            throw new ApiError(404, 'Parent comment not found');
        }
        // Ensure parent comment belongs to same content
        if (parentComment.content.toString() !== contentId) {
            throw new ApiError(400, 'Parent comment must belong to the same content');
        }
    }

    // Determine comment status
    // If user is authenticated, auto-approve; otherwise pending
    let status = 'pending';
    if (userId) {
        // Check if user has previously approved comments (trusted user)
        const previousComments = await Comment.countDocuments({
            author: userId,
            status: 'approved',
            isDeleted: false
        });
        // Auto-approve if user has at least 3 approved comments
        if (previousComments >= 3) {
            status = 'approved';
        }
    }

    const comment = await Comment.create({
        content: contentId,
        author: userId || null,
        guestName: userId ? null : guestName,
        guestEmail: userId ? null : guestEmail,
        guestWebsite: userId ? null : guestWebsite,
        body,
        parent: parentId || null,
        status,
        ipAddress,
        userAgent
    });

    // Create audit log
    if (userId) {
        await AuditLog.create({
            user: userId,
            action: 'COMMENT_CREATE',
            resource: 'comment',
            resourceId: comment._id,
            ipAddress,
            userAgent
        });
    }

    return await Comment.findById(comment._id)
        .populate('author', 'name email image')
        .populate('parent', 'body author guestName');
};

/**
 * Update a comment
 */
exports.updateComment = async (commentId, updateData, userId) => {
    const comment = await Comment.findById(commentId);

    if (!comment || comment.isDeleted) {
        throw new ApiError(404, 'Comment not found');
    }

    // Check permissions: user can only edit their own comments
    const isOwner = comment.author && comment.author.toString() === userId;
    if (!isOwner) {
        throw new ApiError(403, 'You can only edit your own comments');
    }

    // Update comment
    comment.body = updateData.body || comment.body;
    comment.isEdited = true;
    comment.editedAt = new Date();
    await comment.save();

    // Create audit log
    await AuditLog.create({
        user: userId,
        action: 'COMMENT_UPDATE',
        resource: 'comment',
        resourceId: comment._id
    });

    return await Comment.findById(comment._id)
        .populate('author', 'name email image')
        .populate('parent', 'body author guestName');
};

/**
 * Delete a comment (soft delete)
 */
exports.deleteComment = async (commentId, userId, isAdmin = false) => {
    const comment = await Comment.findById(commentId);

    if (!comment || comment.isDeleted) {
        throw new ApiError(404, 'Comment not found');
    }

    // Check permissions: user can delete their own comments, admin can delete any
    const isOwner = comment.author && comment.author.toString() === userId;
    if (!isOwner && !isAdmin) {
        throw new ApiError(403, 'You do not have permission to delete this comment');
    }

    // Soft delete
    comment.isDeleted = true;
    await comment.save();

    // Create audit log
    await AuditLog.create({
        user: userId,
        action: 'COMMENT_DELETE',
        resource: 'comment',
        resourceId: comment._id
    });

    return { message: 'Comment deleted successfully' };
};

/**
 * Moderate comment (approve, spam, trash)
 */
exports.moderateComment = async (commentId, status, userId) => {
    const validStatuses = ['approved', 'spam', 'trash', 'pending'];
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, 'Invalid status');
    }

    const comment = await Comment.findById(commentId);
    if (!comment || comment.isDeleted) {
        throw new ApiError(404, 'Comment not found');
    }

    comment.status = status;
    await comment.save();

    // Map status to audit log action
    const actionMap = {
        'approved': 'COMMENT_APPROVED',
        'pending': 'COMMENT_PENDING',
        'spam': 'COMMENT_SPAM',
        'trash': 'COMMENT_TRASH'
    };

    // Create audit log
    await AuditLog.create({
        user: userId,
        action: actionMap[status],
        resource: 'comment',
        resourceId: comment._id
    });

    return await Comment.findById(comment._id)
        .populate('author', 'name email image')
        .populate('parent', 'body author guestName');
};

/**
 * Bulk moderate comments
 */
exports.bulkModerateComments = async (commentIds, status, userId) => {
    const validStatuses = ['approved', 'spam', 'trash', 'pending'];
    if (!validStatuses.includes(status)) {
        throw new ApiError(400, 'Invalid status');
    }

    const result = await Comment.updateMany(
        { _id: { $in: commentIds }, isDeleted: false },
        { $set: { status } }
    );

    // Map status to audit log action
    const actionMap = {
        'approved': 'COMMENT_BULK_APPROVED',
        'pending': 'COMMENT_BULK_PENDING',
        'spam': 'COMMENT_BULK_SPAM',
        'trash': 'COMMENT_BULK_TRASH'
    };

    // Create audit log
    await AuditLog.create({
        user: userId,
        action: actionMap[status],
        resource: 'comment',
        details: { count: result.modifiedCount }
    });

    return { message: `${result.modifiedCount} comments updated`, count: result.modifiedCount };
};

/**
 * Like/Unlike a comment
 */
exports.toggleLike = async (commentId, userId) => {
    const comment = await Comment.findById(commentId);

    if (!comment || comment.isDeleted) {
        throw new ApiError(404, 'Comment not found');
    }

    const likedIndex = comment.likedBy.findIndex(
        id => id.toString() === userId
    );

    if (likedIndex > -1) {
        // Unlike
        comment.likedBy.splice(likedIndex, 1);
        comment.likes = Math.max(0, comment.likes - 1);
    } else {
        // Like
        comment.likedBy.push(userId);
        comment.likes += 1;
    }

    await comment.save();

    return {
        likes: comment.likes,
        isLiked: likedIndex === -1
    };
};

/**
 * Get all comments (for admin dashboard)
 */
exports.getAllComments = async (filters) => {
    const {
        status,
        contentId,
        authorId,
        page = 1,
        limit = 20,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = filters;

    const query = { isDeleted: false };

    if (status) query.status = status;
    if (contentId) query.content = contentId;
    if (authorId) query.author = authorId;
    if (search) {
        query.$or = [
            { body: { $regex: search, $options: 'i' } },
            { guestName: { $regex: search, $options: 'i' } },
            { guestEmail: { $regex: search, $options: 'i' } }
        ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const comments = await Comment.find(query)
        .populate('author', 'name email image')
        .populate('content', 'title slug')
        .populate('parent', 'body')
        .sort(sort)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

    const total = await Comment.countDocuments(query);

    return {
        comments,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            limit: parseInt(limit)
        }
    };
};

/**
 * Get comment statistics
 */
exports.getCommentStats = async () => {
    const stats = await Comment.aggregate([
        {
            $match: { isDeleted: false }
        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    const result = {
        total: 0,
        approved: 0,
        pending: 0,
        spam: 0,
        trash: 0
    };

    stats.forEach(stat => {
        result.total += stat.count;
        result[stat._id] = stat.count;
    });

    return result;
};

/**
 * Get comment count for content
 */
exports.getCommentCount = async (contentId, status = 'approved') => {
    return await Comment.countDocuments({
        content: contentId,
        status,
        isDeleted: false
    });
};

