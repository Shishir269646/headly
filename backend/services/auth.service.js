
const User = require('../models/User.model');
const AuditLog = require('../models/AuditLog.model');
const ApiError = require('../utils/apiError');
const jwt = require('jsonwebtoken');

exports.register = async (userData) => {
    const { name, email, password, role } = userData;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, 'User with this email already exists');
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role: role || 'viewer'
    });

    // Generate tokens
    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token,
        refreshToken
    };
};

exports.login = async (credentials, ipAddress, userAgent) => {
    console.log('JWT_SECRET', process.env.JWT_SECRET);
    console.log('REFRESH_TOKEN_SECRET', process.env.REFRESH_TOKEN_SECRET);
    const { email, password } = credentials;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new ApiError(401, 'Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
        throw new ApiError(403, 'Your account has been deactivated');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid email or password');
    }

    // Generate tokens
    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    // Update user
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    // Create audit log
    await AuditLog.create({
        user: user._id,
        action: 'LOGIN',
        resource: 'auth',
        ipAddress,
        userAgent
    });

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image || null
        },
        token,
        refreshToken
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
    if (!refreshToken) {
        throw new ApiError(401, 'Refresh token is required');
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findOne({ _id: decoded.id, refreshToken });

        if (!user) {
            throw new ApiError(401, 'Invalid refresh token');
        }

        const newToken = user.generateAuthToken();
        const newRefreshToken = user.generateRefreshToken();

        user.refreshToken = newRefreshToken;
        await user.save();

        return {
            token: newToken,
            refreshToken: newRefreshToken
        };
    } catch (error) {
        throw new ApiError(401, 'Invalid or expired refresh token');
    }
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
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
        throw new ApiError(401, 'Current password is incorrect');
    }

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
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    const token = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    return { token, refreshToken };
};

