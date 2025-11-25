
const authService = require('../services/auth.service');
const { successResponse } = require('../utils/responses');
const ApiError = require('../utils/apiError');

exports.register = async (req, res, next) => {
    try {
        const { token, refreshToken, ...userData } = await authService.register(req.body);
        
        // Set httpOnly cookies for both tokens
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });
        
        // Only return user data in the response body
        successResponse(res, userData, 'User registered successfully', 201);
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { token, refreshToken, ...userData } = await authService.login(req.body, req.ip, req.headers['user-agent']);

        // Set httpOnly cookies for both tokens
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        // Only return user data in the response body
        successResponse(res, userData, 'Login successful');
    } catch (error) {
        next(error);
    }
};

exports.logout = async (req, res, next) => {
    try {
        await authService.logout(req.user.id);
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        successResponse(res, null, 'Logout successful');
    } catch (error) {
        next(error);
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            // If refresh token is not in body, try to get it from cookie
            // This can be useful for scenarios where the client doesn't manage refresh tokens
            const refreshTokenFromCookie = req.cookies.refreshToken;
            if (!refreshTokenFromCookie) {
                throw new ApiError(401, 'Refresh token is required');
            }
            req.body.refreshToken = refreshTokenFromCookie;
        }

        const result = await authService.refreshToken(req.body.refreshToken);
        
        // Update httpOnly cookie
        res.cookie('accessToken', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // Also update the refresh token cookie, as some strategies involve rotating them
        if (result.refreshToken) {
             res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            });
        }
        
        // Don't send tokens in the body for security
        successResponse(res, { message: 'Token refreshed successfully' }, 'Token refreshed successfully');
    } catch (error) {
        next(error);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await authService.getUserById(req.user.id);
        successResponse(res, user, 'User profile retrieved');
    } catch (error) {
        next(error);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        await authService.changePassword(req.user.id, req.body);
        successResponse(res, null, 'Password changed successfully');
    } catch (error) {
        next(error);
    }
};

exports.socialLoginCallback = async (req, res, next) => {
    try {
        const user = req.user;
        const { token, refreshToken } = await authService.generateAndSaveTokens(user._id);

        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        // Redirect to a specific frontend route after successful login
        res.redirect(`${process.env.FRONTEND_URL}/auth/social/success`);
    } catch (error) {
        next(error);
    }
};
