
const mediaService = require('../services/media.service');
const { successResponse } = require('../utils/responses');

exports.getAllMedia = async (req, res, next) => {
    try {
        const result = await mediaService.getAllMedia(req.query);
        successResponse(res, result, 'Media retrieved successfully');
    } catch (error) {
        next(error);
    }
};

exports.getMediaById = async (req, res, next) => {
    try {
        const media = await mediaService.getMediaById(req.params.id);
        successResponse(res, media, 'Media retrieved successfully');
    } catch (error) {
        next(error);
    }
};

exports.uploadMedia = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new ApiError(400, 'No file uploaded');
        }
        const media = await mediaService.uploadMedia(req.file, req.user.id, req.body);
        successResponse(res, media, 'Media uploaded successfully', 201);
    } catch (error) {
        next(error);
    }
};

exports.uploadMultipleMedia = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            throw new ApiError(400, 'No files uploaded');
        }
        const media = await mediaService.uploadMultipleMedia(req.files, req.user.id);
        successResponse(res, media, 'Media uploaded successfully', 201);
    } catch (error) {
        next(error);
    }
};

exports.updateMedia = async (req, res, next) => {
    try {
        const media = await mediaService.updateMedia(req.params.id, req.body);
        successResponse(res, media, 'Media updated successfully');
    } catch (error) {
        next(error);
    }
};

exports.deleteMedia = async (req, res, next) => {
    try {
        await mediaService.deleteMedia(req.params.id);
        successResponse(res, null, 'Media deleted successfully');
    } catch (error) {
        next(error);
    }
};

