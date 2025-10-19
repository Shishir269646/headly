require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
    console.log(`My server is Running Now http://localhost:${PORT}`);
})






// ============================================
// ============================================
// 📄 src/server.js (Entry Point)
// ============================================

require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const logger = require('./utils/logger');
const jobScheduler = require('./jobs');

const PORT = process.env.PORT || 4000;

// Connect to database
connectDB();

// Start server
const server = app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    logger.info(`📡 API URL: http://localhost:${PORT}/api/v1`);

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
