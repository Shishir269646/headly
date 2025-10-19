
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');
const { validate } = require('../middlewares/validate.middleware');
const {
    createUserSchema,
    updateUserSchema,
    updateProfileSchema
} = require('../validators/user.validator');

// Admin only routes
router.get('/', authenticate, authorize('admin'), userController.getAllUsers);
router.post('/', authenticate, authorize('admin'), validate(createUserSchema), userController.createUser);
router.get('/:id', authenticate, authorize('admin'), userController.getUserById);
router.put('/:id', authenticate, authorize('admin'), validate(updateUserSchema), userController.updateUser);
router.delete('/:id', authenticate, authorize('admin'), userController.deleteUser);

// User profile routes
router.put('/profile/me', authenticate, validate(updateProfileSchema), userController.updateProfile);

module.exports = router;