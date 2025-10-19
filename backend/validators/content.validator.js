
const Joi = require('joi');

exports.createContentSchema = Joi.object({
    title: Joi.string().min(3).max(200).required(),
    excerpt: Joi.string().max(500).optional(),
    body: Joi.string().required(),
    featuredImage: Joi.string().optional(),
    status: Joi.string().valid('draft', 'published', 'scheduled', 'archived').default('draft'),
    publishAt: Joi.date().optional(),
    categories: Joi.array().items(Joi.string()).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    seo: Joi.object({
        metaTitle: Joi.string().max(60).optional(),
        metaDescription: Joi.string().max(160).optional(),
        metaKeywords: Joi.array().items(Joi.string()).optional(),
        ogImage: Joi.string().optional()
    }).optional()
});

exports.updateContentSchema = Joi.object({
    title: Joi.string().min(3).max(200).optional(),
    excerpt: Joi.string().max(500).optional(),
    body: Joi.string().optional(),
    featuredImage: Joi.string().optional(),
    status: Joi.string().valid('draft', 'published', 'scheduled', 'archived').optional(),
    publishAt: Joi.date().optional(),
    categories: Joi.array().items(Joi.string()).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
    seo: Joi.object({
        metaTitle: Joi.string().max(60).optional(),
        metaDescription: Joi.string().max(160).optional(),
        metaKeywords: Joi.array().items(Joi.string()).optional(),
        ogImage: Joi.string().optional()
    }).optional()
});

exports.scheduleContentSchema = Joi.object({
    publishAt: Joi.date().greater('now').required()
});

