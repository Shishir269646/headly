
const userService = require('../services/user.service');
const { successResponse } = require('../utils/responses');

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers(req.query);
        successResponse(res, users, 'Users retrieved successfully');
    } catch (error) {
        next(error);
    }
};


exports.getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        successResponse(res, user, 'User retrieved successfully');
    } catch (error) {
        next(error);
    }
};

exports.createUser = async (req, res, next) => {
    try {
        const user = await userService.createUser(req.body);
        successResponse(res, user, 'User created successfully', 201);
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const user = await userService.updateUser(req.params.id, req.body);
        successResponse(res, user, 'User updated successfully');
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.id);
        successResponse(res, null, 'User deleted successfully');
    } catch (error) {
        next(error);
    }
};

exports.getProfile = async (req, res, next) => {
    try {
        const user = await userService.getProfile(req.user.id);
        successResponse(res, user, 'Profile retrieved successfully');
    } catch (error) {
        next(error);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const user = await userService.updateProfile(req.user.id, req.body);
        successResponse(res, user, 'Profile updated successfully');
    } catch (error) {
        next(error);
    }
};

exports.updateAvatar = async (req, res, next) => {
    try {
        const user = await userService.updateAvatar(req.user.id, req.file);
        successResponse(res, user, 'Avatar updated successfully');
    } catch (error) {
        next(error);
    }
};

exports.deleteProfile = async (req, res, next) => {
    try {
        await userService.deleteProfile(req.user.id);
        successResponse(res, null, 'Profile deleted successfully');
    } catch (error) {
        next(error);
    }
};

