
const contentService = require('../services/content.service');
const mediaService = require('../services/media.service');
const { successResponse } = require('../utils/responses');


exports.getAllContents = async (req, res, next) => {
    try {
        const result = await contentService.getAllContents(req.query);
        successResponse(res, result, 'Contents retrieved successfully');
    } catch (error) {
        next(error);
    }
};

exports.getContentById = async (req, res, next) => {
    try {
        const content = await contentService.getContentById(req.params.id);
        successResponse(res, content, 'Content retrieved successfully');
    } catch (error) {
        next(error);
    }
};

exports.getContentBySlug = async (req, res, next) => {
    try {
        const content = await contentService.getContentBySlug(req.params.slug);
        successResponse(res, content, 'Content retrieved successfully');
    } catch (error) {
        next(error);
    }
};

exports.createContent = async (req, res, next) => {
    try {
        let featuredImageId = req.body.featuredImage || null;
        if (req.file) {
            const media = await mediaService.uploadMedia(req.file, req.user.id);
            featuredImageId = media._id;
        }
        let seo = req.body.seo;
        if (typeof seo === 'string') {
            try { seo = JSON.parse(seo); } catch (_) { seo = undefined; }
        }
        const contentData = { ...req.body, seo, featuredImage: featuredImageId };
        const content = await contentService.createContent(req.user.id, contentData);
        successResponse(res, content, 'Content created successfully', 201);
    } catch (error) {
        next(error);
    }
};

exports.updateContent = async (req, res, next) => {
    try {
        let featuredImageId = req.body.featuredImage; // Keep existing if not updated
        if (req.file) {
            const media = await mediaService.uploadMedia(req.file, req.user.id);
            featuredImageId = media._id;
        }
        let seo = req.body.seo;
        if (typeof seo === 'string') {
            try { seo = JSON.parse(seo); } catch (_) { seo = undefined; }
        }
        // Normalize categories/tags if they came as comma strings
        const normalizeArr = (v) => Array.isArray(v) ? v : (typeof v === 'string' ? v.split(',').map(s => s.trim()).filter(Boolean) : undefined);
        const categories = normalizeArr(req.body.categories);
        const tags = normalizeArr(req.body.tags);
        const contentData = { ...req.body, seo, categories, tags, featuredImage: featuredImageId };
        const content = await contentService.updateContent(req.params.id, contentData, req.user);
        successResponse(res, content, 'Content updated successfully');
    } catch (error) {
        next(error);
    }
};

exports.deleteContent = async (req, res, next) => {
    try {
        await contentService.deleteContent(req.params.id, req.user);
        successResponse(res, null, 'Content deleted successfully');
    } catch (error) {
        next(error);
    }
};

exports.publishContent = async (req, res, next) => {
    try {
        const content = await contentService.publishContent(req.params.id, req.user);
        successResponse(res, content, 'Content published successfully');
    } catch (error) {
        next(error);
    }
};

exports.scheduleContent = async (req, res, next) => {
    try {
        const content = await contentService.scheduleContent(req.params.id, req.body.publishAt, req.user);
        successResponse(res, content, 'Content scheduled successfully');
    } catch (error) {
        next(error);
    }
};


exports.getLatestContents = async (req, res, next) => {
    try {
        const { limit = 6 } = req.query;
        const contents = await contentService.getLatestContents(parseInt(limit));
        successResponse(res, contents, 'Latest contents retrieved');
    } catch (error) {
        next(error);
    }
};

exports.getTrendingContents = async (req, res, next) => {
    try {
        const { limit = 6 } = req.query;
        const contents = await contentService.getTrendingContents(parseInt(limit));
        successResponse(res, contents, 'Trending contents retrieved');
    } catch (error) {
        next(error);
    }
};

exports.getPopularContents = async (req, res, next) => {
    try {
        const { limit = 6 } = req.query;
        const contents = await contentService.getPopularContents(parseInt(limit));
        successResponse(res, contents, 'Popular contents retrieved');
    } catch (error) {
        next(error);
    }
};

exports.getFeaturedContents = async (req, res, next) => {
    try {
        const { limit = 4 } = req.query;
        const contents = await contentService.getFeaturedContents(parseInt(limit));
        successResponse(res, contents, 'Featured contents retrieved');
    } catch (error) {
        next(error);
    }
};

exports.updateContentFlags = async (req, res, next) => {
    try {
        const content = await contentService.updateContentFlags(
            req.params.id,
            req.body
        );
        successResponse(res, content, 'Content flags updated');
    } catch (error) {
        next(error);
    }
};