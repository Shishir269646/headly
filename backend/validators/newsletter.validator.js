
const Joi = require('joi');

const newsletterValidators = {
    // Subscribe to newsletter
    subscribe: {
        body: Joi.object({
            email: Joi.string()
                .email()
                .required()
                .lowercase()
                .trim()
                .messages({
                    'string.email': 'Please provide a valid email address',
                    'string.empty': 'Email is required',
                    'any.required': 'Email is required'
                }),
            preferences: Joi.object({
                frequency: Joi.string()
                    .valid('daily', 'weekly', 'monthly')
                    .default('weekly')
                    .messages({
                        'any.only': 'Frequency must be one of: daily, weekly, monthly'
                    }),
                categories: Joi.array()
                    .items(Joi.string())
                    .default([])
            }).optional(),
            metadata: Joi.object({
                ipAddress: Joi.string(),
                userAgent: Joi.string(),
                source: Joi.string()
            }).optional()
        })
    },

    // Confirm subscription
    confirmSubscription: {
        params: Joi.object({
            token: Joi.string()
                .required()
                .messages({
                    'any.required': 'Confirmation token is required'
                })
        })
    },

    // Unsubscribe
    unsubscribe: {
        body: Joi.object({
            email: Joi.string()
                .email()
                .required()
                .lowercase()
                .trim()
                .messages({
                    'string.email': 'Please provide a valid email address',
                    'string.empty': 'Email is required',
                    'any.required': 'Email is required'
                })
        })
    },

    // Update preferences
    updatePreferences: {
        params: Joi.object({
            email: Joi.string()
                .email()
                .required()
                .messages({
                    'any.required': 'Email is required'
                })
        }),
        body: Joi.object({
            frequency: Joi.string()
                .valid('daily', 'weekly', 'monthly')
                .messages({
                    'any.only': 'Frequency must be one of: daily, weekly, monthly'
                }),
            categories: Joi.array()
                .items(Joi.string())
        })
    }
};

module.exports = newsletterValidators;


