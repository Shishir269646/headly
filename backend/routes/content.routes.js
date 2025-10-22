const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const { authenticate, optionalAuth } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');
const { validate } = require('../middlewares/validate.middleware');
const {
    createContentSchema,
    updateContentSchema,
    scheduleContentSchema
} = require('../validators/content.validator');

// Public routes (with optional auth for analytics)
router.get('/', optionalAuth, contentController.getAllContents);
router.get('/slug/:slug', optionalAuth, contentController.getContentBySlug);
router.get('/:id', optionalAuth, contentController.getContentById);

// Protected routes - Authors can create        
router.post('/', authenticate, authorize('admin', 'editor', 'author'), validate(createContentSchema), contentController.createContent);

// Protected routes - Authors can edit their own
router.put('/:id', authenticate, authorize('admin', 'editor', 'author'), validate(updateContentSchema), contentController.updateContent);
router.delete('/:id', authenticate, authorize('admin', 'editor', 'author'), contentController.deleteContent);

// Publishing routes - Editors and above
router.post('/:id/publish', authenticate, authorize('admin', 'editor'), contentController.publishContent);
router.post('/:id/schedule', authenticate, authorize('admin', 'editor'), validate(scheduleContentSchema), contentController.scheduleContent);

module.exports = router;