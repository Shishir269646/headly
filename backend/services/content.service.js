
const Content = require('../models/Content.model');
const AuditLog = require('../models/AuditLog.model');
const webhookService = require('./webhook.service');
const ApiError = require('../utils/apiError');

exports.getAllContents = async (filters) => {
    const { status, author, category, tag, page = 1, limit = 10, search } = filters;

    const query = { isDeleted: false };

    if (status) query.status = status;
    if (author) query.author = author;
    if (category) query.categories = category;
    if (tag) query.tags = tag;
    if (search) {
        query.$text = { $search: search };
    }

    const contents = await Content.find(query)
        .populate('author', 'name email avatar')
        .populate('featuredImage')
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
        .populate('featuredImage');

    if (!content) {
        throw new ApiError(404, 'Content not found');
    }

    return content;
};

exports.getContentBySlug = async (slug) => {
    const content = await Content.findOne({ slug, isDeleted: false })
        .populate('author', 'name email avatar')
        .populate('featuredImage');

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

