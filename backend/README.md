# Headly Backend - Headless CMS

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0%2B-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A modern, production-ready Headless CMS backend built with Express.js, MongoDB, and following MVC architecture pattern.

## 🚀 Features

- ✅ **RESTful API** with versioning (v1)
- ✅ **Authentication & Authorization** - JWT-based with refresh tokens
- ✅ **Role-Based Access Control** - Admin, Editor, Author, Viewer
- ✅ **Content Management** - Create, Read, Update, Delete, Publish, Schedule
- ✅ **Media Management** - Upload to Cloudinary/S3 with metadata
- ✅ **Webhook Integration** - Frontend revalidation support
- ✅ **Background Jobs** - Auto-publish scheduled content, retry webhooks
- ✅ **Audit Logging** - Track all user actions
- ✅ **Rate Limiting** - Prevent abuse
- ✅ **Security** - Helmet, CORS, MongoDB injection prevention
- ✅ **Validation** - Joi schema validation
- ✅ **Error Handling** - Centralized error handling
- ✅ **Docker Support** - Ready for containerization
- ✅ **Testing** - Jest + Supertest infrastructure

## 📋 Tech Stack

| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express.js |
| **Database** | MongoDB with Mongoose ODM |
| **Authentication** | JWT (jsonwebtoken) |
| **Validation** | Joi |
| **File Upload** | Multer + Cloudinary |
| **Logging** | Winston |
| **Job Scheduling** | Node-Cron |
| **Security** | Helmet, CORS, express-mongo-sanitize |
| **Testing** | Jest, Supertest |
| **Process Manager** | PM2 |

## 📁 Project Structure

backend/

├── models/              # Database schemas
├── controllers/         # Request handlers
├── services/            # Business logic
├── routes/              # API endpoints
├── middlewares/         # Express middlewares
├── validators/          # Joi schemas
├── utils/               # Helper functions
├── config/              # Configuration files
├── jobs/                # Background jobs
├── integrations/        # Third-party services
├── tests/               # Test files
├── app.js               # Express app setup
└── server.js            # Entry point
├── scripts/                 # Utility scripts
├── logs/                    # Application logs
├── uploads/                 # Temporary uploads
├── public/                  # Static files
├── .env          # Environment variables template
├── package.json
├── Dockerfile
├── docker-compose.yml
└── README.md


## 🛠️ Installation

### Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 6.0
- Redis (optional, for background jobs)
- Cloudinary account (or AWS S3)

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/headly-backend.git
cd headly-backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Generate secure secrets
node scripts/generate-jwt-secret.js

# Edit .env with your configuration
nano .env
```

### Step 4: Database Setup
```bash
# Ensure MongoDB is running
# For local: mongod
# For Docker: docker-compose up -d mongo

# Seed admin user
npm run seed:admin
```

### Step 5: Start Development Server
```bash
npm run dev
```

Server will start at `http://localhost:4000`

## 📝 Environment Variables

Create a `.env` file in the root directory:
```env
# Server
NODE_ENV=development
PORT=4000

# Database
MONGO_URI=mongodb://localhost:27017/headly

# JWT
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Frontend
FRONTEND_URL=http://localhost:3000

# Webhooks
WEBHOOK_SECRET=webhook_secret
REVALIDATE_SECRET=revalidate_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (optional)
SENDGRID_API_KEY=your_sendgrid_key
EMAIL_FROM=noreply@headly.app
```

## 🎯 Available Scripts
```bash
npm run dev              # Start development server with nodemon
npm start                # Start production server
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate test coverage report
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format code with Prettier
npm run seed:admin       # Create admin user
npm run seed:sample      # Create sample data
npm run docker:build     # Build Docker image
npm run docker:up        # Start Docker containers
npm run docker:down      # Stop Docker containers
npm run prod:start       # Start with PM2
```

## 📡 API Documentation

### Base URL
Development: http://localhost:4000/api/
Production: https://your-api.com/api/

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | User login | Public |
| POST | `/auth/logout` | User logout | Protected |
| POST | `/auth/refresh-token` | Refresh access token | Public |
| GET | `/auth/me` | Get current user | Protected |
| PUT | `/auth/change-password` | Change password | Protected |

