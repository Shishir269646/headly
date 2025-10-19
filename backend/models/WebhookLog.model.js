
const mongoose = require('mongoose');

const webhookLogSchema = new mongoose.Schema({
    contentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content',
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    },
    statusCode: Number,
    responseBody: mongoose.Schema.Types.Mixed,
    error: String,
    retryCount: {
        type: Number,
        default: 0
    },
    maxRetries: {
        type: Number,
        default: 3
    },
    nextRetryAt: Date,
    completedAt: Date
}, {
    timestamps: true
});

webhookLogSchema.index({ status: 1, nextRetryAt: 1 });

module.exports = mongoose.model('WebhookLog', webhookLogSchema);

