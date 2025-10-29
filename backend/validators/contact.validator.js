
const Joi = require('joi');

const contactValidators = {
    // Create contact form submission
    createContact: {
        body: Joi.object({
            name: Joi.string()
                .required()
                .trim()
                .max(100)
                .messages({
                    'string.empty': 'Name is required',
                    'string.max': 'Name cannot exceed 100 characters',
                    'any.required': 'Name is required'
                }),
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
            subject: Joi.string()
                .required()
                .trim()
                .max(200)
                .messages({
                    'string.empty': 'Subject is required',
                    'string.max': 'Subject cannot exceed 200 characters',
                    'any.required': 'Subject is required'
                }),
            message: Joi.string()
                .required()
                .trim()
                .max(2000)
                .messages({
                    'string.empty': 'Message is required',
                    'string.max': 'Message cannot exceed 2000 characters',
                    'any.required': 'Message is required'
                })
        })
    },

    // Update contact (admin only)
    updateContact: {
        body: Joi.object({
            status: Joi.string()
                .valid('new', 'in-progress', 'resolved', 'archived')
                .messages({
                    'any.only': 'Status must be one of: new, in-progress, resolved, archived'
                }),
            read: Joi.boolean(),
            replied: Joi.boolean(),
            adminNotes: Joi.string()
                .allow(null, '')
                .max(500)
                .messages({
                    'string.max': 'Admin notes cannot exceed 500 characters'
                })
        })
    }
};

module.exports = contactValidators;


