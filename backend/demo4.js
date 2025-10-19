# 🚀 Headly Backend - Frontend Integration Guide

## 📋 সম্পূর্ণ প্রজেক্ট সারসংক্ষেপ

আপনার ** Headly Backend ** প্রজেক্ট এখন সম্পূর্ণভাবে তৈরি এবং ** Production - Ready ** ! 

### ✅ যা যা তৈরি হয়েছে:

1. **✅ MVC Architecture ** - Proper separation of concerns
2. **✅ All Models ** - User, Content, Media, AuditLog, WebhookLog
3. **✅ All Controllers ** - Auth, User, Content, Media, Webhook
4. **✅ All Services ** - Business logic layer
5. **✅ All Middlewares ** - Auth, RBAC, Validation, Upload, Error Handling
6. **✅ All Routes ** - v1 API endpoints
7. **✅ Validators ** - Joi schemas for all endpoints
8. **✅ Utility Files ** - Logger, Responses, Error handling
9. **✅ Background Jobs ** - Auto - publish, Webhook retry
10. **✅ Scripts ** - Seed admin, Sample data, Backup
11. **✅ Configuration Files ** - Docker, PM2, ESLint, Prettier

---

## 🔗 Frontend এর জন্য API URLs(Complete List)

### Base URL
    ```
Development: http://localhost:4000/api/v1
Production: https://your-backend.com/api/v1
```

---

## 📱 Frontend Implementation Examples

### 1️⃣ ** Authentication Setup(React / Next.js) **

    ```javascript
// lib/api.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${ token } `;
  }
  return config;
});

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post(`${ API_BASE_URL } /auth/refresh - token`, {
          refreshToken
        });
        
        localStorage.setItem('accessToken', data.data.token);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        
        originalRequest.headers.Authorization = `Bearer ${ data.data.token } `;
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

---

### 2️⃣ ** Authentication Functions **

    ```javascript
// services/auth.service.js
import api from '@/lib/api';

export const authService = {
  // Register
  async register(userData) {
    const { data } = await api.post('/auth/register', userData);
    this.setAuthData(data.data);
    return data;
  },

  // Login
  async login(credentials) {
    const { data } = await api.post('/auth/login', credentials);
    this.setAuthData(data.data);
    return data;
  },

  // Logout
  async logout() {
    await api.post('/auth/logout');
    this.clearAuthData();
  },

  // Get current user
  async getCurrentUser() {
    const { data } = await api.get('/auth/me');
    return data.data;
  },

  // Change password
  async changePassword(passwords) {
    const { data } = await api.put('/auth/change-password', passwords);
    return data;
  },

  // Helper methods
  setAuthData({ token, refreshToken, user }) {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  },

  clearAuthData() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  },

  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};
```

---

### 3️⃣ ** Content Management Functions **

    ```javascript
// services/content.service.js
import api from '@/lib/api';

export const contentService = {
  // Get all contents with filters
  async getAllContents(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    const { data } = await api.get(`/ contents ? ${ params } `);
    return data;
  },

  // Get content by slug (for public pages)
  async getContentBySlug(slug) {
    const { data } = await api.get(`/ contents / slug / ${ slug } `);
    return data.data;
  },

  // Get content by ID
  async getContentById(id) {
    const { data } = await api.get(`/ contents / ${ id } `);
    return data.data;
  },

  // Create content
  async createContent(contentData) {
    const { data } = await api.post('/contents', contentData);
    return data.data;
  },

  // Update content
  async updateContent(id, contentData) {
    const { data } = await api.put(`/ contents / ${ id } `, contentData);
    return data.data;
  },

  // Delete content
  async deleteContent(id) {
    const { data } = await api.delete(`/ contents / ${ id } `);
    return data;
  },

  // Publish content
  async publishContent(id) {
    const { data } = await api.post(`/ contents / ${ id }/publish`);
return data.data;
  },

  // Schedule content
  async scheduleContent(id, publishAt) {
    const { data } = await api.post(`/contents/${id}/schedule`, { publishAt });
    return data.data;
}
};
```

---

### 4️⃣ **Media Upload Functions**

