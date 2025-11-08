
const authService = require('../services/auth.service');
const { successResponse } = require('../utils/responses');
const ApiError = require('../utils/apiError');

exports.register = async (req, res, next) => {
    try {
        const { token, refreshToken, ...userData } = await authService.register(req.body);
        
        // Set httpOnly cookie as backup
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        
        // Return token in response body so frontend can use it in Authorization header
        successResponse(res, { ...userData, token, refreshToken }, 'User registered successfully', 201);
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { token, refreshToken, ...userData } = await authService.login(req.body, req.ip, req.headers['user-agent']);

        // Set httpOnly cookie as backup
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // Return token in response body so frontend can use it in Authorization header
        successResponse(res, { ...userData, token, refreshToken }, 'Login successful');
    } catch (error) {
        next(error);
    }
};

exports.logout = async (req, res, next) => {
    try {
        await authService.logout(req.user.id);
        res.clearCookie('token');
        successResponse(res, null, 'Logout successful');
    } catch (error) {
        next(error);
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.refreshToken(refreshToken);
        
        // Update httpOnly cookie
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        
        successResponse(res, result, 'Token refreshed successfully');
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

