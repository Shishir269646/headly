
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: [
            'CREATE_CONTENT', 'UPDATE_CONTENT', 'DELETE_CONTENT', 'PUBLISH_CONTENT',
            'CREATE_USER', 'UPDATE_USER', 'DELETE_USER',
            'UPLOAD_MEDIA', 'DELETE_MEDIA',
            'LOGIN', 'LOGOUT', 'PASSWORD_CHANGE'
        ]
    },
    resource: {
        type: String,
        required: true,
        enum: ['content', 'user', 'media', 'auth']
    },
    resourceId: {
        type: mongoose.Schema.Types.ObjectId
    },
    details: {
        type: mongoose.Schema.Types.Mixed
    },
    ipAddress: String,
    userAgent: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

auditLogSchema.index({ user: 1, timestamp: -1 });
auditLogSchema.index({ resource: 1, resourceId: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);

