
const ApiError = require('../utils/apiError');

exports.validate = (schema) => {
    return (req, res, next) => {
        // Handle both direct Joi schemas and schema objects with body/query/params keys
        let joiSchema = schema;
        let dataToValidate = req.body;
        
        if (schema.body) {
            joiSchema = schema.body;
            dataToValidate = req.body;
        } else if (schema.query) {
            joiSchema = schema.query;
            dataToValidate = req.query;
        } else if (schema.params) {
            joiSchema = schema.params;
            dataToValidate = req.params;
        }

        const { error, value } = joiSchema.validate(dataToValidate, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return next(new ApiError(400, 'Validation error', errors));
        }

        if (schema.body) {
            req.body = value;
        } else if (schema.query) {
            req.query = value;
        } else if (schema.params) {
            req.params = value;
        } else {
            req.body = value;
        }
        
        next();
    };
};

exports.validateQuery = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return next(new ApiError(400, 'Query validation error', errors));
        }

        req.query = value;
        next();
    };
};

