













# ============================================
#.env.example - Copy this to.env
# ============================================

# ====================
# SERVER CONFIGURATION
# ====================
    NODE_ENV=development
PORT = 4000

# ====================
# DATABASE
# ====================
    MONGO_URI=mongodb://localhost:27017/headly
# For MongoDB Atlas:
# MONGO_URI = mongodb + srv://username:password@cluster.mongodb.net/headly?retryWrites=true&w=majority

# ====================
# JWT AUTHENTICATION
# ====================
    JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE = 7d
REFRESH_TOKEN_SECRET = your_refresh_token_secret_change_this_too

# ====================
# FRONTEND URL
# ====================
    FRONTEND_URL=http://localhost:3000
# For production:
# FRONTEND_URL = https://your-frontend.vercel.app

# ====================
# WEBHOOK & REVALIDATION
# ====================
    WEBHOOK_SECRET=webhook_secret_key_change_this
REVALIDATE_SECRET = revalidate_secret_key_change_this

# ====================
# CLOUDINARY(Media Storage)
# ====================
    CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY = your_api_key
CLOUDINARY_API_SECRET = your_api_secret
CLOUDINARY_URL = cloudinary://api_key:api_secret@cloud_name

# ====================
# REDIS(For Background Jobs)
# ====================
    REDIS_URL=redis://localhost:6379
# For production / cloud:
# REDIS_URL = redis://username:password@host:port

# ====================
# EMAIL SERVICE(SendGrid)
# ====================
    SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM = noreply@headly.app
EMAIL_FROM_NAME = Headly CMS

# ====================
# SEARCH(Algolia - Optional)
# ====================
    ALGOLIA_APP_ID=your_algolia_app_id
ALGOLIA_ADMIN_KEY = your_algolia_admin_key
ALGOLIA_INDEX_NAME = headly_contents

# ====================
# ANALYTICS(Optional)
# ====================
    GOOGLE_ANALYTICS_ID=UA - XXXXXXXXX - X

# ====================
# LOGGING
# ====================
    LOG_LEVEL=info
# Options: error, warn, info, http, verbose, debug, silly

# ====================
# RATE LIMITING
# ====================
    RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS = 100

# ====================
# CORS ALLOWED ORIGINS(comma separated)
# ====================
    CORS_ORIGINS=http://localhost:3000,https://your-frontend.com

# ====================
# FILE UPLOAD
# ====================
    MAX_FILE_SIZE=52428800
# 50MB in bytes

# ====================
# SESSION / COOKIE
# ====================
    COOKIE_SECRET=your_cookie_secret_key
COOKIE_MAX_AGE = 604800000
# 7 days in milliseconds


















// ============================================
// 📄 scripts/seed-admin.js
// ============================================

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User.model');

