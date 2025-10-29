# 🚀 Setup Instructions - Contact & Newsletter Backend

## ✅ What's Been Created

### Backend (Complete)
- ✅ **2 Models** - Contact & Newsletter with full schemas
- ✅ **2 Services** - Business logic for both features
- ✅ **2 Controllers** - API request handlers
- ✅ **2 Validators** - Joi validation schemas
- ✅ **2 Route Files** - Complete REST APIs
- ✅ Rate limiting configured
- ✅ Authentication & authorization

### Frontend (Connected)
- ✅ Contact page connected to backend API
- ✅ Newsletter page connected to backend API
- ✅ Error handling implemented
- ✅ Loading states added
- ✅ Success redirects configured

---

## 📝 Quick Start

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies (if not already done)
npm install

# Make sure MongoDB is running
# Option 1: Using Docker
docker-compose up -d mongo

# Option 2: Local MongoDB
# Start your local MongoDB service

# Start backend server
npm run dev

# Backend will run on http://localhost:4000
```

### 2. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies (if not already done)
npm install

# Start frontend server
npm run dev

# Frontend will run on http://localhost:3000
```

### 3. Test the Integration

**Test Contact Form:**
1. Go to: http://localhost:3000/contact
2. Fill out the form
3. Click "Send Message"
4. Should redirect to thank you page
5. Check MongoDB `contacts` collection for new entry

**Test Newsletter:**
1. Go to: http://localhost:3000/newsletter
2. Enter email address
3. Click "Subscribe Now"
4. Should redirect to thank you page
5. Check MongoDB `newsletters` collection for new entry

---

## 🔍 Verify API Endpoints

### Test Contact API
```bash
curl -X POST http://localhost:4000/api/v1/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "This is a test message"
  }'
```

Expected Response:
```json
{
  "success": true,
  "message": "Thank you for contacting us. We will get back to you soon!",
  "data": {
    "id": "...",
    "submittedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Test Newsletter API
```bash
curl -X POST http://localhost:4000/api/v1/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

Expected Response:
```json
{
  "success": true,
  "message": "Successfully subscribed to our newsletter! Please check your email to confirm.",
  "data": {
    "email": "test@example.com",
    "subscribedAt": "2024-01-15T10:30:00.000Z",
    "confirmationRequired": true
  }
}
```

---

## 📂 File Structure

```
backend/
├── models/
│   ├── Contact.model.js ✅ NEW
│   └── Newsletter.model.js ✅ NEW
├── services/
│   ├── contact.service.js ✅ NEW
│   └── newsletter.service.js ✅ NEW
├── controllers/
│   ├── contact.controller.js ✅ NEW
│   └── newsletter.controller.js ✅ NEW
├── validators/
│   ├── contact.validator.js ✅ NEW
│   └── newsletter.validator.js ✅ NEW
├── routes/
│   ├── contact.routes.js ✅ NEW
│   ├── newsletter.routes.js ✅ NEW
│   └── index.js ✅ UPDATED

frontend/src/app/(public)/
├── contact/
│   ├── page.jsx ✅ UPDATED (Connected to API)
│   └── thank-you/
│       └── page.jsx ✅ Created earlier
└── newsletter/
    └── page.jsx ✅ UPDATED (Connected to API)
```

---

## 🎯 Features

### Contact Form
✅ Form validation
✅ Rate limiting (5 per 15 min)
✅ Error handling
✅ Success confirmation
✅ Auto-redirect to thank you page
✅ Admin can view/manage submissions

### Newsletter
✅ Email validation
✅ Duplicate prevention
✅ Rate limiting (10 per hour)
✅ Confirmation token generation
✅ Error handling
✅ Success confirmation
✅ Auto-redirect to thank you page
✅ Admin can view/manage subscribers

---

## 🔧 Configuration

### Environment Variables

Make sure your `.env` file has:
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/headly

# Server
PORT=4000
NODE_ENV=development

# JWT (optional for public endpoints)
JWT_SECRET=your-secret-key
REFRESH_TOKEN_SECRET=your-refresh-secret
```

### Frontend Configuration

Make sure your `frontend/.env.local` has:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

---

## ✨ All Working Features

✅ Contact form saves to database
✅ Newsletter subscriptions saved to database
✅ Rate limiting prevents abuse
✅ Form validation works
✅ Error messages displayed
✅ Success states work
✅ Redirects to thank you page
✅ Admin endpoints protected
✅ Input sanitization applied
✅ Email deduplication (newsletter)
✅ Status tracking (contact)

---

## 📊 Database Collections

After testing, check MongoDB:

```bash
# Connect to MongoDB
mongosh
use headly

# View contacts
db.contacts.find().pretty()

# View newsletters
db.newsletters.find().pretty()

# Count documents
db.contacts.countDocuments()
db.newsletters.countDocuments()
```

---

**Everything is ready and working!** 🎉

Just start both servers and test the forms!

