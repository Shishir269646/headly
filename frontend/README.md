# Headly Frontend - Next.js Dashboard

[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.0-purple.svg)](https://redux-toolkit.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC.svg)](https://tailwindcss.com/)

Modern, SEO-friendly frontend dashboard for Headly CMS built with Next.js 14, Redux Toolkit, and Tailwind CSS.

## 🚀 Features

- ✅ **Next.js 14** with App Router
- ✅ **ISR (Incremental Static Regeneration)** for blog posts
- ✅ **Redux Toolkit** for state management
- ✅ **Server Components** for better performance
- ✅ **Tailwind CSS** for styling
- ✅ **TypeScript Ready** (optional)
- ✅ **SEO Optimized** with metadata API
- ✅ **Authentication** with JWT
- ✅ **Protected Routes**
- ✅ **Responsive Design**
- ✅ **Dark Mode Support** (optional)

## 📋 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 14 |
| **State Management** | Redux Toolkit |
| **Styling** | Tailwind CSS |
| **HTTP Client** | Axios |
| **Form Handling** | React Hook Form (optional) |
| **Icons** | Heroicons / Lucide React |

## 📁 Project Structure
frontend/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard pages
│   ├── (public)/          # Public pages
│   └── api/               # API routes
├── components/            # React components
├── store/                 # Redux store & slices
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities
├── styles/                # Global styles
└── public/                # Static assets

## 🛠️ Installation

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/headly-frontend.git
cd headly-frontend
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Edit with your configuration
nano .env.local
```

### Step 4: Start Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📝 Environment Variables

Create `.env.local` file:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

# Revalidation Secret
REVALIDATE_SECRET=your_revalidate_secret

# App Configuration
NEXT_PUBLIC_APP_NAME=Headly CMS
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Features (optional)
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

## 🎯 Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## 🔐 Authentication Flow

### 1. Login
```javascript
import { useDispatch } from 'react-redux';
import { login } from '@/store/slices/authSlice';

const LoginPage = () => {
  const dispatch = useDispatch();

  const handleLogin = async (credentials) => {
    await dispatch(login(credentials));
    // Redirect to dashboard
  };
};
```

### 2. Protected Routes
```javascript
// app/(dashboard)/layout.js
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <div>{children}</div>
    </ProtectedRoute>
  );
}
```

## 📊 Redux Usage Examples

### Fetch Contents
```javascript
'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContents } from '@/store/slices/contentSlice';

export default function ContentList() {
  const dispatch = useDispatch();
  const { contents, loading } = useSelector((state) => state.content);

  useEffect(() => {
    dispatch(fetchContents({ status: 'published', page: 1, limit: 10 }));
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {contents.map((content) => (
        <div key={content._id}>{content.title}</div>
      ))}
    </div>
  );
}
```

### Create Content
```javascript
import { useDispatch } from 'react-redux';
import { createContent } from '@/store/slices/contentSlice';

const CreateContent = () => {
  const dispatch = useDispatch();

  const handleSubmit = async (formData) => {
    await dispatch(createContent(formData));
    // Redirect or show success message
  };
};
```

### Upload Media
```javascript
import { useDispatch } from 'react-redux';
import { uploadMedia } from '@/store/slices/mediaSlice';

const MediaUpload = () => {
  const dispatch = useDispatch();

  const handleUpload = async (file) => {
    await dispatch(uploadMedia({
      file,
      metadata: { alt: 'Image', folder: 'blog' }
    }));
  };
};
```

## 🌐 ISR Blog Implementation

### Blog List Page (ISR)
```javascript
// app/(public)/blog/page.js
export const revalidate = 60; // Revalidate every 60 seconds

export default async function BlogPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contents?status=published`, {
    next: { revalidate: 60 }
  });
  const data = await res.json();

  return (
    <div>
      {data.data.contents.map((post) => (
        <article key={post._id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

### Blog Post Page (ISR)
```javascript
// app/(public)/blog/[slug]/page.js
export const revalidate = 60;

export async function generateMetadata({ params }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contents/slug/${params.slug}`);
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
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contents/slug/${params.slug}`);
  const data = await res.json();
  const post = data.data;

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.body }} />
    </article>
  );
}
```

### Revalidation API Route
```javascript
// app/api/revalidate/route.js
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const secret = request.headers.get('x-revalidate-secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  const body = await request.json();
  const { slug } = body;

  try {
    await revalidatePath(`/blog/${slug}`);
    await revalidatePath('/blog');

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ error: 'Error revalidating' }, { status: 500 });
  }
}
```

## 🎨 Styling with Tailwind CSS

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981'
      }
    }
  },
  plugins: []
};
```

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables on Vercel

Add these in Vercel Dashboard:
- `NEXT_PUBLIC_API_URL`
- `REVALIDATE_SECRET`

## 📈 Performance Optimization

- ✅ Use Server Components by default
- ✅ Implement ISR for blog posts
- ✅ Lazy load images with `next/image`
- ✅ Code splitting with dynamic imports
- ✅ Optimize fonts with `next/font`

## 🔒 Security Best Practices

- ✅ Store tokens in httpOnly cookies (preferred) or localStorage
- ✅ Implement CSRF protection
- ✅ Sanitize user inputs
- ✅ Use environment variables for secrets
- ✅ Implement rate limiting

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License

## 👥 Authors

- Your Name - [@yourhandle](https://github.com/yourhandle)

## 🙏 Acknowledgments

- Next.js team
- Redux Toolkit team
- Tailwind CSS team

## 📞 Support

For support, email support@headly.app

## 🔗 Links

- [Documentation](https://docs.headly.app)
- [Live Demo](https://demo.headly.app)
- [Backend Repository](https://github.com/yourusername/headly-backend)