const seedAdmin = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Check if admin exists
        const existingAdmin = await User.findOne({ role: 'admin' });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists:', existingAdmin.email);
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@headly.app',
            password: 'admin123456', // Change this password immediately!
            role: 'admin',
            bio: 'System Administrator',
            isActive: true
        });

        console.log('✅ Admin user created successfully!');
        console.log('📧 Email:', admin.email);
        console.log('🔑 Password: admin123456');
        console.log('⚠️  IMPORTANT: Change this password immediately after first login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();


// ============================================
// 📄 scripts/seed-sample-data.js
// ============================================

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User.model');
const Content = require('../src/models/Content.model');

const sampleUsers = [
    {
        name: 'John Editor',
        email: 'editor@headly.app',
        password: 'editor123456',
        role: 'editor',
        bio: 'Content Editor'
    },
    {
        name: 'Jane Author',
        email: 'author@headly.app',
        password: 'author123456',
        role: 'author',
        bio: 'Content Writer'
    },
    {
        name: 'Bob Viewer',
        email: 'viewer@headly.app',
        password: 'viewer123456',
        role: 'viewer',
        bio: 'Content Viewer'
    }
];

const sampleContents = [
    {
        title: 'Getting Started with Headly CMS',
        excerpt: 'Learn how to use Headly CMS for your next project',
        body: 'Headly is a modern headless CMS built with Node.js and MongoDB...',
        status: 'published',
        categories: ['Tutorial', 'Getting Started'],
        tags: ['headless-cms', 'nodejs', 'mongodb'],
        seo: {
            metaTitle: 'Getting Started with Headly CMS',
            metaDescription: 'Complete guide to getting started with Headly CMS'
        }
    },
    {
        title: 'Building RESTful APIs with Express',
        excerpt: 'A comprehensive guide to building RESTful APIs',
        body: 'Express.js is a minimal and flexible Node.js web application framework...',
        status: 'published',
        categories: ['Development', 'Backend'],
        tags: ['express', 'rest-api', 'nodejs'],
        seo: {
            metaTitle: 'Building RESTful APIs with Express',
            metaDescription: 'Learn how to build scalable RESTful APIs with Express.js'
        }
    },
    {
        title: 'MongoDB Best Practices',
        excerpt: 'Essential MongoDB best practices for production',
        body: 'MongoDB is a popular NoSQL database. Here are some best practices...',
        status: 'draft',
        categories: ['Database', 'Best Practices'],
        tags: ['mongodb', 'database', 'nosql']
    }
];

const seedSampleData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({ role: { $ne: 'admin' } });
        await Content.deleteMany({});
        console.log('🗑️  Cleared existing sample data');

        // Create users
        const createdUsers = await User.create(sampleUsers);
        console.log(`✅ Created ${createdUsers.length} sample users`);

        // Create contents
        const authorUser = createdUsers.find(u => u.role === 'author');
        const contentsWithAuthor = sampleContents.map(content => ({
            ...content,
            author: authorUser._id
        }));

        const createdContents = await Content.create(contentsWithAuthor);
        console.log(`✅ Created ${createdContents.length} sample contents`);

        console.log('\n📋 Sample User Credentials:');
        sampleUsers.forEach(user => {
            console.log(`   ${user.role}: ${user.email} / ${user.password}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding sample data:', error.message);
        process.exit(1);
    }
};

seedSampleData();


// ============================================
// 📄 scripts/migrate-media.js
// ============================================

require('dotenv').config();
const mongoose = require('mongoose');
const Media = require('../src/models/Media.model');
const cloudinary = require('../src/config/cloudinary');

const migrateMediaToCloudinary = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Find all media without cloudinaryId
        const mediaToMigrate = await Media.find({
            cloudinaryId: { $exists: false }
        });

        console.log(`📦 Found ${mediaToMigrate.length} media files to migrate`);

        let migrated = 0;
        let failed = 0;

        for (const media of mediaToMigrate) {
            try {
                // Upload to Cloudinary
                const result = await cloudinary.uploader.upload(media.url, {
                    folder: `headly/${media.folder || 'general'}`,
                    public_id: media.filename,
                    resource_type: 'auto'
                });

                // Update media record
                media.cloudinaryId = result.public_id;
                media.url = result.secure_url;
                media.thumbnailUrl = result.secure_url;
                await media.save();

                migrated++;
                console.log(`✅ Migrated: ${media.originalName}`);
            } catch (error) {
                failed++;
                console.error(`❌ Failed to migrate ${media.originalName}:`, error.message);
            }
        }

        console.log(`\n✅ Migration completed!`);
        console.log(`   Migrated: ${migrated}`);
        console.log(`   Failed: ${failed}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration error:', error.message);
        process.exit(1);
    }
};

migrateMediaToCloudinary();


// ============================================
// 📄 scripts/backup-db.js
// ============================================

require('dotenv').config();
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const backupDatabase = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '..', 'backups');
    const backupPath = path.join(backupDir, `backup-${timestamp}`);

    // Create backups directory if it doesn't exist
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    const mongoUri = process.env.MONGO_URI;
    const dbName = mongoUri.split('/').pop().split('?')[0];

    console.log(`🔄 Starting database backup...`);
    console.log(`📦 Database: ${dbName}`);

    const command = `mongodump --uri="${mongoUri}" --out="${backupPath}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Backup failed: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`⚠️  Warning: ${stderr}`);
        }

        console.log(`✅ Backup completed successfully!`);
        console.log(`📁 Backup location: ${backupPath}`);
    });
};

backupDatabase();


// ============================================
// 📄 scripts/cleanup-old-logs.js
// ============================================

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


// ============================================
// 📄 scripts/generate-jwt-secret.js
// ============================================

const crypto = require('crypto');

const generateSecrets = () => {
    console.log('🔐 Generated Secrets for .env file:\n');

    console.log('JWT_SECRET=' + crypto.randomBytes(64).toString('hex'));
    console.log('REFRESH_TOKEN_SECRET=' + crypto.randomBytes(64).toString('hex'));
    console.log('WEBHOOK_SECRET=' + crypto.randomBytes(32).toString('hex'));
    console.log('REVALIDATE_SECRET=' + crypto.randomBytes(32).toString('hex'));
    console.log('COOKIE_SECRET=' + crypto.randomBytes(32).toString('hex'));

    console.log('\n✅ Copy these secrets to your .env file');
    console.log('⚠️  Never commit these secrets to version control!');
};

generateSecrets();


// ============================================
// 📄 pm2.ecosystem.config.js
// ============================================

module.exports = {
    apps: [
        {
            name: 'headly-backend',
            script: 'src/server.js',
            instances: 'max',
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'development',
                PORT: 4000
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 4000
            },
            error_file: 'logs/pm2-error.log',
            out_file: 'logs/pm2-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
            merge_logs: true,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            instance_var: 'INSTANCE_ID'
        }
    ]
};


// ============================================
// 📄 .gitignore
// ============================================

/*
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment variables
.env
.env.local
.env.production

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Uploads
uploads/
public/uploads/

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Testing
coverage/
.nyc_output/

# Build
dist/
build/

# PM2
.pm2/

# Backups
backups/

# Temporary files
*.tmp
tmp/
temp/
*/


// ============================================
// 📄 .editorconfig
// ============================================

/*
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
*/


// ============================================
// 📄 .eslintrc.js
// ============================================

module.exports = {
    env: {
        node: true,
        es2021: true,
        jest: true
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
        'prefer-const': 'error',
        'no-var': 'error'
    }
};


// ============================================
// 📄 .prettierrc
// ============================================

/*
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "none",
  "printWidth": 100,
  "arrowParens": "always"
}
*/


// ============================================
// 📄 docker-compose.yml
// ============================================

/*
version: '3.8'

services:
  # MongoDB
  mongo:
    image: mongo:7.0
    container_name: headly-mongo
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin123
      MONGO_INITDB_DATABASE: headly
    volumes:
      - mongo-data:/data/db
    networks:
      - headly-network

  # Redis
  redis:
    image: redis:7.2-alpine
    container_name: headly-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - headly-network

  # Backend API
  backend:
    build: .
    container_name: headly-backend
    restart: unless-stopped
    ports:
      - "4000:4000"
    env_file:
      - .env
    depends_on:
      - mongo
      - redis
    volumes:
      - ./src:/app/src
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    networks:
      - headly-network

volumes:
  mongo-data:
  redis-data:

networks:
  headly-network:
    driver: bridge
*/


// ============================================
// 📄 Dockerfile
// ============================================

/*
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Create necessary directories
RUN mkdir -p logs uploads/tmp public/uploads

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "src/server.js"]
*/


// ============================================
// 📄 README.md
// ============================================

/*
# Headly Backend - Headless CMS

A modern, scalable headless CMS built with Express.js and MongoDB following MVC architecture.

## Features

- ✅ RESTful API with versioning
- ✅ JWT Authentication & Authorization
- ✅ Role-Based Access Control (RBAC)
- ✅ Media Management (Cloudinary)
- ✅ Content Scheduling & Auto-Publishing
- ✅ Webhook Integration
- ✅ Background Job Processing
- ✅ Audit Logging
- ✅ Rate Limiting
- ✅ Comprehensive Testing

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Validation**: Joi
- **Logging**: Winston
- **Jobs**: Node-Cron
- **Testing**: Jest + Supertest

## Installation

### Prerequisites
- Node.js >= 18.x
- MongoDB >= 6.x
- Redis (for background jobs)

### Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/headly-backend.git
cd headly-backend
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Generate secrets
```bash
node scripts/generate-jwt-secret.js
```

5. Create admin user
```bash
npm run seed:admin
```

6. Start development server
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run seed:admin` - Create admin user
- `npm run docker:up` - Start with Docker

## API Documentation

Base URL: `http://localhost:4000/api/v1`

### Authentication Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout
- `GET /auth/me` - Get current user
- `PUT /auth/change-password` - Change password

### Content Endpoints
- `GET /contents` - Get all contents
- `GET /contents/:id` - Get content by ID
- `GET /contents/slug/:slug` - Get content by slug
- `POST /contents` - Create content
- `PUT /contents/:id` - Update content
- `DELETE /contents/:id` - Delete content
- `POST /contents/:id/publish` - Publish content

### Media Endpoints
- `GET /media` - Get all media
- `POST /media/upload` - Upload media
- `PUT /media/:id` - Update media
- `DELETE /media/:id` - Delete media

### User Endpoints (Admin only)
- `GET /users` - Get all users
- `POST /users` - Create user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## User Roles

- **admin**: Full system access
- **editor**: Can publish/manage all content
- **author**: Can create/edit own content
- **viewer**: Read-only access

## Environment Variables

See `.env.example` for all available configuration options.

## Deployment

### Using PM2
```bash
npm run prod:start
```

### Using Docker
```bash
npm run docker:build
npm run docker:up
```

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
*/