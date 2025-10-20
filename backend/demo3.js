
























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

