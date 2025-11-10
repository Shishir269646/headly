const Joi = require('joi');

exports.createCategorySchema = {
    body: Joi.object({
        name: Joi.string().min(3).max(100).required(),
        description: Joi.string().max(500).optional().allow('')
    })
};

exports.updateCategorySchema = {
    body: Joi.object({
        name: Joi.string().min(3).max(100).optional(),
        description: Joi.string().max(500).optional().allow('')
    }),
    params: Joi.object({
        id: Joi.string().hex().length(24).required()
    })
};
