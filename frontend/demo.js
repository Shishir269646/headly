// ============================================
// 📄 app/layout.js (Root Layout)
// ============================================

import { Inter } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/store/provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Headly CMS - Modern Headless Content Management',
    description: 'A modern headless CMS built with Next.js and Node.js',
    keywords: ['CMS', 'Headless CMS', 'Next.js', 'Node.js'],
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ReduxProvider>
                    {children}
                </ReduxProvider>
            </body>
        </html>
    );
}


// ============================================
// 📄 next.config.js
// ============================================

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['res.cloudinary.com', 'localhost'],
        formats: ['image/avif', 'image/webp']
    },
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
    // Enable ISR
    experimental: {
        serverActions: true,
    }
};

module.exports = nextConfig;


// ============================================
// 📄 .env.example
// ============================================

/*
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

# Revalidation Secret (must match backend)
REVALIDATE_SECRET=your_revalidate_secret_here

# App Configuration
NEXT_PUBLIC_APP_NAME=Headly CMS
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_DARK_MODE=true
*/


// ============================================
// 📄 hooks/useAuth.js
// ============================================


// ============================================
// 📄 hooks/useMedia.js
// ============================================


// ============================================
// 📄 hooks/useUser.js
// ============================================


// ============================================
// 📄 hooks/useDebounce.js
// ============================================

// ব্যবহার উদাহরণ:
// const [searchTerm, setSearchTerm] = useState('');
// const debouncedSearch = useDebounce(searchTerm, 500);
// useEffect(() => {
//   // API call with debouncedSearch
// }, [debouncedSearch]);


// ============================================
// 📄 hooks/useLocalStorage.js
// ============================================

// ব্যবহার উদাহরণ:
// const [theme, setTheme] = useLocalStorage('theme', 'light');


// ============================================
// 📄 hooks/usePagination.js
// ============================================



// ============================================
// 📄 hooks/useToast.js
// ============================================


// ব্যবহার উদাহরণ:
// const toast = useToast();
// toast.success('Content created successfully!');
// toast.error('Failed to create content');


// ============================================
// 📄 hooks/useModal.js
// ============================================


// ব্যবহার উদাহরণ:
// const deleteModal = useModal();
// <button onClick={() => deleteModal.open(contentId)}>Delete</button>
// {deleteModal.isOpen && <Modal onClose={deleteModal.close} />}


// ============================================
// 📄 lib/axios.js
// ============================================



// ============================================
// 📄 lib/utils.js
// ============================================



// ============================================
// 📄 lib/constants.js
// ============================================


// ============================================
// 📄 app/api/revalidate/route.js
// ============================================



// ============================================
// 📄 hooks/useContent.js
// ============================================



# 📚 Headly Frontend - Complete Usage Guide(বাংলা)

## 🎯 Files এর Purpose এবং ব্যবহার

---

## 1️⃣ ** Custom Hooks ** (`hooks/` folder)

### কেন ব্যবহার করবেন ?
    Custom hooks কোড reusability বাড়ায় এবং component logic আলাদা রাখে।

---

### 📄 `hooks/useAuth.js`

    ** কেন ?** Authentication logic সব জায়গায় ব্যবহার করার জন্য

        ** কিভাবে ব্যবহার করবেন:**

            ```javascript
// যেকোনো component এ
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      {isAdmin && <button>Admin Panel</button>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

            ** Returns:**
                - `user` - Current user object
                    - `isAuthenticated` - Boolean(logged in or not)
                    - `isAdmin` - Boolean(admin role check)
                    - `isEditor` - Boolean(editor + role check)
                    - `isAuthor` - Boolean(author + role check)
                    - `logout` - Logout function

---

### 📄 `hooks/useContent.js`

    ** কেন ?** Content CRUD operations সহজভাবে করার জন্য

        ** কিভাবে ব্যবহার করবেন:**

            ```javascript
import { useContent } from '@/hooks/useContent';

