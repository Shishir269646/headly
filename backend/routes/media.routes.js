
const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/media.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { uploadSingle, uploadMultiple } = require('../middlewares/upload.middleware');
const { uploadLimiter } = require('../middlewares/rateLimit.middleware');
const { updateMediaSchema } = require('../validators/media.validator');

// Get media (all authenticated users)
router.get('/', mediaController.getAllMedia);
router.get('/:id', mediaController.getMediaById);

// Upload media (authors and above)
router.post('/upload', authenticate, authorize('admin', 'editor', 'author'), uploadLimiter, uploadSingle, mediaController.uploadMedia);
router.post('/upload-multiple', authenticate, authorize('admin', 'editor', 'author'), uploadLimiter, uploadMultiple, mediaController.uploadMultipleMedia);

// Update/Delete media
router.put('/:id', authenticate, authorize('admin', 'editor', 'author'), validate(updateMediaSchema), mediaController.updateMedia);
router.delete('/:id', authenticate, authorize('admin', 'editor'), mediaController.deleteMedia);

module.exports = router;