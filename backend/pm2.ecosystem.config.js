module.exports = {
  apps: [
    {
      name: 'headly-backend',
      script: 'index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        MONGO_URI: 'YOUR_PRODUCTION_MONGO_URI_HERE', // IMPORTANT: Replace with your actual production MongoDB URI
      },
    },
  ],
};