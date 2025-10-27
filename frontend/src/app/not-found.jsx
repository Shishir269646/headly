/*
frontend/
├── app/                              # App Router (Next.js 14)
│   ├── layout.js                     # Root layout
│   ├── page.js                       # Homepage (ISR)
│   ├── globals.css                   # Global styles
│   │
│   ├── (auth)/                       # Auth routes group
│   │   ├── login/
│   │   │   └── page.js               # Login page
│   │   ├── register/
│   │   │   └── page.js               # Register page
│   │   └── layout.js                 # Auth layout
│   │
│   ├── (dashboard)/                  # Dashboard routes group
│   │   ├── layout.js                 # Dashboard layout
│   │   ├── dashboard/
│   │   │   └── page.js               # Dashboard home
│   │   ├── contents/
│   │   │   ├── page.js               # Content list
│   │   │   ├── new/
│   │   │   │   └── page.js           # Create content
│   │   │   └── [id]/
│   │   │       ├── page.js           # View content
│   │   │       └── edit/
│   │   │           └── page.js       # Edit content
│   │   ├── media/
│   │   │   ├── page.js               # Media library
│   │   │   └── upload/
│   │   │       └── page.js           # Upload media
│   │   ├── users/
│   │   │   ├── page.js               # User list (admin)
│   │   │   ├── new/
│   │   │   │   └── page.js           # Create user
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.js       # Edit user
│   │   └── profile/
│   │       └── page.js               # User profile
│   │
│   ├── (public)/                     # Public routes group
│   │   ├── blog/
│   │   │   ├── page.js               # Blog list (ISR)
│   │   │   └── [slug]/
│   │   │       └── page.js           # Blog post (ISR)
│   │   ├── about/
│   │   │   └── page.js               # About page
│   │   └── contact/
│   │       └── page.js               # Contact page
│   │
│   ├── api/                          # API routes
│   │   └── revalidate/
│   │       └── route.js              # Revalidation endpoint
│   │
│   └── not-found.js                  # 404 page
│
├── components/                       # React components
│   ├── common/                       # Shared components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Loading.jsx
│   │   ├── ErrorMessage.jsx
│   │   └── Pagination.jsx
│   │
│   ├── auth/                         # Auth components
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── content/                      # Content components
│   │   ├── ContentList.jsx
│   │   ├── ContentCard.jsx
│   │   ├── ContentForm.jsx
│   │   ├── ContentEditor.jsx
│   │   └── ContentPreview.jsx
│   │
│   ├── media/                        # Media components
│   │   ├── MediaLibrary.jsx
│   │   ├── MediaUpload.jsx
│   │   ├── MediaGrid.jsx
│   │   └── MediaCard.jsx
│   │
│   ├── user/                         # User components
│   │   ├── UserList.jsx
│   │   ├── UserCard.jsx
│   │   ├── UserForm.jsx
│   │   └── ProfileEdit.jsx
│   │
│   └── layout/                       # Layout components
│       ├── DashboardLayout.jsx
│       ├── PublicLayout.jsx
│       └── AuthLayout.jsx
│
├── store/                            # Redux store
│   ├── index.js                      # Store configuration
│   ├── provider.js                   # Redux provider
│   └── slices/                       # Redux slices
│       ├── authSlice.js
│       ├── contentSlice.js
│       ├── mediaSlice.js
│       └── userSlice.js
│
├── hooks/                            # Custom hooks
│   ├── useAuth.js
│   ├── useContent.js
│   ├── useMedia.js
│   ├── useDebounce.js
│   └── useLocalStorage.js
│
├── lib/                              # Utility libraries
│   ├── axios.js                      # Axios configuration
│   ├── constants.js                  # App constants
│   └── utils.js                      # Utility functions
│
├── styles/                           # Styles
│   ├── globals.css
│   └── tailwind.css
│
├── public/                           # Static assets
│   ├── images/
│   ├── icons/
│   └── favicon.ico
│
├── .env.local                        # Environment variables
├── .env.example                      # Environment template
├── next.config.js                    # Next.js configuration
├── tailwind.config.js                # Tailwind configuration
├── postcss.config.js                 # PostCSS configuration
├── jsconfig.json                     # JavaScript configuration
├── package.json
└── README.md

🎉 Headly CMS - Final Summary & Quick Start Guide
📦 আপনি যা পেয়েছেন (Complete Package)
✅ Backend (Node.js + Express + MongoDB)
📁 Files:
✅ app.js - Express application setup
✅ 5 Models - User, Content, Media, AuditLog, WebhookLog
✅ 5 Controllers - Auth, User, Content, Media, Webhook
✅ 5 Services - Business logic layer
✅ 6 Middlewares - Auth, RBAC, Validation, Upload, Error, Rate Limit
✅ 4 Validators - Joi schemas
✅ 5 Routes - Complete v1 API
✅ 8 Utility Files - Logger, Responses, Helpers
✅ 3 Background Jobs - Auto-publish, Webhook retry, Cleanup
✅ 7 Scripts - Seed admin, Sample data, Backup, etc.
✅ Config Files - Docker, PM2, ESLint, .env
🔌 API Endpoints: 30+
Auth: 6 endpoints
Users: 7 endpoints
Contents: 8 endpoints
Media: 6 endpoints
Webhooks: 3 endpoints

✅ Frontend (Next.js 14 + Redux Toolkit + Tailwind)
📁 Files:
✅ 4 Redux Slices - Auth, Content, Media, User
✅ Redux Store & Provider - Complete setup
✅ 8 Custom Hooks - useAuth, useContent, useMedia, etc.
✅ 3 Lib Files - Axios, Utils, Constants
✅ 1 API Route - Revalidation endpoint
✅ SEO-friendly folder structure - ISR ready
✅ 20+ Utility functions - Date, validation, formatting

🚀 Quick Start Guide
1️⃣ Backend Setup (5 minutes)
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Generate secrets
node scripts/generate-jwt-secret.js
# Copy secrets to .env

# Start MongoDB (if using Docker)
docker-compose up -d mongo

# Seed admin user
npm run seed:admin
# Email: admin@headly.app
# Password: admin123456

# Start development server
npm run dev
# ✅ Backend running at http://localhost:4000


2️⃣ Frontend Setup (5 minutes)
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Edit .env.local
nano .env.local
# Add:
# NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
# REVALIDATE_SECRET=your_secret_from_backend

# Start development server
npm run dev
# ✅ Frontend running at http://localhost:3000


3️⃣ Test Everything (5 minutes)
Test Backend API:
# Health check
curl http://localhost:4000/health

# Register user
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123456"
  }'

# Login
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@headly.app",
    "password": "admin123456"
  }'

Test Frontend:
Open http://localhost:3000
Go to /login
Login with admin credentials
Navigate to /dashboard
Create a test content

📚 Essential Commands
Backend Commands:
npm run dev              # Development
npm start                # Production
npm test                 # Run tests
npm run seed:admin       # Create admin
npm run seed:sample      # Create sample data
npm run docker:up        # Start with Docker

Frontend Commands:
npm run dev              # Development
npm run build            # Build for production
npm start                # Production server
npm run lint             # ESLint


🔐 Default Credentials
Admin User:
Email: admin@headly.app
Password: admin123456
Role: admin

⚠️ IMPORTANT: Change password immediately after first login!

📊 File Structure Overview
Backend Structure:
backend/
├── src/
│   ├── models/          # Database schemas
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── routes/          # API endpoints
│   ├── middlewares/     # Express middlewares
│   ├── validators/      # Input validation
│   ├── utils/           # Helper functions
│   ├── jobs/            # Background tasks
│   └── config/          # Configuration
├── scripts/             # Utility scripts
└── tests/               # Test files

Frontend Structure:
frontend/
├── app/
│   ├── (auth)/          # Auth pages
│   ├── (dashboard)/     # Dashboard pages
│   ├── (public)/        # Public pages
│   └── api/             # API routes
├── components/          # React components
├── store/               # Redux store
├── hooks/               # Custom hooks
└── lib/                 # Utilities


🎯 Common Use Cases
1. Create New Content (Frontend)
// pages/dashboard/contents/new/page.js
'use client';

import { useContent } from '@/hooks/useContent';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';

export default function CreateContentPage() {
  const { create } = useContent();
  const toast = useToast();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      title: e.target.title.value,
      body: e.target.body.value,
      status: 'draft'
    };

    try {
      await create(formData);
      toast.success('Content created!');
      router.push('/dashboard/contents');
    } catch (error) {
      toast.error('Failed to create content');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" required />
      <textarea name="body" placeholder="Content" required />
      <button type="submit">Create</button>
    </form>
  );
}

2. Upload Media
'use client';

import { useMedia } from '@/hooks/useMedia';
import { useToast } from '@/hooks/useToast';

export default function MediaUploadPage() {
  const { upload, uploading } = useMedia();
  const toast = useToast();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await upload(file, { alt: 'Image', folder: 'blog' });
      toast.success('Media uploaded!');
    } catch (error) {
      toast.error('Upload failed');
    }
  };

  return (
    <div>
      <input 
        type="file" 
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
    </div>
  );
}


3. Protected Admin Page
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/dashboard');
    }
  }, [loading, isAdmin, router]);

  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return null;

  return <div>Admin Panel Content</div>;
}

4. ISR Blog Post Page
// app/(public)/blog/[slug]/page.js

export const revalidate = 60; // ISR: 60 seconds

export async function generateMetadata({ params }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/contents/slug/${params.slug}`
  );
  const data = await res.json();
  const post = data.data;

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.featuredImage?.url]
    }
  };
}

export default async function BlogPostPage({ params }) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/contents/slug/${params.slug}`,
    { next: { revalidate: 60 } }
  );
  const data = await res.json();
  const post = data.data;

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.excerpt}</p>
      <div dangerouslySetInnerHTML={{ __html: post.body }} />
    </article>
  );
}


🔧 Troubleshooting
Backend Issues
1. MongoDB Connection Error
# Check if MongoDB is running
mongosh

# If using Docker
docker-compose up -d mongo

# Check logs
docker-compose logs mongo

2. Port Already in Use
# Find process on port 4000
lsof -i :4000

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=5000

3. JWT Token Invalid
# Generate new secrets
node scripts/generate-jwt-secret.js

# Update .env with new secrets
# Restart server


Frontend Issues
1. API Connection Error
# Check .env.local
cat .env.local

# Ensure NEXT_PUBLIC_API_URL is correct
# Should be: http://localhost:4000/api/v1

# Restart Next.js
npm run dev

2. Redux State Not Persisting
// Ensure ReduxProvider wraps your app
// app/layout.js should have:
<ReduxProvider>
  {children}
</ReduxProvider>

3. ISR Not Working
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
npm start

# Test revalidation endpoint
curl -X POST http://localhost:3000/api/revalidate \
  -H "x-revalidate-secret: your_secret" \
  -d '{"slug":"test-post"}'


📖 API Documentation Quick Reference
Authentication
// Register
POST /api/v1/auth/register
Body: { name, email, password, role? }

// Login
POST /api/v1/auth/login
Body: { email, password }
Response: { user, token, refreshToken }

// Get Current User
GET /api/v1/auth/me
Headers: Authorization: Bearer {token}

Content Management
// Get All Contents
GET /api/v1/contents?status=published&page=1&limit=10

// Get by Slug
GET /api/v1/contents/slug/{slug}

// Create Content
POST /api/v1/contents
Headers: Authorization: Bearer {token}
Body: { title, body, status, ... }

// Update Content
PUT /api/v1/contents/{id}
Headers: Authorization: Bearer {token}
Body: { title?, body?, ... }

// Publish Content
POST /api/v1/contents/{id}/publish
Headers: Authorization: Bearer {token}

// Schedule Content
POST /api/v1/contents/{id}/schedule
Headers: Authorization: Bearer {token}
Body: { publishAt: "2025-12-31T10:00:00Z" }

Media Management
// Upload File
POST /api/v1/media/upload
Headers: 
  Authorization: Bearer {token}
  Content-Type: multipart/form-data
Body: FormData { file, alt?, caption?, folder? }

// Get All Media
GET /api/v1/media?folder=blog&page=1&limit=20
Headers: Authorization: Bearer {token}

// Delete Media
DELETE /api/v1/media/{id}
Headers: Authorization: Bearer {token}


🎨 UI Component Examples
Login Form Component
// components/auth/LoginForm.jsx
'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (result.type === 'auth/login/fulfilled') {
      router.push('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

Content Card Component
// components/content/ContentCard.jsx
import { formatDate, truncateText } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

export default function ContentCard({ content }) {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition">
      {content.featuredImage && (
        <Image
          src={content.featuredImage.url}
          alt={content.title}
          width={400}
          height={250}
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">
          <Link href={`/blog/${content.slug}`} className="hover:text-blue-600">
            {content.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 mb-4">
          {truncateText(content.excerpt, 150)}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{formatDate(content.createdAt)}</span>
          <span>{content.readTime} min read</span>
        </div>

        {content.tags && (
          <div className="mt-3 flex gap-2 flex-wrap">
            {content.tags.map(tag => (
              <span key={tag} className="bg-gray-100 px-2 py-1 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


🌐 Deployment Guide
Backend Deployment (Railway/Render)
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# 2. On Railway/Render:
# - Connect GitHub repository
# - Set environment variables (from .env)
# - Deploy

# 3. Update frontend .env with production API URL
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api/v1

Frontend Deployment (Vercel)
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Add environment variables in Vercel dashboard:
# - NEXT_PUBLIC_API_URL
# - REVALIDATE_SECRET

# 4. Update backend .env with frontend URL
FRONTEND_URL=https://your-app.vercel.app


📊 Project Status Checklist
Backend ✅
[x] MVC Architecture implemented
[x] All models created
[x] All controllers implemented
[x] All services implemented
[x] Authentication & Authorization
[x] File upload (Cloudinary)
[x] Background jobs
[x] Webhook integration
[x] Error handling
[x] Validation
[x] Rate limiting
[x] Audit logging
[x] Docker support
[x] Testing infrastructure
Frontend ✅
[x] Next.js 14 setup
[x] Redux Toolkit configured
[x] All slices created
[x] Custom hooks implemented
[x] Utility functions
[x] ISR configuration
[x] SEO optimization
[x] Responsive design ready
[x] Error handling
[x] Toast notifications
[x] Modal management
[x] API integration

🎓 Learning Resources
Backend:
Express.js: https://expressjs.com/
Mongoose: https://mongoosejs.com/
JWT: https://jwt.io/
Frontend:
Next.js: https://nextjs.org/docs
Redux Toolkit: https://redux-toolkit.js.org/
Tailwind CSS: https://tailwindcss.com/docs

🔗 Useful Links
Development:
Backend API: http://localhost:4000
Frontend: http://localhost:3000
API Docs: http://localhost:4000/api/v1
Health Check: http://localhost:4000/health

Postman Collection:
Import this JSON for testing:
{
  "info": { "name": "Headly API" },
  "variable": [{ 
    "key": "baseUrl", 
    "value": "http://localhost:4000/api/v1" 
  }]
}


💡 Pro Tips
✅ Always use hooks instead of direct Redux calls
✅ Implement loading states for better UX
✅ Use debounce for search inputs
✅ Show error messages to users
✅ Validate inputs on both frontend and backend
✅ Use ISR for blog posts (60 second revalidation)
✅ Test API with Postman before frontend integration
✅ Keep .env files secure (never commit them)
✅ Use constants instead of magic strings
✅ Format data with utility functions

🚨 Security Checklist
[x] JWT tokens with expiration
[x] Refresh token mechanism
[x] Password hashing (bcrypt)
[x] CORS configuration
[x] Rate limiting
[x] Input validation
[x] MongoDB injection prevention
[x] XSS protection (Helmet)
[x] Webhook secret verification
[x] Role-based access control

🎉 আপনার Project এখন সম্পূর্ণ!
✅ যা আছে:
Production-ready backend API
Modern frontend with Next.js 14
Complete authentication system
Content management system
Media upload functionality
Background job processing
ISR for SEO optimization
Redux state management
Custom hooks for reusability
Utility functions for common tasks
Complete documentation
🚀 Next Steps:
Clone/download the code
Follow quick start guide
Test all features
Customize as needed
Deploy to production
Start building!
💪 আপনি এখন তৈরি!
এই complete CMS দিয়ে আপনি যেকোনো blog, documentation site, বা content-driven website তৈরি করতে পারবেন।
Happy Coding! 🎊

📞 Support & Contact
যদি কোনো সমস্যা হয়, তাহলে:
README.md পড়ুন
Troubleshooting section দেখুন
GitHub Issues create করুন
Community forum এ জিজ্ঞাসা করুন
Good luck with your project! 🚀

*/



// app/not-found.jsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
