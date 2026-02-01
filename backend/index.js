require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const logger = require('./utils/logger');
const jobScheduler = require('./jobs');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 4000;

(async () => {
    await connectDB();

    const server = app.listen(PORT, () => {
        logger.info(`🚀 Server running on port ${PORT}`);
        logger.info(`📡 API: http://localhost:${PORT}/api`);

        if (process.env.NODE_ENV === 'production') {
            jobScheduler.start();
            logger.info('⏰ Background jobs started');
        }
    });

    /* ===============================
       Graceful Shutdowns
    ================================ */
    process.on('unhandledRejection', (err) => {
        logger.error(`Unhandled Rejection: ${err.message}`);
        server.close(() => process.exit(1));
    });

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

    async function shutdown() {
        logger.info('🛑 Shutting down...');
        await mongoose.connection.close();
        server.close(() => {
            logger.info('✅ Server & MongoDB closed');
            process.exit(0);
        });
    }
})();
