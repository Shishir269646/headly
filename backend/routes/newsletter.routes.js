
const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletter.controller');
const newsletterValidator = require('../validators/newsletter.validator');
const { validate } = require('../middlewares/validate.middleware');
const { authenticate: protect } = require('../middlewares/auth.middleware');
const { authorize: restrictTo } = require('../middlewares/rbac.middleware');
const { apiLimiter } = require('../middlewares/rateLimit.middleware');
const catchAsync = require('../utils/asyncHandler');

// Apply rate limiting to newsletter subscriptions
router.post(
    '/subscribe',
    apiLimiter,
    validate(newsletterValidator.subscribe),
    catchAsync(newsletterController.subscribe)
);

// Confirm subscription
router.get(
    '/confirm/:token',
    catchAsync(newsletterController.confirmSubscription)
);

// Unsubscribe
router.post(
    '/unsubscribe',
    validate(newsletterValidator.unsubscribe),
    catchAsync(newsletterController.unsubscribe)
);

/**
 * Admin Routes (Protected)
 */
// Get all subscribers
router.get(
    '/subscribers',
    protect,
    restrictTo('admin'),
    catchAsync(newsletterController.getSubscribers)
);

// Get single subscriber
router.get(
    '/subscribers/:id',
    protect,
    restrictTo('admin'),
    catchAsync(newsletterController.getSubscriberById)
);

// Delete subscriber
router.delete(
    '/subscribers/:id',
    protect,
    restrictTo('admin'),
    catchAsync(newsletterController.deleteSubscriber)
);

// Update preferences
router.patch(
    '/preferences/:email',
    validate(newsletterValidator.updatePreferences),
    catchAsync(newsletterController.updatePreferences)
);

module.exports = router;


