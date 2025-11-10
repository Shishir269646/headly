const categoryService = require('../services/category.service');
const { successResponse } = require('../utils/responses');

exports.getAllCategories = async (req, res, next) => {
    try {
        const categories = await categoryService.getAllCategories();
        successResponse(res, categories, 'Categories retrieved successfully');
    } catch (error) {
        next(error);
    }
};

exports.getCategoryById = async (req, res, next) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        successResponse(res, category, 'Category retrieved successfully');
    } catch (error) {
        next(error);
    }
};

exports.createCategory = async (req, res, next) => {
    try {
        const category = await categoryService.createCategory(req.body);
        successResponse(res, category, 'Category created successfully', 201);
    } catch (error) {
        next(error);
    }
};

exports.updateCategory = async (req, res, next) => {
    try {
        const category = await categoryService.updateCategory(req.params.id, req.body);
        successResponse(res, category, 'Category updated successfully');
    } catch (error) {
        next(error);
    }
};

exports.deleteCategory = async (req, res, next) => {
    try {
        await categoryService.deleteCategory(req.params.id);
        successResponse(res, null, 'Category deleted successfully');
    } catch (error) {
        next(error);
    }
};
