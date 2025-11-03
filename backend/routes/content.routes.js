// ============================================
// 📄 src/routes/v1/content.routes.js
// ✅ CORRECTED & IMPROVED VERSION
// ============================================

const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const { authenticate, optionalAuth } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');
const { validate } = require('../middlewares/validate.middleware');
const upload = require('../middlewares/upload.middleware');
const {
    createContentSchema,
    updateContentSchema,
    scheduleContentSchema,
    updateContentFlagsSchema
} = require('../validators/content.validator');

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

// Homepage sections - These should be FIRST to avoid conflicts with /:id
router.get('/latest', contentController.getLatestContents);
router.get('/trending', contentController.getTrendingContents);
router.get('/popular', contentController.getPopularContents);
router.get('/featured', contentController.getFeaturedContents);

// Public content routes (with optional auth for analytics)
router.get('/', optionalAuth, contentController.getAllContents);
router.get('/slug/:slug', optionalAuth, contentController.getContentBySlug);

// ⚠️ IMPORTANT: This should be LAST among GET routes
// Because it can match any string including 'latest', 'trending', etc.
router.get('/:id', optionalAuth, contentController.getContentById);

// ============================================
// PROTECTED ROUTES (Authentication required)
// ============================================

// Create content - Authors and above can create
router.post(
    '/',
    authenticate,
    authorize('admin', 'editor', 'author'),
    upload.single('featuredImage'), // Add this line for image upload
    validate(createContentSchema),
    contentController.createContent
);

// Update content - Authors can edit their own, Editors can edit all
router.put(
    '/:id',
    authenticate,
    authorize('admin', 'editor', 'author'),
    upload.single('featuredImage'), // Add this line for image upload
    validate(updateContentSchema),
    contentController.updateContent
);

// Delete content - Authors can delete their own, Editors can delete all
router.delete(
    '/:id',
    authenticate,
    authorize('admin', 'editor', 'author'),
    contentController.deleteContent
);

// ============================================
// PUBLISHING ROUTES (Editors and above)
// ============================================

// Publish content immediately
router.post(
    '/:id/publish',
    authenticate,
    authorize('admin', 'editor'),
    contentController.publishContent
);

// Schedule content for future publishing
router.post(
    '/:id/schedule',
    authenticate,
    authorize('admin', 'editor'),
    validate(scheduleContentSchema),
    contentController.scheduleContent
);

// ============================================
// HOMEPAGE FLAGS (Editors and above)
// ============================================

// Update content flags (Featured, Popular, etc.)
router.put(
    '/:id/flags',
    authenticate,
    authorize('admin', 'editor'),
    validate(updateContentFlagsSchema),
    contentController.updateContentFlags
);

module.exports = router;