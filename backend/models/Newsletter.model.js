
const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    status: {
        type: String,
        enum: ['subscribed', 'unsubscribed', 'bounced', 'invalid'],
        default: 'subscribed'
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    },
    unsubscribedAt: {
        type: Date,
        default: null
    },
    confirmationToken: {
        type: String,
        default: null
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    confirmationExpires: {
        type: Date,
        default: null
    },
    preferences: {
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly'],
            default: 'weekly'
        },
        categories: [{
            type: String
        }]
    },
    metadata: {
        ipAddress: String,
        userAgent: String,
        source: String // Where they subscribed from (homepage, footer, etc.)
    }
}, {
    timestamps: true
});

// Indexes for faster queries
newsletterSchema.index({ email: 1 });
newsletterSchema.index({ status: 1 });
newsletterSchema.index({ confirmed: 1, status: 1 });

module.exports = mongoose.model('Newsletter', newsletterSchema);


