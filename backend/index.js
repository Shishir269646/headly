require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const seedAdmin = require('./scripts/seed-admin');
//const seedSampleData = require('./scripts/seed-sample-data');
const logger = require('./utils/logger');
const jobScheduler = require('./jobs');

const PORT = process.env.PORT || 4000;




// Start server
const server = app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    logger.info(`📡 API URL: http://localhost:${PORT}/api`);
    // Seed admin user if not exists
    //seedAdmin();
    // Seed sample data in development mode
    /* if (process.env.NODE_ENV === 'development') {
        seedSampleData();
    }
    */
    connectDB();

    // Start background jobs
    if (process.env.NODE_ENV === 'production') {
        jobScheduler.start();
        logger.info('⏰ Background jobs started');
    }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});

// Handle SIGTERM
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
        logger.info('Process terminated');
    });
});

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    server.close(() => {
        logger.info('Process terminated');
    });
});




