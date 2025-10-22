
























// ============================================
// 📄 scripts/seed-admin.js
// ============================================




// ============================================
// 📄 scripts/seed-sample-data.js
// ============================================



// ============================================
// 📄 scripts/migrate-media.js
// ============================================




// ============================================
// 📄 scripts/backup-db.js
// ============================================




// ============================================
// 📄 scripts/cleanup-old-logs.js
// ============================================


// ============================================
// 📄 scripts/generate-jwt-secret.js
// ============================================



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

