
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');
const { validate } = require('../middlewares/validate.middleware');
const upload = require('../middlewares/upload.middleware');
const { updateProfileSchema } = require('../validators/user.validator');

// Admin routes
router.get('/', authenticate, authorize('admin'), userController.getAllUsers);
router.post('/', authenticate, authorize('admin'), userController.createUser);
router.get('/:id', authenticate, authorize('admin'), userController.getUserById);
router.put('/:id', authenticate, authorize('admin'), userController.updateUser);
router.delete('/:id', authenticate, authorize('admin'), userController.deleteUser);

// Profile routes (authenticated users)
router.get('/profile/me', authenticate, userController.getProfile);
router.put('/profile/me', authenticate, validate({ body: updateProfileSchema }), userController.updateProfile);
router.put('/profile/avatar', authenticate, upload.single('image'), userController.updateAvatar);
router.delete('/profile/me', authenticate, userController.deleteProfile);

module.exports = router;