export default function ContentListPage() {
  // Automatically fetches contents with filters
  const { 
    contents, 
    pagination, 
    loading, 
    create, 
    update, 
    remove 
  } = useContent({ 
    status: 'published', 
    page: 1, 
    limit: 10 
  });

  const handleCreate = async () => {
    await create({
      title: 'New Post',
      body: 'Content here...',
      status: 'draft'
    });
  };

  const handleDelete = async (id) => {
    await remove(id);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={handleCreate}>Create New</button>
      {contents.map(content => (
        <div key={content._id}>
          <h3>{content.title}</h3>
          <button onClick={() => handleDelete(content._id)}>Delete</button>
        </div>
      ))}
      <div>Page {pagination.page} of {pagination.pages}</div>
    </div>
  );
}
```

            ** Returns:**
                - `contents` - Array of content
                    - `currentContent` - Single content(when ID provided)
                        - `pagination` - Pagination info
                            - `loading` - Loading state
                                - `create()` - Create new content
                                    - `update(id, data)` - Update content
                                        - `remove(id)` - Delete content
                                            - `publish(id)` - Publish content
                                                - `schedule(id, date)` - Schedule content

---

### 📄 `hooks/useMedia.js`

    ** কেন ?** File upload এবং media management এর জন্য

        ** কিভাবে ব্যবহার করবেন:**

            ```javascript
import { useMedia } from '@/hooks/useMedia';

