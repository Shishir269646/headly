const Joi = require('joi');

exports.updateMediaSchema = Joi.object({
    alt: Joi.string().max(200).optional(),
    caption: Joi.string().max(500).optional(),
    folder: Joi.string().optional()
});
