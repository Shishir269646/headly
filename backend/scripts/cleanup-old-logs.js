require('dotenv').config();
const mongoose = require('mongoose');
const AuditLog = require('../src/models/AuditLog.model');
const WebhookLog = require('../src/models/WebhookLog.model');

const cleanupOldLogs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Delete audit logs older than 90 days
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const deletedAuditLogs = await AuditLog.deleteMany({
            createdAt: { $lt: ninetyDaysAgo }
        });

        console.log(`🗑️  Deleted ${deletedAuditLogs.deletedCount} old audit logs`);

        // Delete webhook logs older than 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const deletedWebhookLogs = await WebhookLog.deleteMany({
            createdAt: { $lt: thirtyDaysAgo },
            status: 'success' // Keep failed logs for debugging
        });

        console.log(`🗑️  Deleted ${deletedWebhookLogs.deletedCount} old webhook logs`);

        console.log('✅ Cleanup completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Cleanup error:', error.message);
        process.exit(1);
    }
};

cleanupOldLogs();

