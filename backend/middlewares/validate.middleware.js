
const ApiError = require('../utils/apiError');

exports.validate = (schema) => {
    return (req, res, next) => {
        const validations = [];

        if (schema.body) {
            validations.push(schema.body.validate(req.body, { abortEarly: false, stripUnknown: true }));
        }
        if (schema.query) {
            validations.push(schema.query.validate(req.query, { abortEarly: false, stripUnknown: true }));
        }
        if (schema.params) {
            validations.push(schema.params.validate(req.params, { abortEarly: false, stripUnknown: true }));
        }

        const errors = [];
        let validatedValues = {};

        for (const validation of validations) {
            if (validation.error) {
                errors.push(...validation.error.details.map(detail => ({
                    field: detail.path.join('.'),
                    message: detail.message
                })));
            }
            if (validation.value) {
                validatedValues = { ...validatedValues, ...validation.value };
            }
        }

        if (errors.length > 0) {
            return next(new ApiError(400, 'Validation error', errors));
        }

        // Re-assign validated values
        if (schema.body) req.body = validatedValues;
        if (schema.query) req.query = validatedValues;
        if (schema.params) req.params = validatedValues;

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

