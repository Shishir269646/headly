const commentService = require('../services/comment.service');
const { successResponse } = require('../utils/responses');
const ApiError = require('../utils/apiError');

/**
 * Get all comments for a content
 */
exports.getCommentsByContent = async (req, res, next) => {
    try {
        const { contentId } = req.params;
        const { status = 'approved', includeReplies = 'true' } = req.query;

        const comments = await commentService.getCommentsByContent(contentId, {
            status,
            includeReplies: includeReplies === 'true'
        });

        successResponse(res, comments, 'Comments retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Get comment by ID
 */
exports.getCommentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const comment = await commentService.getCommentById(id);
        successResponse(res, comment, 'Comment retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Create a new comment
 */
exports.createComment = async (req, res, next) => {
    try {
        const userId = req.user?.id || null;
        const ipAddress = req.ip;
        const userAgent = req.headers['user-agent'];

        const comment = await commentService.createComment(
            {
                ...req.body,
                contentId: req.body.contentId || req.params.contentId
            },
            userId,
            ipAddress,
            userAgent
        );

        successResponse(res, comment, 'Comment created successfully. It will be visible after approval.', 201);
    } catch (error) {
        next(error);
    }
};

/**
 * Update a comment
 */
exports.updateComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const comment = await commentService.updateComment(id, req.body, userId);
        successResponse(res, comment, 'Comment updated successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Delete a comment
 */
exports.deleteComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const isAdmin = req.user.role === 'admin';

        const result = await commentService.deleteComment(id, userId, isAdmin);
        successResponse(res, result, 'Comment deleted successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Moderate a comment (approve, spam, trash)
 */
exports.moderateComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user.id;

        const comment = await commentService.moderateComment(id, status, userId);
        successResponse(res, comment, `Comment ${status} successfully`);
    } catch (error) {
        next(error);
    }
};

/**
 * Bulk moderate comments
 */
exports.bulkModerateComments = async (req, res, next) => {
    try {
        const { commentIds, status } = req.body;
        const userId = req.user.id;

        if (!Array.isArray(commentIds) || commentIds.length === 0) {
            throw new ApiError(400, 'commentIds must be a non-empty array');
        }

        const result = await commentService.bulkModerateComments(commentIds, status, userId);
        successResponse(res, result, `Comments ${status} successfully`);
    } catch (error) {
        next(error);
    }
};

/**
 * Like/Unlike a comment
 */
exports.toggleLike = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const result = await commentService.toggleLike(id, userId);
        successResponse(res, result, 'Like toggled successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Get all comments (for admin dashboard)
 */
exports.getAllComments = async (req, res, next) => {
    try {
        const filters = {
            status: req.query.status,
            contentId: req.query.contentId,
            authorId: req.query.authorId,
            page: req.query.page,
            limit: req.query.limit,
            search: req.query.search,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder
        };

        const result = await commentService.getAllComments(filters);
        successResponse(res, result.comments, 'Comments retrieved successfully', 200, result.pagination);
    } catch (error) {
        next(error);
    }
};

/**
 * Get comment statistics
 */
exports.getCommentStats = async (req, res, next) => {
    try {
        const stats = await commentService.getCommentStats();
        successResponse(res, stats, 'Comment statistics retrieved successfully');
    } catch (error) {
        next(error);
    }
};

/**
 * Get comment count for content
 */
exports.getCommentCount = async (req, res, next) => {
    try {
        const { contentId } = req.params;
        const { status = 'approved' } = req.query;

        const count = await commentService.getCommentCount(contentId, status);
        successResponse(res, { count }, 'Comment count retrieved successfully');
    } catch (error) {
        next(error);
    }
};

