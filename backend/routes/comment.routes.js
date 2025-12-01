const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const { authenticate, optionalAuth } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');
const { validate } = require('../middlewares/validate.middleware');
const {
    createCommentSchema,
    updateCommentSchema,
    moderateCommentSchema,
    bulkModerateCommentSchema,
    toggleLikeSchema
} = require('../validators/comment.validator');


// Get comments for a content (public, but can filter by status)
router.get('/content/:contentId', optionalAuth, commentController.getCommentsByContent);

// Get comment count for content
router.get('/content/:contentId/count', optionalAuth, commentController.getCommentCount);

// Get comment by ID
router.get('/:id', optionalAuth, commentController.getCommentById);


// Create a comment (authenticated or guest)
router.post(
    '/',
    optionalAuth, // Allow guest comments
    validate(createCommentSchema),
    commentController.createComment
);

// Create a comment for specific content
router.post(
    '/content/:contentId',
    optionalAuth,
    validate(createCommentSchema),
    commentController.createComment
);

// Update own comment
router.put(
    '/:id',
    authenticate,
    validate(updateCommentSchema),
    commentController.updateComment
);

// Delete own comment
router.delete(
    '/:id',
    authenticate,
    commentController.deleteComment
);

// Like/Unlike a comment
router.post(
    '/:id/like',
    authenticate,
    validate(toggleLikeSchema),
    commentController.toggleLike
);


// Get all comments (for dashboard)
router.get(
    '/',
    authenticate,
    authorize('admin', 'editor'),
    commentController.getAllComments
);

// Moderate a comment
router.put(
    '/:id/moderate',
    authenticate,
    authorize('admin', 'editor'),
    validate(moderateCommentSchema),
    commentController.moderateComment
);

// Bulk moderate comments
router.put(
    '/bulk/moderate',
    authenticate,
    authorize('admin', 'editor'),
    validate(bulkModerateCommentSchema),
    commentController.bulkModerateComments
);

// Get comment statistics
router.get(
    '/stats/overview',
    authenticate,
    authorize('admin', 'editor'),
    commentController.getCommentStats
);

module.exports = router;

