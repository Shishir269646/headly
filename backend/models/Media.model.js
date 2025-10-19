
const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    thumbnailUrl: {
        type: String
    },
    cloudinaryId: {
        type: String
    },
    width: Number,
    height: Number,
    format: String,
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    alt: {
        type: String,
        default: ''
    },
    caption: {
        type: String,
        default: ''
    },
    folder: {
        type: String,
        default: 'general'
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

mediaSchema.index({ filename: 1, uploadedBy: 1 });

module.exports = mongoose.model('Media', mediaSchema);

