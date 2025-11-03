
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');
const { validate } = require('../middlewares/validate.middleware');
const upload = require('../middlewares/upload.middleware');


// Profile routes (authenticated users)
router.put('/profile/me', authenticate, userController.updateProfile);
router.put('/profile/avatar', authenticate, upload.single('image'), userController.updateAvatar);

module.exports = router;