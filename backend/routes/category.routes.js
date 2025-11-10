const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { authorize } = require('../middlewares/rbac.middleware');
const { validate } = require('../middlewares/validate.middleware');
const { createCategorySchema, updateCategorySchema } = require('../validators/category.validator');

// Public route to get all categories
router.get('/', categoryController.getAllCategories);

// Public route to get a single category by ID
router.get('/:id', categoryController.getCategoryById);

// Protected routes for admin
router.post(
    '/',
    authenticate,
    authorize('admin'),
    validate(createCategorySchema),
    categoryController.createCategory
);

router.put(
    '/:id',
    authenticate,
    authorize('admin'),
    validate(updateCategorySchema),
    categoryController.updateCategory
);

router.delete(
    '/:id',
    authenticate,
    authorize('admin'),
    categoryController.deleteCategory
);

module.exports = router;
