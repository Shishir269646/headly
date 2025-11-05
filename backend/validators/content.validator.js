
const Joi = require('joi');


const parseArrayFromUnknown = (value, helpers) => {
    if (value === undefined || value === null || value === '') return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) return [];
        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) return parsed;
        } catch (_) {
            // not JSON, fall through to comma split
        }
        return trimmed.split(',').map(s => String(s).trim()).filter(Boolean);
    }
    return helpers.error('any.invalid', { message: 'Expected array or JSON string' });
};

const seoStringOrObject = Joi.alternatives().try(
    Joi.string().custom((value, helpers) => {
        try {
            const parsed = JSON.parse(value);
            const seoSchema = Joi.object({
                metaTitle: Joi.string().max(60).optional(),
                metaDescription: Joi.string().max(160).optional(),
                metaKeywords: Joi.array().items(Joi.string()).optional(),
                ogImage: Joi.string().optional()
            });
            const { error } = seoSchema.validate(parsed);
            if (error) return helpers.error('any.invalid', { message: error.details[0].message });
            return value; // keep as string; downstream can parse if needed
        } catch (e) {
            return helpers.error('any.invalid', { message: 'Invalid JSON format for SEO data' });
        }
    }, 'SEO JSON string validation'),
    Joi.object({
        metaTitle: Joi.string().max(60).optional(),
        metaDescription: Joi.string().max(160).optional(),
        metaKeywords: Joi.array().items(Joi.string()).optional(),
        ogImage: Joi.string().optional()
    })
);

exports.createContentSchema = {
    body: Joi.object({
        title: Joi.string().min(3).max(200).required(),
        slug: Joi.string().optional(),
        excerpt: Joi.string().max(500).optional().allow(''),
        body: Joi.string().required(),
        featuredImage: Joi.string().allow('').optional(),
        status: Joi.string().valid('draft', 'published', 'scheduled', 'archived').optional().allow(''),
        publishAt: Joi.alternatives().try(Joi.date(), Joi.string().allow('')).optional(),
        categories: Joi.custom(parseArrayFromUnknown).optional(),
        tags: Joi.custom(parseArrayFromUnknown).optional(),
        seo: seoStringOrObject.optional()
    }).unknown(true)
};

exports.updateContentSchema = {
    body: Joi.object({
        title: Joi.string().min(3).max(200).optional(),
        slug: Joi.string().optional(),
        excerpt: Joi.string().max(500).optional().allow(''),
        body: Joi.string().optional().allow(''),
        featuredImage: Joi.string().allow('').optional(),
        status: Joi.string().valid('draft', 'published', 'scheduled', 'archived').optional().allow(''),
        publishAt: Joi.alternatives().try(Joi.date(), Joi.string().allow('')).optional(),
        categories: Joi.custom(parseArrayFromUnknown).optional(),
        tags: Joi.custom(parseArrayFromUnknown).optional(),
        seo: seoStringOrObject.optional()
    }).unknown(true),
    params: Joi.object({
        id: Joi.string().hex().length(24).required()
    })
};

exports.scheduleContentSchema = Joi.object({
    publishAt: Joi.date().greater('now').required()
});

exports.updateContentFlagsSchema = Joi.object({
    isFeatured: Joi.boolean().optional(),
    isPopular: Joi.boolean().optional(),
    featuredOrder: Joi.number().optional()
});

