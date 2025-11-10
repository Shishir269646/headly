const Category = require('../models/Category.model');
const ApiError = require('../utils/apiError');

exports.getAllCategories = async () => {
    const categories = await Category.find().sort({ createdAt: -1 });
    return categories;
};

exports.getCategoryById = async (categoryId) => {
    const category = await Category.findById(categoryId);
    if (!category) {
        throw new ApiError(404, 'Category not found');
    }
    return category;
};

exports.createCategory = async (categoryData) => {
    if (await Category.findOne({ name: categoryData.name })) {
        throw new ApiError(400, 'Category with this name already exists');
    }
    const category = await Category.create(categoryData);
    return category;
};

exports.updateCategory = async (categoryId, updateData) => {
    const category = await Category.findById(categoryId);

    if (!category) {
        throw new ApiError(404, 'Category not found');
    }

    if (updateData.name && (await Category.findOne({ name: updateData.name, _id: { $ne: categoryId } }))) {
        throw new ApiError(400, 'Category with this name already exists');
    }

    Object.assign(category, updateData);
    await category.save();
    return category;
};

exports.deleteCategory = async (categoryId) => {
    const category = await Category.findById(categoryId);

    if (!category) {
        throw new ApiError(404, 'Category not found');
    }

    // Optional: Check if any content is using this category before deletion
    // const contentCount = await Content.countDocuments({ category: categoryId });
    // if (contentCount > 0) {
    //     throw new ApiError(400, `Cannot delete category. It is currently assigned to ${contentCount} content item(s).`);
    // }

    await category.deleteOne();
};
