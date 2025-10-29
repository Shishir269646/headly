# Contact & Newsletter API Documentation

## 📋 Overview

Complete backend API for Contact Form and Newsletter functionality with proper validation, rate limiting, and admin management.

---

## 🗂️ Database Models

### Contact Model (`Contact.model.js`)
```javascript
{
  name: String (required, max 100 chars)
  email: String (required, valid email)
  subject: String (required, max 200 chars)
  message: String (required, max 2000 chars)
  status: String (enum: 'new', 'in-progress', 'resolved', 'archived')
  read: Boolean (default: false)
  replied: Boolean (default: false)
  adminNotes: String (optional)
  timestamps: createdAt, updatedAt
}
```

### Newsletter Model (`Newsletter.model.js`)
```javascript
{
  email: String (required, unique, valid email)
  status: String (enum: 'subscribed', 'unsubscribed', 'bounced', 'invalid')
  subscribedAt: Date
  unsubscribedAt: Date
  confirmationToken: String (generated)
  confirmed: Boolean (default: false)
  confirmationExpires: Date (24 hours)
  preferences: {
    frequency: 'daily' | 'weekly' | 'monthly'
    categories: [String]
  }
  metadata: {
    ipAddress, userAgent, source
  }
  timestamps: createdAt, updatedAt
}
```

---

## 🔌 API Endpoints

### Contact API

