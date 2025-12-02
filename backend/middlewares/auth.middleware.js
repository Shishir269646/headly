
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const ApiError = require('../utils/apiError');

exports.authenticate = async (req, res, next) => {
    try {
        let token;

         console.log("AUTH HEADER:", req.headers.authorization);
        console.log("COOKIE TOKEN:", req.cookies?.accessToken);
        console.log("BEARER TOKEN:", req.headers.authorization?.split(" ")[1]);


        // Get token from the httpOnly cookie
        if (req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }

        if (!token) {
            throw new ApiError(401, 'Authentication required. Please login.');
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new ApiError(401, 'User not found. Token is invalid.');
        }

        if (!user.isActive) {
            throw new ApiError(403, 'Your account has been deactivated.');
        }

        // Attach user to request
        req.user = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            next(new ApiError(401, 'Invalid token'));
        } else if (error.name === 'TokenExpiredError') {
            next(new ApiError(401, 'Token has expired'));
        } else {
            next(error);
        }
    }
};

exports.optionalAuth = async (req, res, next) => {
    try {
        let token;

        // Get token from the httpOnly cookie
        if (req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (user && user.isActive) {
                req.user = {
                    id: user._id,
                    email: user.email,
                    role: user.role
                };
            }
        }

        next();
    } catch (error) {
        // Continue without authentication
        next();
    }
};
