
const mongoose = require('mongoose');
const slugify = require('slugify');

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true
    },
    excerpt: {
        type: String,
        maxlength: [500, 'Excerpt cannot exceed 500 characters']
    },
    body: {
        type: String,
        required: [true, 'Content body is required']
    },
    featuredImage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Media',
        default: null
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'scheduled', 'archived'],
        default: 'draft'
    },
    publishAt: {
        type: Date,
        default: null
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    categories: [{
        type: String,
        trim: true
    }],
    tags: [{
        type: String,
        trim: true
    }],
    seo: {
        metaTitle: {
            type: String,
            maxlength: [60, 'Meta title cannot exceed 60 characters']
        },
        metaDescription: {
            type: String,
            maxlength: [160, 'Meta description cannot exceed 160 characters']
        },
        metaKeywords: [String],
        ogImage: String
    },
    readTime: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Generate slug before saving
contentSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g
        }) + '-' + Date.now();
    }

    // Calculate read time (avg 200 words per minute)
    if (this.isModified('body')) {
        const wordCount = this.body.split(/\s+/).length;
        this.readTime = Math.ceil(wordCount / 200);
    }

    next();
});

// Soft delete
contentSchema.methods.softDelete = function () {
    this.isDeleted = true;
    return this.save();
};

// Query helper to exclude deleted
contentSchema.query.notDeleted = function () {
    return this.where({ isDeleted: false });
};

contentSchema.index({ title: 'text', body: 'text', tags: 'text' });

module.exports = mongoose.model('Content', contentSchema);