#### 1. Submit Contact Form (Public)
**POST** `/api/v1/contact`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "General Inquiry",
  "message": "Hello, I have a question..."
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Thank you for contacting us. We will get back to you soon!",
  "data": {
    "id": "65f...",
    "submittedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Rate Limit:** 5 submissions per 15 minutes per IP

---

#### 2. Get All Contacts (Admin Only)
**GET** `/api/v1/contact?status=new&read=false&page=1&limit=10`

**Query Parameters:**
- `status`: Filter by status (new, in-progress, resolved, archived)
- `read`: Filter by read status (true/false)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sortBy`: Sort field (default: -createdAt)

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Contacts retrieved successfully",
  "data": {
    "contacts": [...],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "pages": 10
    }
  }
}
```

---

#### 3. Get Single Contact (Admin Only)
**GET** `/api/v1/contact/:id`

**Response (200):**
```json
{
  "success": true,
  "message": "Contact retrieved successfully",
  "data": { /* contact object */ }
}
```

---

#### 4. Update Contact (Admin Only)
**PATCH** `/api/v1/contact/:id`

**Body:**
```json
{
  "status": "in-progress",
  "read": true,
  "replied": false,
  "adminNotes": "Customer inquiry about pricing"
}
```

---

#### 5. Mark as Read (Admin Only)
**PATCH** `/api/v1/contact/:id/read`

---

#### 6. Update Status (Admin Only)
**PATCH** `/api/v1/contact/:id/status`

**Body:**
```json
{
  "status": "resolved"
}
```

---

#### 7. Delete Contact (Admin Only)
**DELETE** `/api/v1/contact/:id`

---

### Newsletter API

#### 1. Subscribe (Public)
**POST** `/api/v1/newsletter/subscribe`

**Body:**
```json
{
  "email": "user@example.com",
  "preferences": {
    "frequency": "weekly",
    "categories": ["technology", "business"]
  },
  "metadata": {
    "source": "newsletter-page"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Successfully subscribed to our newsletter! Please check your email to confirm.",
  "data": {
    "email": "user@example.com",
    "subscribedAt": "2024-01-15T10:30:00.000Z",
    "confirmationRequired": true
  }
}
```

**Rate Limit:** 10 subscriptions per hour per IP

---

#### 2. Confirm Subscription (Public)
**GET** `/api/v1/newsletter/confirm/:token`

**Response (200):**
```json
{
  "success": true,
  "message": "Your subscription has been confirmed successfully!",
  "data": {
    "email": "user@example.com",
    "confirmed": true
  }
}
```

---

#### 3. Unsubscribe (Public)
**POST** `/api/v1/newsletter/unsubscribe`

**Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "You have been unsubscribed from our newsletter",
  "data": {
    "email": "user@example.com",
    "unsubscribedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

---

#### 4. Get All Subscribers (Admin Only)
**GET** `/api/v1/newsletter/subscribers?status=subscribed&confirmed=true&page=1&limit=10`

**Query Parameters:**
- `status`: Filter by status
- `confirmed`: Filter by confirmation status
- `page`, `limit`, `sortBy`: Pagination

---

#### 5. Get Single Subscriber (Admin Only)
**GET** `/api/v1/newsletter/subscribers/:id`

---

#### 6. Delete Subscriber (Admin Only)
**DELETE** `/api/v1/newsletter/subscribers/:id`

---

#### 7. Update Preferences (Public)
**PATCH** `/api/v1/newsletter/preferences/:email`

**Body:**
```json
{
  "frequency": "daily",
  "categories": ["technology"]
}
```

---

## 🔒 Security Features

✅ **Rate Limiting**
- Contact form: 5 submissions per 15 minutes
- Newsletter: 10 subscriptions per hour

✅ **Input Validation**
- Joi schema validation on all endpoints
- Email format validation
- String length limits
- Required field validation

✅ **Authentication**
- Admin routes protected with JWT
- Role-based access control (RBAC)

✅ **Data Sanitization**
- Email normalization (lowercase)
- Input trimming
- SQL injection prevention

---

## 📁 Files Created

### Backend Files:
1. ✅ `models/Contact.model.js` - Contact schema
2. ✅ `models/Newsletter.model.js` - Newsletter schema
3. ✅ `services/contact.service.js` - Business logic
4. ✅ `services/newsletter.service.js` - Business logic
5. ✅ `controllers/contact.controller.js` - Request handlers
6. ✅ `controllers/newsletter.controller.js` - Request handlers
7. ✅ `validators/contact.validator.js` - Joi schemas
8. ✅ `validators/newsletter.validator.js` - Joi schemas
9. ✅ `routes/contact.routes.js` - Route definitions
10. ✅ `routes/newsletter.routes.js` - Route definitions
11. ✅ Updated `routes/index.js` - Added new routes
12. ✅ Updated `utils/apiError.js` - Added AppError class

### Frontend Files:
1. ✅ Updated `app/(public)/contact/page.jsx` - Connected to API
2. ✅ Updated `app/(public)/newsletter/page.jsx` - Connected to API

---

## 🚀 Testing the API

### Test Contact Form:
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

### Test Newsletter:
```bash
curl -X POST http://localhost:4000/api/v1/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

### Test Admin Endpoints:
```bash
# Get contacts (requires admin token)
curl -X GET http://localhost:4000/api/v1/contact \
  -H "Authorization: Bearer <admin_token>"

# Get subscribers (requires admin token)
curl -X GET http://localhost:4000/api/v1/newsletter/subscribers \
  -H "Authorization: Bearer <admin_token>"
```

---

## 📊 Database Collections

After running the app, MongoDB will have two new collections:

1. **contacts** - All contact form submissions
2. **newsletters** - Newsletter subscriptions

---

## ✨ Features Implemented

✅ Complete CRUD operations
✅ Input validation with Joi
✅ Rate limiting
✅ Authentication & authorization
✅ Pagination support
✅ Status tracking
✅ Confirmation tokens (newsletter)
✅ Email deduplication (newsletter)
✅ Admin management interface ready
✅ Error handling
✅ Logging

---

## 🎯 Next Steps (Optional)

1. **Email Integration** - Send actual emails for:
   - Contact form confirmation to user
   - Admin notification of new contact
   - Newsletter confirmation email
   - Weekly newsletter distribution

2. **Admin Dashboard** - Create admin pages to:
   - View and manage contacts
   - View and manage subscribers
   - Update contact statuses
   - Export data

3. **Analytics** - Track:
   - Most common contact subjects
   - Subscriber growth
   - Click rates (if implementing email tracking)

---

**All APIs are ready to use!** 🚀