export default function MediaUploadPage() {
  const { 
    media, 
    uploading, 
    upload, 
    uploadMultiple, 
    remove 
  } = useMedia({ folder: 'blog-images' });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    await upload(file, { 
      alt: 'Image description',
      folder: 'blog-images'
    });
  };

  const handleMultipleUpload = async (e) => {
    const files = Array.from(e.target.files);
    await uploadMultiple(files);
  };

  return (
    <div>
      <input 
        type="file" 
        onChange={handleFileUpload}
        disabled={uploading}
      />
      <input 
        type="file" 
        multiple 
        onChange={handleMultipleUpload}
      />
      
      {uploading && <div>Uploading...</div>}
      
      <div className="grid grid-cols-4 gap-4">
        {media.map(item => (
          <div key={item._id}>
            <img src={item.url} alt={item.alt} />
            <button onClick={() => remove(item._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 📄 `hooks/useDebounce.js`

    ** কেন ?** Search input এ API calls কমানোর জন্য(performance optimization)

        ** কিভাবে ব্যবহার করবেন:**

            ```javascript
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useContent } from '@/hooks/useContent';

export default function SearchContents() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // User typing থামার 500ms পরে value update হবে
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  const { contents, loading } = useContent({ 
    search: debouncedSearch 
  });

  // প্রতিটি keystroke এ API call হবে না,
  // শুধু typing থামলে call হবে
  useEffect(() => {
    if (debouncedSearch) {
      console.log('Searching for:', debouncedSearch);
      // API call হবে এখানে
    }
  }, [debouncedSearch]);

  return (
    <div>
      <input 
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search contents..."
      />
      {loading && <p>Searching...</p>}
      {contents.map(content => (
        <div key={content._id}>{content.title}</div>
      ))}
    </div>
  );
}
```

            ** Benefits:**
                - Performance বাড়ায়
                    - Unnecessary API calls কমায়
                        - User experience ভালো হয়

---

### 📄 `hooks/useLocalStorage.js`

    ** কেন ?** Browser localStorage এ data persist করার জন্য

        ** কিভাবে ব্যবহার করবেন:**

            ```javascript
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function ThemeSelector() {
  // localStorage এ 'theme' key তে save হবে
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={theme}>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
    </div>
  );
}
```

            ** Use Cases:**
                - Theme preference save করা
                    - User preferences
                        - Draft content save করা
                            - Shopping cart data

---

### 📄 `hooks/useToast.js`

    ** কেন ?** User notification / feedback দেখানোর জন্য

        ** কিভাবে ব্যবহার করবেন:**

            ```javascript
import { useToast } from '@/hooks/useToast';

export default function ContentForm() {
  const toast = useToast();

  const handleSubmit = async (data) => {
    try {
      await createContent(data);
      toast.success('Content created successfully!');
    } catch (error) {
      toast.error('Failed to create content');
    }
  };

  const handleWarning = () => {
    toast.warning('Are you sure?');
  };

  const handleInfo = () => {
    toast.info('New feature available!');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* form fields */}
      </form>

      {/* Toast container */}
      <div className="fixed top-4 right-4 space-y-2">
        {toast.toasts.map(t => (
          <div 
            key={t.id} 
            className={`p - 4 rounded ${
    t.type === 'success' ? 'bg-green-500' :
        t.type === 'error' ? 'bg-red-500' :
            t.type === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
} text - white`}
          >
            {t.message}
            <button onClick={() => toast.removeToast(t.id)}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 📄 `hooks/use

# 📚 Headly Frontend - Complete Usage Guide (বাংলা)

## 🎯 Files এর Purpose এবং ব্যবহার

---

## 1️⃣ **Custom Hooks** (`hooks/` folder)

### কেন ব্যবহার করবেন?
Custom hooks কোড reusability বাড়ায় এবং component logic আলাদা রাখে।

---

### 📄 `hooks/useModal.js`

**কেন?** Modal/Dialog state management করার জন্য

**কিভাবে ব্যবহার করবেন:**

```javascript
import { useModal } from '@/hooks/useModal';

export default function ContentList() {
  const deleteModal = useModal();
  const editModal = useModal();

  const handleDeleteClick = (contentId) => {
    deleteModal.open(contentId); // modal open করবে এবং ID pass করবে
  };

  const handleConfirmDelete = async () => {
    await deleteContent(deleteModal.data); // data তে ID আছে
    deleteModal.close();
  };

  return (
    <div>
      {contents.map(content => (
        <div key={content._id}>
          <h3>{content.title}</h3>
          <button onClick={() => handleDeleteClick(content._id)}>
            Delete
          </button>
          <button onClick={() => editModal.open(content)}>
            Edit
          </button>
        </div>
      ))}

      {/* Delete Modal */}
      {deleteModal.isOpen && (
        <div className="modal">
          <h2>Confirm Delete</h2>
          <p>Are you sure you want to delete this content?</p>
          <button onClick={handleConfirmDelete}>Yes, Delete</button>
          <button onClick={deleteModal.close}>Cancel</button>
        </div>
      )}

      {/* Edit Modal */}
      {editModal.isOpen && (
        <div className="modal">
          <h2>Edit: {editModal.data?.title}</h2>
          {/* Edit form with editModal.data */}
          <button onClick={editModal.close}>Close</button>
        </div>
      )}
    </div>
  );
}
```

---

### 📄 `hooks/usePagination.js`

**কেন?** Client-side pagination logic এর জন্য

**কিভাবে ব্যবহার করবেন:**

```javascript
import { usePagination } from '@/hooks/usePagination';

export default function ContentTable({ allContents }) {
  const {
    currentPage,
    totalPages,
    currentItems,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage
  } = usePagination(allContents.length, 10); // 10 items per page

  // Current page এর items
  const displayedContents = allContents.slice(
    currentItems.start,
    currentItems.end
  );

  return (
    <div>
      <table>
        <tbody>
          {displayedContents.map(content => (
            <tr key={content._id}>
              <td>{content.title}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={prevPage} disabled={!hasPrevPage}>
          Previous
        </button>
        
        <span>Page {currentPage} of {totalPages}</span>
        
        <button onClick={nextPage} disabled={!hasNextPage}>
          Next
        </button>

        {/* Page numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button 
            key={page}
            onClick={() => goToPage(page)}
            className={currentPage === page ? 'active' : ''}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## 2️⃣ **Lib Files** (`lib/` folder)

### 📄 `lib/axios.js`

**কেন?** Centralized API calls এবং automatic token management

**কিভাবে ব্যবহার করবেন:**

```javascript
// ✅ সব Redux slices এ ইতিমধ্যে configured আছে
// কিন্তু custom API call এর জন্য:

import axiosInstance from '@/lib/axios';

export default function CustomAPICall() {
  const fetchCustomData = async () => {
    try {
      // Automatically adds Authorization header
      const { data } = await axiosInstance.get('/custom-endpoint');
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const postData = async (payload) => {
    const { data } = await axiosInstance.post('/endpoint', payload);
    return data;
  };

  return <button onClick={fetchCustomData}>Fetch Data</button>;
}
```

**Features:**
- ✅ Automatic token injection
- ✅ Automatic token refresh on 401
- ✅ Redirect to login on auth failure
- ✅ Centralized error handling

---

### 📄 `lib/utils.js`

**কেন?** Common utility functions সব জায়গায় ব্যবহার করার জন্য

**কিভাবে ব্যবহার করবেন:**

#### 1. **Date Formatting**

```javascript
import { formatDate, formatRelativeTime } from '@/lib/utils';

export default function BlogPost({ post }) {
  return (
    <div>
      <h1>{post.title}</h1>
      <p>Published: {formatDate(post.createdAt)}</p>
      {/* Output: "December 25, 2024" */}
      
      <p>Updated {formatRelativeTime(post.updatedAt)}</p>
      {/* Output: "2 hours ago" */}
    </div>
  );
}
```

#### 2. **Text Truncation**

```javascript
import { truncateText } from '@/lib/utils';

export default function ContentCard({ content }) {
  return (
    <div>
      <h3>{content.title}</h3>
      <p>{truncateText(content.body, 150)}</p>
      {/* Shows first 150 characters + "..." */}
    </div>
  );
}
```

#### 3. **Slug Generation**

```javascript
import { generateSlug } from '@/lib/utils';

export default function ContentForm() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
    // "My Blog Post!" → "my-blog-post"
  };

  return (
    <form>
      <input value={title} onChange={handleTitleChange} />
      <input value={slug} readOnly />
    </form>
  );
}
```

#### 4. **File Size Formatting**

```javascript
import { formatFileSize } from '@/lib/utils';

export default function MediaCard({ media }) {
  return (
    <div>
      <img src={media.url} alt={media.alt} />
      <p>Size: {formatFileSize(media.size)}</p>
      {/* 1048576 → "1 MB" */}
    </div>
  );
}
```

#### 5. **Reading Time**

```javascript
import { getReadingTime } from '@/lib/utils';

export default function BlogPost({ post }) {
  const readTime = getReadingTime(post.body);
  
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{readTime} min read</p>
      <div>{post.body}</div>
    </div>
  );
}
```

#### 6. **Email Validation**

```javascript
import { isValidEmail } from '@/lib/utils';

export default function EmailForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError('Invalid email format');
      return;
    }
    // Proceed with valid email
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      {error && <p>{error}</p>}
    </form>
  );
}
```

#### 7. **Copy to Clipboard**

```javascript
import { copyToClipboard } from '@/lib/utils';

export default function ShareButton({ url }) {
  const handleCopy = async () => {
    const success = await copyToClipboard(url);
    if (success) {
      alert('Link copied!');
    } else {
      alert('Failed to copy');
    }
  };

  return <button onClick={handleCopy}>Copy Link</button>;
}
```

#### 8. **User Initials**

```javascript
import { getInitials } from '@/lib/utils';

export default function UserAvatar({ user }) {
  return (
    <div className="avatar">
      {user.avatar ? (
        <img src={user.avatar} alt={user.name} />
      ) : (
        <div className="avatar-placeholder">
          {getInitials(user.name)}
          {/* "John Doe" → "JD" */}
        </div>
      )}
    </div>
  );
}
```

#### 9. **Permission Check**

```javascript
import { hasPermission } from '@/lib/utils';

export default function AdminPanel({ user }) {
  if (!hasPermission(user, ['admin', 'editor'])) {
    return <div>Access Denied</div>;
  }

  return <div>Admin Panel Content</div>;
}
```

#### 10. **Error Message Parsing**

```javascript
import { parseErrorMessage } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';

export default function DataForm() {
  const toast = useToast();

  const handleSubmit = async (data) => {
    try {
      await api.post('/endpoint', data);
    } catch (error) {
      // Handles various error formats
      const message = parseErrorMessage(error);
      toast.error(message);
    }
  };
}
```

---

### 📄 `lib/constants.js`

**কেন?** Application-wide constants একজায়গায় রাখার জন্য

**কিভাবে ব্যবহার করবেন:**

```javascript
import { 
  USER_ROLES, 
  CONTENT_STATUS, 
  ROUTES,
  FILE_UPLOAD 
} from '@/lib/constants';

// 1. Role-based rendering
export default function UserBadge({ user }) {
  const getBadgeColor = () => {
    switch (user.role) {
      case USER_ROLES.ADMIN:
        return 'bg-red-500';
      case USER_ROLES.EDITOR:
        return 'bg-blue-500';
      case USER_ROLES.AUTHOR:
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return <span className={getBadgeColor()}>{user.role}</span>;
}

// 2. Status filtering
export default function ContentFilter() {
  const [status, setStatus] = useState(CONTENT_STATUS.PUBLISHED);

  return (
    <select value={status} onChange={(e) => setStatus(e.target.value)}>
      <option value={CONTENT_STATUS.DRAFT}>Draft</option>
      <option value={CONTENT_STATUS.PUBLISHED}>Published</option>
      <option value={CONTENT_STATUS.SCHEDULED}>Scheduled</option>
      <option value={CONTENT_STATUS.ARCHIVED}>Archived</option>
    </select>
  );
}

// 3. Route navigation
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const router = useRouter();

  return (
    <nav>
      <button onClick={() => router.push(ROUTES.DASHBOARD)}>
        Dashboard
      </button>
      <button onClick={() => router.push(ROUTES.CONTENTS)}>
        Contents
      </button>
      <button onClick={() => router.push(ROUTES.MEDIA)}>
        Media
      </button>
    </nav>
  );
}

// 4. File validation
export default function FileUpload() {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file.size > FILE_UPLOAD.MAX_SIZE) {
      alert('File too large! Max 50MB');
      return;
    }

    if (!FILE_UPLOAD.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      alert('Invalid file type!');
      return;
    }

    // Proceed with upload
  };

  return <input type="file" onChange={handleFileChange} />;
}
```

---

## 3️⃣ **API Routes** (`app/api/` folder)

### 📄 `app/api/revalidate/route.js`

**কেন?** Backend থেকে webhook receive করে Next.js pages revalidate করার জন্য

**কিভাবে কাজ করে:**

```
1. Backend এ content publish হয় → 
2. Backend webhook call করে → 
3. Next.js revalidate endpoint hit হয় → 
4. Page ISR cache clear হয় → 
5. নতুন content দেখায়
```

**Backend Integration:**

```javascript
// Backend (Node.js) থেকে call
const triggerRevalidate = async (slug) => {
  await fetch('https://your-frontend.vercel.app/api/revalidate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-revalidate-secret': process.env.REVALIDATE_SECRET
    },
    body: JSON.stringify({ 
      slug: slug,
      action: 'publish' 
    })
  });
};
```

**Testing:**

```bash
# Postman/curl দিয়ে test করুন
curl -X POST http://localhost:3000/api/revalidate \
  -H "x-revalidate-secret: your_secret" \
  -H "Content-Type: application/json" \
  -d '{"slug":"my-blog-post","action":"publish"}'
