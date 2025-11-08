
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
            'LOGIN', 'LOGOUT', 'PASSWORD_CHANGE',
            'COMMENT_CREATE', 'COMMENT_UPDATE', 'COMMENT_DELETE',
            'COMMENT_APPROVED', 'COMMENT_PENDING', 'COMMENT_SPAM', 'COMMENT_TRASH',
            'COMMENT_BULK_APPROVED', 'COMMENT_BULK_PENDING', 'COMMENT_BULK_SPAM', 'COMMENT_BULK_TRASH'
        ]
    },
    resource: {
        type: String,
        required: true,
        enum: ['content', 'user', 'media', 'auth', 'comment']
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

