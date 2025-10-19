
module.exports = {
    // Server
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT || 4000,

    // Database
    MONGO_URI: process.env.MONGO_URI,

    // JWT
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,

    // URLs
    FRONTEND_URL: process.env.FRONTEND_URL,

    // Secrets
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
    REVALIDATE_SECRET: process.env.REVALIDATE_SECRET,

    // Cloudinary
    CLOUDINARY: {
        CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        API_KEY: process.env.CLOUDINARY_API_KEY,
        API_SECRET: process.env.CLOUDINARY_API_SECRET
    },

    // Redis
    REDIS_URL: process.env.REDIS_URL,

    // Email
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM,

    // Search
    ALGOLIA: {
        APP_ID: process.env.ALGOLIA_APP_ID,
        ADMIN_KEY: process.env.ALGOLIA_ADMIN_KEY,
        INDEX_NAME: process.env.ALGOLIA_INDEX_NAME
    }
};