```javascript
// services/media.service.js
import api from '@/lib/api';

export const mediaService = {
    // Get all media
    async getAllMedia(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        const { data } = await api.get(`/media?${params}`);
        return data;
    },

    // Upload single file
    async uploadFile(file, metadata = {}) {
        const formData = new FormData();
        formData.append('file', file);

        Object.keys(metadata).forEach(key => {
            formData.append(key, metadata[key]);
        });

        const { data } = await api.post('/media/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return data.data;
    },

    // Upload multiple files
    async uploadMultipleFiles(files) {
        const formData = new FormData();

        files.forEach(file => {
            formData.append('files', file);
        });

        const { data } = await api.post('/media/upload-multiple', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return data.data;
    },

    // Update media metadata
    async updateMedia(id, metadata) {
        const { data } = await api.put(`/media/${id}`, metadata);
        return data.data;
    },

    // Delete media
    async deleteMedia(id) {
        const { data } = await api.delete(`/media/${id}`);
        return data;
    }
};
```

---

### 5️⃣ **User Management Functions (Admin)**

```javascript
// services/user.service.js
import api from '@/lib/api';

export const userService = {
    // Get all users
    async getAllUsers(filters = {}) {
        const params = new URLSearchParams(filters).toString();
        const { data } = await api.get(`/users?${params}`);
        return data;
    },

    // Get user by ID
    async getUserById(id) {
        const { data } = await api.get(`/users/${id}`);
        return data.data;
    },

    // Create user
    async createUser(userData) {
        const { data } = await api.post('/users', userData);
        return data.data;
    },

    // Update user
    async updateUser(id, userData) {
        const { data } = await api.put(`/users/${id}`, userData);
        return data.data;
    },

    // Delete user
    async deleteUser(id) {
        const { data } = await api.delete(`/users/${id}`);
        return data;
    },

    // Update own profile
    async updateProfile(profileData) {
        const { data } = await api.put('/users/profile/me', profileData);
        return data.data;
    }
};
```

---

### 6️⃣ **React Components Examples**

#### Login Component
```jsx
// components/LoginForm.jsx
import { useState } from 'react';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/router';

export default function LoginForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await authService.login(formData);
            router.push('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
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
                    className="w-full px-3 py-2 border rounded"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
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
    );
}
```

#### Content List Component
```jsx
// components/ContentList.jsx
import { useState, useEffect } from 'react';
import { contentService } from '@/services/content.service';
import Link from 'next/link';

export default function ContentList() {
    const [contents, setContents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        status: 'published'
    });

    useEffect(() => {
        loadContents();
    }, [filters]);

    const loadContents = async () => {
        setLoading(true);
        try {
            const data = await contentService.getAllContents(filters);
            setContents(data.data.contents);
            setPagination(data.data.pagination);
        } catch (error) {
            console.error('Failed to load contents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;

        try {
            await contentService.deleteContent(id);
            loadContents();
        } catch (error) {
            alert('Failed to delete content');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold">Contents</h2>
                <Link href="/contents/new" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Create New
                </Link>
            </div>

            <div className="space-y-4">
                {contents.map((content) => (
                    <div key={content._id} className="border p-4 rounded">
                        <h3 className="text-xl font-semibold">{content.title}</h3>
                        <p className="text-gray-600 text-sm">
                            By {content.author.name} • {new Date(content.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex gap-2 mt-2">
                            <span className={`px-2 py-1 rounded text-xs ${content.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                                }`}>
                                {content.status}
                            </span>
                        </div>
                        <div className="flex gap-2 mt-4">
                            <Link href={`/contents/edit/${content._id}`} className="text-blue-600">
                                Edit
                            </Link>
                            <button onClick={() => handleDelete(content._id)} className="text-red-600">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => setFilters({ ...filters, page })}
                        className={`px-3 py-1 rounded ${page === filters.page ? 'bg-blue-600 text-white' : 'bg-gray-200'
                            }`}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
}
```

