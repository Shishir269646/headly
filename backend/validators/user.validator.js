const Joi = require('joi');

exports.createUserSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'editor', 'author', 'viewer').required(),
    bio: Joi.string().max(500).optional()
});

exports.updateUserSchema = Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    email: Joi.string().email().optional(),
    role: Joi.string().valid('admin', 'editor', 'author', 'viewer').optional(),
    bio: Joi.string().max(500).optional(),
    avatar: Joi.string().optional(),
    isActive: Joi.boolean().optional()
});

exports.updateProfileSchema = Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    bio: Joi.string().max(500).optional(),
    avatar: Joi.string().optional()
});

