
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const contactValidator = require('../validators/contact.validator');
const { validate } = require('../middlewares/validate.middleware');
const { authenticate: protect } = require('../middlewares/auth.middleware');
const { authorize: restrictTo } = require('../middlewares/rbac.middleware');
const { apiLimiter } = require('../middlewares/rateLimit.middleware');
const catchAsync = require('../utils/asyncHandler');

// Apply rate limiting to contact form submissions
router.post(
    '/',
    apiLimiter,
    validate(contactValidator.createContact),
    catchAsync(contactController.createContact)
);

/**
 * Admin Routes (Protected)
 */
// Get all contact submissions
router.get(
    '/',
    protect,
    restrictTo('admin'),
    catchAsync(contactController.getContacts)
);

// Get single contact
router.get(
    '/:id',
    protect,
    restrictTo('admin'),
    catchAsync(contactController.getContactById)
);

// Update contact
router.patch(
    '/:id',
    protect,
    restrictTo('admin'),
    validate(contactValidator.updateContact),
    catchAsync(contactController.updateContact)
);

// Delete contact
router.delete(
    '/:id',
    protect,
    restrictTo('admin'),
    catchAsync(contactController.deleteContact)
);

// Mark as read
router.patch(
    '/:id/read',
    protect,
    restrictTo('admin'),
    catchAsync(contactController.markAsRead)
);

// Update status
router.patch(
    '/:id/status',
    protect,
    restrictTo('admin'),
    catchAsync(contactController.updateStatus)
);

module.exports = router;


