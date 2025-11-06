const Joi = require('joi');

exports.registerSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'editor', 'author', 'viewer').optional()
});

exports.loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

exports.changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
});

exports.refreshTokenSchema = Joi.object({
    // Allow missing in body when using httpOnly cookies
    refreshToken: Joi.string().optional()
});
