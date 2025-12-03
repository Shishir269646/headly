const authService = require('../services/auth.service');
const { successResponse } = require('../utils/responses');
const ApiError = require('../utils/apiError');

// Cookie options generator
const cookieOptions = (maxAge) => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge
});

exports.register = async (req, res, next) => {
    try {
        const { token, refreshToken, user } = await authService.register(req.body);

        res.cookie('accessToken', token, cookieOptions(24 * 60 * 60 * 1000));  // 1 day
        res.cookie('refreshToken', refreshToken, cookieOptions(30 * 24 * 60 * 60 * 1000)); // 30 days

        successResponse(res, user, 'User registered successfully', 201);
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { token, refreshToken, user } = await authService.login(
            req.body,
            req.ip,
            req.headers['user-agent']
        );

        res.cookie('accessToken', token, cookieOptions(24 * 60 * 60 * 1000));
        res.cookie('refreshToken', refreshToken, cookieOptions(30 * 24 * 60 * 60 * 1000));

        successResponse(res, user, 'Login successful');
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
        const refreshToken = req.body.refreshToken || req.cookies.refreshToken;
        if (!refreshToken) throw new ApiError(401, 'Refresh token is required');

        const result = await authService.refreshToken(refreshToken);

        res.cookie('accessToken', result.token, cookieOptions(24 * 60 * 60 * 1000));

        if (result.refreshToken) {
            res.cookie('refreshToken', result.refreshToken, cookieOptions(30 * 24 * 60 * 60 * 1000));
        }

        successResponse(res, null, 'Token refreshed successfully');
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

        res.cookie('accessToken', token, cookieOptions(24 * 60 * 60 * 1000));
        res.cookie('refreshToken', refreshToken, cookieOptions(30 * 24 * 60 * 60 * 1000));

        res.redirect(`${process.env.FRONTEND_URL}/social/success`);
    } catch (error) {
        next(error);
    }
};
