
const ApiError = require('../utils/apiError');

exports.notFound = (req, res, next) => {
    const error = new ApiError(404, `Route ${req.originalUrl} not found`);
    next(error);
};