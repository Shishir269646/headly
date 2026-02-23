const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);

        console.log(`[DEBUG] MONGO_URI: ${process.env.MONGO_URI}`);
        console.log('[DEBUG] Attempting to connect to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('[DEBUG] MongoDB connection attempt finished.');

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log('[DEBUG] After MongoDB Connected logger.info');

        // Connection events
        mongoose.connection.on('error', (err) => {
            logger.error(`❌ MongoDB error: ${err}`);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('⚠️ MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('🔄 MongoDB reconnected');
        });

    } catch (error) {
        logger.error(`❌ MongoDB Connection Failed: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
