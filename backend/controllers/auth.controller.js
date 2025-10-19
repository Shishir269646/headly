
const authService = require('../services/auth.service');
const { successResponse } = require('../utils/responses');
const ApiError = require('../utils/apiError');

exports.register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);
        successResponse(res, result, 'User registered successfully', 201);
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const result = await authService.login(req.body, req.ip, req.headers['user-agent']);
        successResponse(res, result, 'Login successful');
    } catch (error) {
        next(error);
    }
};

exports.logout = async (req, res, next) => {
    try {
        await authService.logout(req.user.id);
        successResponse(res, null, 'Logout successful');
    } catch (error) {
        next(error);
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const result = await authService.refreshToken(refreshToken);
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

