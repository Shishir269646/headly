const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { authLimiter } = require('../middlewares/rateLimit.middleware');
const {
    registerSchema,
    loginSchema,
    changePasswordSchema,
    refreshTokenSchema
} = require('../validators/auth.validator');

// Public routes
router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);

// Social login routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), authController.socialLoginCallback);

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), authController.socialLoginCallback);

router.get('/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE'  }));
router.get('/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), authController.socialLoginCallback);


// Protected routes
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);
router.put('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword);

module.exports = router;
