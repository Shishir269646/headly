// ============================================
// ============================================
// 📄 src/server.js (Entry Point)
// ============================================

require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const seedAdmin = require('./scripts/seed-admin');
const seedSampleData = require('./scripts/seed-sample-data');
const logger = require('./utils/logger');
const jobScheduler = require('./jobs');

const PORT = process.env.PORT || 4000;

// Connect to database
connectDB();

// Start server
const server = app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    logger.info(`📡 API URL: http://localhost:${PORT}/api`);
    // Seed admin user if not exists
   
    // Seed sample data in development mode
    /* if (process.env.NODE_ENV === 'development') {
        seedSampleData();
    } */
   


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





/* {
 "name": "class-01",
 "version": "1.0.0",
 "main": "index.js",
 "scripts": {
   "start": "nodemon index.js",
   "test": "echo \"Error: no test specified\" && exit 1"
 },
 "keywords": [],
 "author": "",
 "license": "ISC",
 "description": "",
 "dependencies": {
   "body-parser": "^1.20.3",
   "cors": "^2.8.5",
   "dotenv": "^16.4.7",
   "express": "^4.21.2",
   "nodemon": "^3.1.9",
   "uuidv4": "^6.2.13"
 }
}
 */