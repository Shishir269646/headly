const Joi = require('joi');

exports.updateProfileSchema = Joi.object({
    name: Joi.string().min(3).max(50).optional(),
    bio: Joi.string().max(500).optional(),
});