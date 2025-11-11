
const Content = require('../models/Content.model');
const Category = require('../models/Category.model');
const AuditLog = require('../models/AuditLog.model');
const webhookService = require('./webhook.service');
const ApiError = require('../utils/apiError');

exports.getAllContents = async (filters) => {
    const { status, author, category: categorySlug, tag, page = 1, limit = 10, search } = filters;

    const query = { isDeleted: false };

    if (status) query.status = status;
    if (author) query.author = author;
    if (tag) query.tags = tag;
    if (search) {
        query.$text = { $search: search };
    }

    if (categorySlug) {
        const category = await Category.findOne({ slug: categorySlug });
        if (category) {
            query.category = category._id;
        } else {
            // If category slug is provided but not found, return no content
            return {
                contents: [],
                pagination: { total: 0, page: 1, pages: 0 }
            };
        }
    }

    const contents = await Content.find(query)
        .populate('author', 'name email avatar')
        .populate('featuredImage')
        .populate('category', 'name slug')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const total = await Content.countDocuments(query);

    return {
        contents,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        }
    };
};

exports.getContentById = async (contentId) => {
    const content = await Content.findOne({ _id: contentId, isDeleted: false })
        .populate('author', 'name email avatar')
        .populate('featuredImage')
        .populate('category', 'name slug');

    if (!content) {
        throw new ApiError(404, 'Content not found');
    }

    return content;
};

exports.getContentBySlug = async (slug) => {
    const content = await Content.findOne({ slug, isDeleted: false })
        .populate('author', 'name email avatar')
        .populate('featuredImage')
        .populate('category', 'name slug');

    if (!content) {
        throw new ApiError(404, 'Content not found');
    }

    // Increment views
    content.views += 1;
    await content.save();

    return content;
};

exports.createContent = async (authorId, contentData) => {
    const content = await Content.create({
        ...contentData,
        author: authorId
    });

    await AuditLog.create({
        user: authorId,
        action: 'CREATE_CONTENT',
        resource: 'content',
        resourceId: content._id
    });

    return content.populate('author', 'name email avatar');
};

exports.updateContent = async (contentId, updateData, user) => {
    const content = await Content.findOne({ _id: contentId, isDeleted: false });

    if (!content) {
        throw new ApiError(404, 'Content not found');
    }

    // Check permissions
    if (user.role !== 'admin' && content.author.toString() !== user.id) {
        throw new ApiError(403, 'You do not have permission to update this content');
    }

    Object.assign(content, updateData);
    await content.save();

    await AuditLog.create({
        user: user.id,
        action: 'UPDATE_CONTENT',
        resource: 'content',
        resourceId: content._id,
        details: updateData
    });

    return content.populate('author', 'name email avatar');
};

exports.deleteContent = async (contentId, user) => {
    const content = await Content.findOne({ _id: contentId, isDeleted: false });

    if (!content) {
        throw new ApiError(404, 'Content not found');
    }

    // Check permissions
    if (user.role !== 'admin' && content.author.toString() !== user.id) {
        throw new ApiError(403, 'You do not have permission to delete this content');
    }

    await content.softDelete();

    await AuditLog.create({
        user: user.id,
        action: 'DELETE_CONTENT',
        resource: 'content',
        resourceId: content._id
    });
};

exports.publishContent = async (contentId, user) => {
    const content = await Content.findOne({ _id: contentId, isDeleted: false });

    if (!content) {
        throw new ApiError(404, 'Content not found');
    }

    content.status = 'published';
    content.publishAt = new Date();
    await content.save();

    await AuditLog.create({
        user: user.id,
        action: 'PUBLISH_CONTENT',
        resource: 'content',
        resourceId: content._id
    });

    // Trigger webhook for frontend revalidation
    await webhookService.triggerRevalidate(content.slug, 'publish');

    return content.populate('author', 'name email avatar');
};

exports.scheduleContent = async (contentId, publishAt, user) => {
    const content = await Content.findOne({ _id: contentId, isDeleted: false });

    if (!content) {
        throw new ApiError(404, 'Content not found');
    }

    const scheduledDate = new Date(publishAt);
    if (scheduledDate <= new Date()) {
        throw new ApiError(400, 'Scheduled date must be in the future');
    }

    content.status = 'scheduled';
    content.publishAt = scheduledDate;
    await content.save();

    await AuditLog.create({
        user: user.id,
        action: 'UPDATE_CONTENT',
        resource: 'content',
        resourceId: content._id,
        details: { status: 'scheduled', publishAt }
    });

    return content.populate('author', 'name email avatar');
};

// 1. Latest (Automatic)
exports.getLatestContents = async (limit = 6) => {
    return await Content.find({
        status: 'published',
        isDeleted: false
    })
        .populate('author', 'name email avatar')
        .populate('featuredImage')
        .sort({ publishAt: -1, createdAt: -1 })
        .limit(limit);
};

// 2. Trending (Automatic - based on views)
exports.getTrendingContents = async (limit = 6) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return await Content.find({
        status: 'published',
        isDeleted: false,
        createdAt: { $gte: sevenDaysAgo }
    })
        .populate('author', 'name email avatar')
        .populate('featuredImage')
        .sort({ views: -1, createdAt: -1 })
        .limit(limit);
};

// 3. Popular (Manual - admin selected)
exports.getPopularContents = async (limit = 6) => {
    return await Content.find({
        status: 'published',
        isDeleted: false,
        isPopular: true
    })
        .populate('author', 'name email avatar')
        .populate('featuredImage')
        .sort({ views: -1 })
        .limit(limit);
};

// 4. Featured (Manual - admin selected)
exports.getFeaturedContents = async (limit = 4) => {
    return await Content.find({
        status: 'published',
        isDeleted: false,
        isFeatured: true
    })
        .populate('author', 'name email avatar')
        .populate('featuredImage')
        .sort({ featuredOrder: -1, createdAt: -1 })
        .limit(limit);
};

// 5. Update content flags (admin only)
exports.updateContentFlags = async (contentId, flags) => {
    const update = {};
    if (flags.isFeatured !== undefined) update.isFeatured = flags.isFeatured;
    if (flags.isPopular !== undefined) update.isPopular = flags.isPopular;
    if (flags.featuredOrder !== undefined) update.featuredOrder = flags.featuredOrder;

    const content = await Content.findByIdAndUpdate(
        contentId,
        { $set: update },
        { new: true, runValidators: true }
    );

    if (!content) {
        throw new ApiError(404, 'Content not found');
    }

    return content;
};
