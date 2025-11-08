const Joi = require('joi');

exports.createCommentSchema = {
    body: Joi.object({
        contentId: Joi.string().hex().length(24).optional(),
        parentId: Joi.string().hex().length(24).optional().allow(null),
        body: Joi.string().min(3).max(5000).required(),
        // Guest fields (required if not authenticated)
        guestName: Joi.string().max(100).optional(),
        guestEmail: Joi.string().email().max(255).optional(),
        guestWebsite: Joi.string().uri().max(255).optional().allow('')
    }).unknown(false)
};

exports.updateCommentSchema = {
    body: Joi.object({
        body: Joi.string().min(3).max(5000).required()
    }).unknown(false),
    params: Joi.object({
        id: Joi.string().hex().length(24).required()
    })
};

exports.moderateCommentSchema = {
    body: Joi.object({
        status: Joi.string().valid('pending', 'approved', 'spam', 'trash').required()
    }).unknown(false),
    params: Joi.object({
        id: Joi.string().hex().length(24).required()
    })
};

exports.bulkModerateCommentSchema = {
    body: Joi.object({
        commentIds: Joi.array().items(Joi.string().hex().length(24)).min(1).required(),
        status: Joi.string().valid('pending', 'approved', 'spam', 'trash').required()
    }).unknown(false)
};

exports.toggleLikeSchema = {
    params: Joi.object({
        id: Joi.string().hex().length(24).required()
    })
};

