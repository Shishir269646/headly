const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content',
        required: [true, 'Content ID is required'],
        index: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null // null for guest comments
    },
    // Guest comment fields (when author is null)
    guestName: {
        type: String,
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    guestEmail: {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: [255, 'Email cannot exceed 255 characters']
    },
    guestWebsite: {
        type: String,
        trim: true,
        maxlength: [255, 'Website URL cannot exceed 255 characters']
    },
    // Comment content
    body: {
        type: String,
        required: [true, 'Comment body is required'],
        trim: true,
        maxlength: [5000, 'Comment cannot exceed 5000 characters']
    },
    // Parent comment for nested replies
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null
    },
    // Status: pending, approved, spam, trash
    status: {
        type: String,
        enum: ['pending', 'approved', 'spam', 'trash'],
        default: 'pending',
        index: true
    },
    // IP address for moderation
    ipAddress: {
        type: String,
        default: null
    },
    // User agent for moderation
    userAgent: {
        type: String,
        default: null
    },
    // Moderation metadata
    isEdited: {
        type: Boolean,
        default: false
    },
    editedAt: {
        type: Date,
        default: null
    },
    // Likes/upvotes count
    likes: {
        type: Number,
        default: 0
    },
    // Users who liked this comment
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    // Soft delete
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes for performance
commentSchema.index({ content: 1, status: 1, createdAt: -1 });
commentSchema.index({ parent: 1 });
commentSchema.index({ author: 1 });
commentSchema.index({ status: 1, createdAt: -1 });

// Virtual for reply count
commentSchema.virtual('replyCount', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'parent',
    count: true
});

// Query helper to exclude deleted
commentSchema.query.notDeleted = function () {
    return this.where({ isDeleted: false });
};

// Query helper for approved comments only
commentSchema.query.approved = function () {
    return this.where({ status: 'approved', isDeleted: false });
};

// Method to check if comment is a reply
commentSchema.methods.isReply = function () {
    return this.parent !== null;
};

// Method to soft delete
commentSchema.methods.softDelete = function () {
    this.isDeleted = true;
    return this.save();
};

// Ensure guest fields are present when author is null
commentSchema.pre('validate', function (next) {
    if (!this.author) {
        if (!this.guestName || !this.guestEmail) {
            return next(new Error('Guest name and email are required when author is not provided'));
        }
    }
    next();
});

module.exports = mongoose.model('Comment', commentSchema);

