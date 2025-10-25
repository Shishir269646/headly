
const User = require('../models/User.model');
const AuditLog = require('../models/AuditLog.model');
const ApiError = require('../utils/apiError');

exports.getAllUsers = async (filters) => {
    const { role, isActive, page = 1, limit = 10, search } = filters;

    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive;
    if (search) {
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
        ];
    }

    const users = await User.find(query)
        .select('-refreshToken')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    return {
        users,
        pagination: {
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        }
    };
};

exports.getUserById = async (userId) => {
    const user = await User.findById(userId).select('-refreshToken');
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    return user;
};

exports.createUser = async (userData) => {
    const { name, email, password, role, isActive } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, 'User with this email already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
        isActive
    });

    await AuditLog.create({
        user: user._id,
        action: 'CREATE_USER',
        resource: 'user',
        resourceId: user._id
    });

    return user;
};

exports.updateUser = async (userId, updateData) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    // Don't allow password update through this method
    delete updateData.password;
    delete updateData.refreshToken;

    Object.assign(user, updateData);
    await user.save();

    await AuditLog.create({
        user: userId,
        action: 'UPDATE_USER',
        resource: 'user',
        resourceId: userId,
        details: updateData
    });

    return user;
};

exports.deleteUser = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    await user.deleteOne();

    await AuditLog.create({
        user: userId,
        action: 'DELETE_USER',
        resource: 'user',
        resourceId: userId
    });
};

exports.updateProfile = async (userId, updateData) => {
    const allowedUpdates = ['name', 'bio', 'avatar'];
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, 'User not found');
    }

    allowedUpdates.forEach(field => {
        if (updateData[field] !== undefined) {
            user[field] = updateData[field];
        }
    });

    await user.save();
    return user;
};

