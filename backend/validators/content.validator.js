
const Joi = require('joi');


exports.createContentSchema = Joi.object({
    seo: Joi.string().optional().custom((value, helpers) => {
        try {
            const parsed = JSON.parse(value);
            const seoSchema = Joi.object({
                metaTitle: Joi.string().max(60).optional(),
                metaDescription: Joi.string().max(160).optional(),
                metaKeywords: Joi.array().items(Joi.string()).optional(),
                ogImage: Joi.string().optional()
            });
            const { error } = seoSchema.validate(parsed);
            if (error) {
                return helpers.error('any.invalid', { message: error.details[0].message });
            }
            return parsed;
        } catch (e) {
            return helpers.error('any.invalid', { message: 'Invalid JSON format for SEO data' });
        }
    }, 'SEO JSON string validation')
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
    seo: Joi.string().optional().custom((value, helpers) => {
        try {
            const parsed = JSON.parse(value);
            const seoSchema = Joi.object({
                metaTitle: Joi.string().max(60).optional(),
                metaDescription: Joi.string().max(160).optional(),
                metaKeywords: Joi.array().items(Joi.string()).optional(),
                ogImage: Joi.string().optional()
            });
            const { error } = seoSchema.validate(parsed);
            if (error) {
                return helpers.error('any.invalid', { message: error.details[0].message });
            }
            return parsed;
        } catch (e) {
            return helpers.error('any.invalid', { message: 'Invalid JSON format for SEO data' });
        }
    }, 'SEO JSON string validation')
});

exports.scheduleContentSchema = Joi.object({
    publishAt: Joi.date().greater('now').required()
});

exports.updateContentFlagsSchema = Joi.object({
    isFeatured: Joi.boolean().optional(),
    isPopular: Joi.boolean().optional(),
    featuredOrder: Joi.number().optional()
});