### Content Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/contents` | Get all contents | Public |
| GET | `/contents/:id` | Get content by ID | Public |
| GET | `/contents/slug/:slug` | Get content by slug | Public |
| POST | `/contents` | Create content | Author+ |
| PUT | `/contents/:id` | Update content | Author+ |
| DELETE | `/contents/:id` | Delete content | Author+ |
| POST | `/contents/:id/publish` | Publish content | Editor+ |
| POST | `/contents/:id/schedule` | Schedule content | Editor+ |

### Media Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/media` | Get all media | Protected |
| GET | `/media/:id` | Get media by ID | Protected |
| POST | `/media/upload` | Upload single file | Author+ |
| POST | `/media/upload-multiple` | Upload multiple files | Author+ |
| PUT | `/media/:id` | Update media | Author+ |
| DELETE | `/media/:id` | Delete media | Editor+ |

### User Endpoints (Admin Only)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/users` | Get all users | Admin |
| GET | `/users/:id` | Get user by ID | Admin |
| POST | `/users` | Create user | Admin |
| PUT | `/users/:id` | Update user | Admin |
| DELETE | `/users/:id` | Delete user | Admin |
| PUT | `/users/profile/me` | Update own profile | Protected |

### Webhook Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/webhooks/revalidate` | Trigger revalidation | Webhook Secret |
| GET | `/webhooks/logs` | Get webhook logs | Admin |
| POST | `/webhooks/logs/:id/retry` | Retry failed webhook | Admin |

## 🔐 User Roles & Permissions

| Role | Permissions |
|------|------------|
| **Admin** | Full system access, manage users, all content operations |
| **Editor** | Publish/schedule content, manage all content, upload media |
| **Author** | Create/edit own content, upload media |
| **Viewer** | View published content only |

## 📊 Request/Response Examples

### Register User
```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "author"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "65f...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "author"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Create Content
```bash
POST /api/v1/contents
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "My First Blog Post",
  "excerpt": "This is a short excerpt",
  "body": "Full content here...",
  "status": "draft",
  "categories": ["Tech", "Tutorial"],
  "tags": ["nodejs", "express"],
  "seo": {
    "metaTitle": "My First Blog Post",
    "metaDescription": "Learn about..."
  }
}
```

### Upload Media
```bash
POST /api/v1/media/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [binary]
alt: "Image description"
caption: "Image caption"
folder: "blog-images"
```

## 🐳 Docker Deployment

### Using Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### Using Dockerfile
```bash
# Build image
docker build -t headly-backend .

# Run container
docker run -p 4000:4000 --env-file .env headly-backend
```

## 🚀 Production Deployment

### Option 1: Using PM2
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start pm2.ecosystem.config.js --env production

# View logs
pm2 logs headly-backend

# Monitor
pm2 monit

# Stop
pm2 stop headly-backend
```

### Option 2: Heroku
```bash
# Login to Heroku
heroku login

# Create app
heroku create headly-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=mongodb+srv://...

# Deploy
git push heroku main
```

### Option 3: Railway/Render

1. Connect your GitHub repository
2. Set environment variables in dashboard
3. Deploy automatically on push

## 🧪 Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📈 Performance & Monitoring

### Rate Limiting

- General API: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes
- Upload endpoints: 50 uploads per hour

### Logging

Logs are stored in `logs/` directory:
- `error.log` - Error logs only
- `combined.log` - All logs

### Health Check
```bash
GET /health

Response:
{
  "status": "OK",
  "timestamp": "2025-10-19T10:30:00.000Z",
  "uptime": 3600,
  "environment": "production"
}
```

## 🔧 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# If using Docker
docker-compose up -d mongo
```

### Port Already in Use
```bash
# Find process using port 4000
lsof -i :4000

# Kill process
kill -9 <PID>
```

### Permission Errors
```bash
# Fix uploads directory permissions
chmod -R 755 uploads/
chmod -R 755 logs/
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Your Name - [@yourhandle](https://github.com/yourhandle)

## 🙏 Acknowledgments

- Express.js team
- Mongoose ODM
- All contributors

## 📞 Support

For support, email support@headly.app or join our Slack channel.

## 🔗 Links

- [Documentation](https://docs.headly.app)
- [Website](https://headly.app)
- [GitHub](https://github.com/yourusername/headly-backend)
- [Issues](https://github.com/yourusername/headly-backend/issues)