#### File Upload Component
```jsx
// components/FileUpload.jsx
import { useState } from 'react';
import { mediaService } from '@/services/media.service';

export default function FileUpload({ onUploadComplete }) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const file = e.target.file.files[0];

        if (!file) return;

        setUploading(true);
        try {
            const media = await mediaService.uploadFile(file, {
                alt: e.target.alt.value,
                caption: e.target.caption.value,
                folder: 'general'
            });

            onUploadComplete(media);
            setPreview(null);
            e.target.reset();
        } catch (error) {
            alert('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <form onSubmit={handleUpload} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-2">Choose File</label>
                <input
                    type="file"
                    name="file"
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="block w-full"
                    required
                />
            </div>

            {preview && (
                <div>
                    <img src={preview} alt="Preview" className="max-w-xs rounded" />
                </div>
            )}

            <div>
                <label className="block text-sm font-medium mb-1">Alt Text</label>
                <input
                    type="text"
                    name="alt"
                    className="w-full px-3 py-2 border rounded"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Caption</label>
                <input
                    type="text"
                    name="caption"
                    className="w-full px-3 py-2 border rounded"
                />
            </div>

            <button
                type="submit"
                disabled={uploading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
        </form>
    );
}
```

---

### 7️⃣ **Next.js API Route (Revalidation)**

```javascript
// pages/api/revalidate.js
export default async function handler(req, res) {
    // Check secret
    if (req.headers['x-revalidate-secret'] !== process.env.REVALIDATE_SECRET) {
        return res.status(401).json({ error: 'Invalid secret' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { slug, action } = req.body;

        // Revalidate the content page
        await res.revalidate(`/blog/${slug}`);

        // Also revalidate the blog index page
        await res.revalidate('/blog');

        console.log(`✅ Revalidated: /blog/${slug} (${action})`);

        return res.json({
            revalidated: true,
            message: `Revalidated /blog/${slug}`,
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error('Revalidation error:', err);
        return res.status(500).json({
            error: 'Error revalidating',
            details: err.message
        });
    }
}
```

---

### 8️⃣ **Context Provider for Auth**

```jsx
// context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/services/auth.service';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            if (authService.isAuthenticated()) {
                const userData = await authService.getCurrentUser();
                setUser(userData);
            }
        } catch (error) {
            console.error('Failed to load user:', error);
            authService.clearAuthData();
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        const data = await authService.login(credentials);
        setUser(data.user);
        return data;
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isEditor: ['admin', 'editor'].includes(user?.role)
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
```

---

### 9️⃣ **Protected Route Component**

```jsx
// components/ProtectedRoute.jsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ children, requiredRole }) {
    const { user, loading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }

        if (!loading && requiredRole && user?.role !== requiredRole) {
            router.push('/unauthorized');
        }
    }, [loading, isAuthenticated, user, requiredRole]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return null;
    }

    if (requiredRole && user?.role !== requiredRole) {
        return null;
    }

    return <>{children}</>;
}
```

---

## 📊 API Response Format Examples

### Success Response
```json
{
    "success": true,
        "message": "Content retrieved successfully",
            "data": {
        "_id": "65f...",
            "title": "My Blog Post",
                "slug": "my-blog-post-1234567890",
                    "body": "Content here...",
                        "status": "published",
                            "author": {
            "_id": "65e...",
                "name": "John Doe",
                    "email": "john@example.com"
        }
    }
}
```

### Error Response
```json
{
    "success": false,
        "message": "Validation error",
            "errors": [
                {
                    "field": "email",
                    "message": "Email is required"
                }
            ]
}
```

### Paginated Response
```json
{
    "success": true,
        "message": "Contents retrieved successfully",
            "data": {
        "contents": [...],
            "pagination": {
            "total": 100,
                "page": 1,
                    "pages": 10
        }
    }
}
```

---

## 🔒 Role-Based Access Summary

