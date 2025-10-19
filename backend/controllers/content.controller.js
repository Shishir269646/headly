
const contentService = require('../services/content.service');
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
        const content = await contentService.createContent(req.user.id, req.body);
        successResponse(res, content, 'Content created successfully', 201);
    } catch (error) {
        next(error);
    }
};

exports.updateContent = async (req, res, next) => {
    try {
        const content = await contentService.updateContent(req.params.id, req.body, req.user);
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

