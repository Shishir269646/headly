const User = require('../models/User.model');
const AuditLog = require('../models/AuditLog.model');
const ApiError = require('../utils/apiError');
const jwt = require('jsonwebtoken');

exports.register = async (userData) => {
    const { name, email, password, role } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, 'User with this email already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        role: role || 'viewer'
    });

    // Generate tokens
    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    return {
        token,
        refreshToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

exports.login = async (credentials, ipAddress, userAgent) => {
    const { email, password } = credentials;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new ApiError(401, 'Invalid email or password');
    }

    if (!user.isActive) {
        throw new ApiError(403, 'Your account has been deactivated');
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid email or password');
    }

    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    await AuditLog.create({
        user: user._id,
        action: 'LOGIN',
        resource: 'auth',
        ipAddress,
        userAgent
    });

    return {
        token,
        refreshToken,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image || null
        }
    };
};

exports.logout = async (userId) => {
    const user = await User.findById(userId);
    if (user) {
        user.refreshToken = null;
        await user.save();

        await AuditLog.create({
            user: userId,
            action: 'LOGOUT',
            resource: 'auth'
        });
    }
};

exports.refreshToken = async (refreshToken) => {
    if (!refreshToken) throw new ApiError(401, 'Refresh token is required');

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch {
        throw new ApiError(401, 'Invalid or expired refresh token');
    }

    const user = await User.findOne({
        _id: decoded.id,
        refreshToken
    });

    if (!user) throw new ApiError(401, 'Invalid refresh token');

    const newToken = user.generateAuthToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save();

    return {
        token: newToken,
        refreshToken: newRefreshToken
    };
};

exports.getUserById = async (userId) => {
    const user = await User.findById(userId).populate('image');
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    return user;
};

exports.changePassword = async (userId, passwordData) => {
    const { currentPassword, newPassword } = passwordData;

    const user = await User.findById(userId).select('+password');
    if (!user) throw new ApiError(404, 'User not found');

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) throw new ApiError(401, 'Current password is incorrect');

    user.password = newPassword;
    await user.save();

    await AuditLog.create({
        user: userId,
        action: 'PASSWORD_CHANGE',
        resource: 'auth'
    });
};

exports.generateAndSaveTokens = async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');

    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    return { token, refreshToken };
};
