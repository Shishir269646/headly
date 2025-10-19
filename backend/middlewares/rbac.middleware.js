
const ApiError = require('../utils/apiError');

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError(401, 'Authentication required'));
        }

        if (!roles.includes(req.user.role)) {
            return next(new ApiError(403, 'You do not have permission to perform this action'));
        }

        next();
    };
};

exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return next(new ApiError(403, 'Admin access required'));
    }
    next();
};

exports.isEditorOrAbove = (req, res, next) => {
    if (!req.user || !['admin', 'editor'].includes(req.user.role)) {
        return next(new ApiError(403, 'Editor or Admin access required'));
    }
    next();
};

exports.isOwnerOrAdmin = (resourceOwnerField = 'author') => {
    return (req, res, next) => {
        // This will be used in conjunction with route handlers
        // The actual ownership check will be in the service layer
        next();
    };
};