```

---

## 4️⃣ **Complete Usage Example**

### 🎯 একটি Complete Content Management Page

```javascript
'use client';

import { useState } from 'react';
import { useContent } from '@/hooks/useContent';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useModal } from '@/hooks/useModal';
import { useDebounce } from '@/hooks/useDebounce';
import { formatDate, truncateText } from '@/lib/utils';
import { CONTENT_STATUS, USER_ROLES } from '@/lib/constants';

export default function ContentManagementPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const debouncedSearch = useDebounce(searchTerm, 500);
  const { user, isEditor } = useAuth();
  const toast = useToast();
  const deleteModal = useModal();
  
  const { 
    contents, 
    pagination, 
    loading, 
    remove, 
    publish 
  } = useContent({
    search: debouncedSearch,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    page: 1,
    limit: 10
  });

  const handleDelete = async () => {
    try {
      await remove(deleteModal.data);
      toast.success('Content deleted successfully!');
      deleteModal.close();
    } catch (error) {
      toast.error('Failed to delete content');
    }
  };

  const handlePublish = async (id) => {
    try {
      await publish(id);
      toast.success('Content published successfully!');
    } catch (error) {
      toast.error('Failed to publish content');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Content Management</h1>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search contents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded"
        />
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-4 py-2 rounded"
        >
          <option value="all">All Status</option>
          <option value={CONTENT_STATUS.DRAFT}>Draft</option>
          <option value={CONTENT_STATUS.PUBLISHED}>Published</option>
          <option value={CONTENT_STATUS.SCHEDULED}>Scheduled</option>
        </select>
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {contents.map(content => (
          <div key={content._id} className="border p-4 rounded">
            <h3 className="text-xl font-semibold">{content.title}</h3>
            <p className="text-gray-600">{truncateText(content.excerpt, 100)}</p>
            <p className="text-sm text-gray-500">
              {formatDate(content.createdAt)} • {content.readTime} min read
            </p>
            
            <div className="mt-4 flex gap-2">
              {isEditor && content.status === CONTENT_STATUS.DRAFT && (
                <button
                  onClick={() => handlePublish(content._id)}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Publish
                </button>
              )}
              
              <button
                onClick={() => deleteModal.open(content._id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6">
        Page {pagination.page} of {pagination.pages}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this content?</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={deleteModal.close}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 space-y-2">
        {toast.toasts.map(t => (
          <div
            key={t.id}
            className={`p-4 rounded text-white ${
              t.type === 'success' ? 'bg-green-500' :
              t.type === 'error' ? 'bg-red-500' :
              'bg-blue-500'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 📊 সংক্ষেপে

### ✅ Hooks কখন ব্যবহার করবেন:

| Hook | Use Case |
|------|----------|
| `useAuth` | Login status check, role-based access |
| `useContent` | Content CRUD operations |
| `useMedia` | File upload/management |
| `useDebounce` | Search input optimization |
| `useLocalStorage` | Save user preferences |
| `useToast` | Show notifications |
| `useModal` | Handle modals/dialogs |
| `usePagination` | Client-side pagination |

### ✅ Lib Files কেন দরকার:

| File | Purpose |
|------|---------|
| `axios.js` | Centralized API calls |
| `utils.js` | Reusable utility functions |
| `constants.js` | App-wide constants |

### ✅ API Routes:

| Route | Purpose |
|-------|---------|
| `/api/revalidate` | ISR page revalidation |

---

## 🎯 Best Practices:

1. ✅ **Always use hooks** - Don't write Redux logic directly in components
2. ✅ **Use debounce** for search inputs
3. ✅ **Show loading states** for better UX
4. ✅ **Use toast notifications** for user feedback
5. ✅ **Implement error handling** everywhere
6. ✅ **Use constants** instead of hardcoded values
7. ✅ **Format dates** with utility functions
8. ✅ **Validate inputs** before submission

এই files গুলো ব্যবহার করলে আপনার code clean, maintainable এবং reusable হবে! 🚀Auth.js`

**কেন?** Authentication logic সব জায়গায় ব্যবহার করার জন্য

**কিভাবে ব্যবহার করবেন:**

```javascript
// যেকোনো component এ
import { useAuth } from '@/hooks/useAuth';

export default function Dashboard() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please login</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      {isAdmin && <button>Admin Panel</button>}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

**Returns:**
- `user` - Current user object
- `isAuthenticated` - Boolean (logged in or not)
- `isAdmin` - Boolean (admin role check)
- `isEditor` - Boolean (editor+ role check)
- `isAuthor` - Boolean (author+ role check)
- `logout` - Logout function

---

### 📄 `hooks/useContent.js`

**কেন?** Content CRUD operations সহজভাবে করার জন্য

**কিভাবে ব্যবহার করবেন:**

```javascript
import { useContent } from '@/hooks/useContent';

export default function ContentListPage() {
  // Automatically fetches contents with filters
  const { 
    contents, 
    pagination, 
    loading, 
    create, 
    update, 
    remove 
  } = useContent({ 
    status: 'published', 
    page: 1, 
    limit: 10 
  });

  const handleCreate = async () => {
    await create({
      title: 'New Post',
      body: 'Content here...',
      status: 'draft'
    });
  };

  const handleDelete = async (id) => {
    await remove(id);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={handleCreate}>Create New</button>
      {contents.map(content => (
        <div key={content._id}>
          <h3>{content.title}</h3>
          <button onClick={() => handleDelete(content._id)}>Delete</button>
        </div>
      ))}
      <div>Page {pagination.page} of {pagination.pages}</div>
    </div>
  );
}
```

**Returns:**
- `contents` - Array of content
- `currentContent` - Single content (when ID provided)
- `pagination` - Pagination info
- `loading` - Loading state
- `create()` - Create new content
- `update(id, data)` - Update content
- `remove(id)` - Delete content
- `publish(id)` - Publish content
- `schedule(id, date)` - Schedule content

---

### 📄 `hooks/useMedia.js`

**কেন?** File upload এবং media management এর জন্য

**কিভাবে ব্যবহার করবেন:**

```javascript
import { useMedia } from '@/hooks/useMedia';

export default function MediaUploadPage() {
  const { 
    media, 
    uploading, 
    upload, 
    uploadMultiple, 
    remove 
  } = useMedia({ folder: 'blog-images' });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    await upload(file, { 
      alt: 'Image description',
      folder: 'blog-images'
    });
  };

  const handleMultipleUpload = async (e) => {
    const files = Array.from(e.target.files);
    await uploadMultiple(files);
  };

  return (
    <div>
      <input 
        type="file" 
        onChange={handleFileUpload}
        disabled={uploading}
      />
      <input 
        type="file" 
        multiple 
        onChange={handleMultipleUpload}
      />
      
      {uploading && <div>Uploading...</div>}
      
      <div className="grid grid-cols-4 gap-4">
        {media.map(item => (
          <div key={item._id}>
            <img src={item.url} alt={item.alt} />
            <button onClick={() => remove(item._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 📄 `hooks/useDebounce.js`

**কেন?** Search input এ API calls কমানোর জন্য (performance optimization)

**কিভাবে ব্যবহার করবেন:**

```javascript
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useContent } from '@/hooks/useContent';

export default function SearchContents() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // User typing থামার 500ms পরে value update হবে
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  const { contents, loading } = useContent({ 
    search: debouncedSearch 
  });

  // প্রতিটি keystroke এ API call হবে না,
  // শুধু typing থামলে call হবে
  useEffect(() => {
    if (debouncedSearch) {
      console.log('Searching for:', debouncedSearch);
      // API call হবে এখানে
    }
  }, [debouncedSearch]);

  return (
    <div>
      <input 
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search contents..."
      />
      {loading && <p>Searching...</p>}
      {contents.map(content => (
        <div key={content._id}>{content.title}</div>
      ))}
    </div>
  );
}
```

**Benefits:**
- Performance বাড়ায়
- Unnecessary API calls কমায়
- User experience ভালো হয়

---

### 📄 `hooks/useLocalStorage.js`

**কেন?** Browser localStorage এ data persist করার জন্য

**কিভাবে ব্যবহার করবেন:**

```javascript
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function ThemeSelector() {
  // localStorage এ 'theme' key তে save হবে
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={theme}>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
      </button>
    </div>
  );
}
```

**Use Cases:**
- Theme preference save করা
- User preferences
- Draft content save করা
- Shopping cart data

---

### 📄 `hooks/useToast.js`

**কেন?** User notification/feedback দেখানোর জন্য

**কিভাবে ব্যবহার করবেন:**

```javascript
import { useToast } from '@/hooks/useToast';

export default function ContentForm() {
  const toast = useToast();

  const handleSubmit = async (data) => {
    try {
      await createContent(data);
      toast.success('Content created successfully!');
    } catch (error) {
      toast.error('Failed to create content');
    }
  };

  const handleWarning = () => {
    toast.warning('Are you sure?');
  };

  const handleInfo = () => {
    toast.info('New feature available!');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* form fields */}
      </form>

      {/* Toast container */}
      <div className="fixed top-4 right-4 space-y-2">
        {toast.toasts.map(t => (
          <div 
            key={t.id} 
            className={`p-4 rounded ${
              t.type === 'success' ? 'bg-green-500' :
              t.type === 'error' ? 'bg-red-500' :
              t.type === 'warning' ? 'bg-yellow-500' :
              'bg-blue-500'
            } text-white`}
          >
            {t.message}
            <button onClick={() => toast.removeToast(t.id)}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### 📄 `hooks/use