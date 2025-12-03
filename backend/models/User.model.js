const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true, // ✅ unique index
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // allows multiple null values
    },
    githubId: {
        type: String,
        unique: true,
        sparse: true
    },
    linkedinId: {
        type: String,
        unique: true,
        sparse: true
    },
    role: {
        type: String,
        enum: ['admin', 'editor', 'author', 'viewer', 'user'],
        default: 'viewer'
    },
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media',
        default: null
    },
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    refreshToken: {
        type: String,
        select: false
    }
}, {
    timestamps: true
});

// ====================
// Password Hashing
// ====================
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

// Ensure at least one login method exists
userSchema.pre('save', function (next) {
    if (!this.password && !this.googleId && !this.githubId && !this.linkedinId) {
        return next(new Error('Password is required if no OAuth login is provided.'));
    }
    next();
});

// ====================
// Instance Methods
// ====================
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '30d' }
    );
};

// ====================
// Export Model
// ====================
module.exports = mongoose.model('User', userSchema);