| Endpoint | Public | Viewer | Author | Editor | Admin |
|----------|--------|--------|--------|--------|-------|
| **Auth** |
| Register | ✅ | ✅ | ✅ | ✅ | ✅ |
| Login | ✅ | ✅ | ✅ | ✅ | ✅ |
| Get Me | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Content** |
| View Published | ✅ | ✅ | ✅ | ✅ | ✅ |
| Create | ❌ | ❌ | ✅ | ✅ | ✅ |
| Edit Own | ❌ | ❌ | ✅ | ✅ | ✅ |
| Edit All | ❌ | ❌ | ❌ | ✅ | ✅ |
| Publish | ❌ | ❌ | ❌ | ✅ | ✅ |
| Delete | ❌ | ❌ | ✅ (own) | ✅ | ✅ |
| **Media** |
| View | ❌ | ❌ | ✅ | ✅ | ✅ |
| Upload | ❌ | ❌ | ✅ | ✅ | ✅ |
| Delete | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Users** |
| Manage | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 🚀 Deployment Checklist

### Backend Deployment:

1. **Environment Variables Setup**
   - ✅ Set all production environment variables
   - ✅ Generate secure JWT secrets
   - ✅ Configure MongoDB connection string
   - ✅ Set Cloudinary credentials
   - ✅ Configure CORS origins

2. **Database Setup**
   - ✅ Create production MongoDB database
   - ✅ Run seed admin script
   - ✅ Set up database backups

3. **Deploy to Platform**
   - Heroku: `git push heroku main`
   - Railway: Connect GitHub repo
   - Render: Connect GitHub repo
   - DigitalOcean: Use Docker or PM2

4. **Post-Deployment**
   - ✅ Test all API endpoints
   - ✅ Verify webhook integration
   - ✅ Check background jobs
   - ✅ Monitor logs

### Frontend Integration:

1. **Environment Variables**
   ```env
NEXT_PUBLIC_API_URL = https://your-backend.com/api/v1
REVALIDATE_SECRET = your_revalidate_secret
    ```

2. **Update API Base URL** in frontend code

3. **Test Authentication Flow**

4. **Test Content CRUD Operations**

5. **Test Media Upload**

---

## 📞 API Endpoint Quick Reference

```
🔐 AUTH
POST / api / v1 / auth / register
POST / api / v1 / auth / login
POST / api / v1 / auth / logout
POST / api / v1 / auth / refresh - token
GET / api / v1 / auth / me
PUT / api / v1 / auth / change - password

👥 USERS
GET / api / v1 / users
GET / api / v1 / users /: id
POST / api / v1 / users
PUT / api / v1 / users /: id
DELETE / api / v1 / users /: id
PUT / api / v1 / users / profile / me

📝 CONTENTS
GET / api / v1 / contents
GET / api / v1 / contents /: id
GET / api / v1 / contents / slug /: slug
POST / api / v1 / contents
PUT / api / v1 / contents /: id
DELETE / api / v1 / contents /: id
POST / api / v1 / contents /: id / publish
POST / api / v1 / contents /: id / schedule

🖼️ MEDIA
GET / api / v1 / media
GET / api / v1 / media /: id
POST / api / v1 / media / upload
POST / api / v1 / media / upload - multiple
PUT / api / v1 / media /: id
DELETE / api / v1 / media /: id

🔗 WEBHOOKS
POST / api / v1 / webhooks / revalidate
GET / api / v1 / webhooks / logs
POST / api / v1 / webhooks / logs /: id / retry
    ```

---

## ✅ Final Notes

### আপনার Backend এখন সম্পূর্ণ এবং Production-Ready!

**✨ Features:**
- ✅ Proper MVC Architecture
- ✅ JWT Authentication with Refresh Tokens
- ✅ Role-Based Access Control
- ✅ File Upload with Cloudinary
- ✅ Content Scheduling
- ✅ Webhook Integration
- ✅ Background Jobs
- ✅ Audit Logging
- ✅ Rate Limiting
- ✅ Error Handling
- ✅ Docker Support
- ✅ Testing Infrastructure

**🚀 Next Steps:**
1. Install dependencies: `npm install`
2. Setup `.env` file
3. Run `npm run seed: admin`
4. Start server: `npm run dev`
5. Test with Postman or frontend
6. Deploy to production

**📚 Documentation:**
- API docs are in the code comments
- All endpoints are listed above
- Example frontend code provided
- Deployment instructions included

**🎯 Your project is ready to use!**