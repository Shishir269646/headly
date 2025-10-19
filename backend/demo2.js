// ============================================
// 📄 src/utils/logger.js
// ============================================



// ============================================
// 📄 src/utils/responses.js
// ============================================


// ============================================
// 📄 src/utils/apiError.js
// ============================================

// ============================================
// 📄 src/utils/asyncHandler.js
// ============================================



// ============================================
// 📄 src/utils/slugify.js
// ============================================


// ============================================
// 📄 src/utils/helpers.js
// ============================================


// ============================================
// 📄 src/config/cloudinary.js
// ============================================

// ============================================
// 📄 src/config/database.js
// ============================================


// ============================================
// 📄 src/config/index.js
// ============================================

// ============================================
// 📄 src/validators/auth.validator.js
// ============================================



// ============================================
// 📄 src/validators/content.validator.js
// ============================================

// ============================================
// 📄 src/validators/user.validator.js
// ============================================


// ============================================
// 📄 src/validators/media.validator.js
// ============================================



// ============================================
// 📄 src/routes/index.js (Main Router)
// ============================================


// ============================================
// 📄 src/routes/v1/index.js (V1 Routes Aggregator)
// ============================================



// ============================================
// 📄 src/routes/v1/auth.routes.js
// ============================================



// ============================================
// 📄 src/routes/v1/user.routes.js
// ============================================



// ============================================
// 📄 src/routes/v1/content.routes.js
// ============================================




// ============================================
// 📄 src/routes/v1/media.routes.js
// ============================================



// ============================================
// 📄 src/routes/v1/webhook.routes.js
// ============================================



// ============================================
// 📄 src/server.js (Entry Point)
// ============================================


// ============================================
// 📄 src/jobs/index.js (Job Scheduler)
// ============================================



// ============================================
// 📄 src/jobs/publishScheduler.job.js
// ============================================


// ============================================
// 📄 src/jobs/webhookRetry.job.js
// ============================================



// ============================================
// 🌐 FRONTEND API ENDPOINTS LIST
// ============================================

/*
==================================================
✅ COMPLETE BACKEND API ENDPOINTS FOR FRONTEND
==================================================

BASE_URL: http://localhost:4000/api/v1

======================
🔐 AUTHENTICATION APIs
======================

1. Register User
   POST /api/v1/auth/register
   Body: { name, email, password, role? }
   Public

2. Login
   POST /api/v1/auth/login
   Body: { email, password }
   Public

3. Refresh Token
   POST /api/v1/auth/refresh-token
   Body: { refreshToken }
   Public

4. Get Current User
   GET /api/v1/auth/me
   Headers: Authorization: Bearer {token}
   Protected

5. Logout
   POST /api/v1/auth/logout
   Headers: Authorization: Bearer {token}
   Protected

6. Change Password
   PUT /api/v1/auth/change-password
   Body: { currentPassword, newPassword }
   Headers: Authorization: Bearer {token}
   Protected

======================
👥 USER MANAGEMENT APIs
======================

7. Get All Users (Admin only)
   GET /api/v1/users?page=1&limit=10&role=author&search=john
   Headers: Authorization: Bearer {token}
   Role: admin

8. Get User By ID (Admin only)
   GET /api/v1/users/:id
   Headers: Authorization: Bearer {token}
   Role: admin

9. Create User (Admin only)
   POST /api/v1/users
   Body: { name, email, password, role, bio? }
   Headers: Authorization: Bearer {token}
   Role: admin

10. Update User (Admin only)
    PUT /api/v1/users/:id
    Body: { name?, email?, role?, bio?, avatar?, isActive? }
    Headers: Authorization: Bearer {token}
    Role: admin

11. Delete User (Admin only)
    DELETE /api/v1/users/:id
    Headers: Authorization: Bearer {token}
    Role: admin

12. Update Own Profile
    PUT /api/v1/users/profile/me
    Body: { name?, bio?, avatar? }
    Headers: Authorization: Bearer {token}
    Protected

======================
📝 CONTENT APIs
======================

13. Get All Contents (Public with filters)
    GET /api/v1/contents?status=published&page=1&limit=10&search=keyword&category=tech&tag=nodejs&author=userId
    Public (optional auth)

14. Get Content By ID
    GET /api/v1/contents/:id
    Public (optional auth)

15. Get Content By Slug
    GET /api/v1/contents/slug/:slug
    Public (optional auth)

16. Create Content
    POST /api/v1/contents
    Body: { 
      title, 
      excerpt?, 
      body, 
      featuredImage?, 
      status?, 
      publishAt?, 
      categories?, 
      tags?,
      seo? 
    }
    Headers: Authorization: Bearer {token}
    Role: author, editor, admin

17. Update Content
    PUT /api/v1/contents/:id
    Body: { title?, excerpt?, body?, ... }
    Headers: Authorization: Bearer {token}
    Role: author (own), editor, admin

18. Delete Content
    DELETE /api/v1/contents/:id
    Headers: Authorization: Bearer {token}
    Role: author (own), editor, admin

19. Publish Content
    POST /api/v1/contents/:id/publish
    Headers: Authorization: Bearer {token}
    Role: editor, admin

20. Schedule Content
    POST /api/v1/contents/:id/schedule
    Body: { publishAt: "2025-12-31T10:00:00Z" }
    Headers: Authorization: Bearer {token}
    Role: editor, admin

======================
🖼️ MEDIA APIs
======================

21. Get All Media
    GET /api/v1/media?folder=general&mimeType=image&page=1&limit=20&search=filename
    Headers: Authorization: Bearer {token}
    Protected

22. Get Media By ID
    GET /api/v1/media/:id
    Headers: Authorization: Bearer {token}
    Protected

23. Upload Single Media
    POST /api/v1/media/upload
    Body: FormData { file, alt?, caption?, folder? }
    Headers: 
      Authorization: Bearer {token}
      Content-Type: multipart/form-data
    Role: author, editor, admin

24. Upload Multiple Media
    POST /api/v1/media/upload-multiple
    Body: FormData { files[], }
    Headers: 
      Authorization: Bearer {token}
      Content-Type: multipart/form-data
    Role: author, editor, admin

25. Update Media
    PUT /api/v1/media/:id
    Body: { alt?, caption?, folder? }
    Headers: Authorization: Bearer {token}
    Role: author, editor, admin

26. Delete Media
    DELETE /api/v1/media/:id
    Headers: Authorization: Bearer {token}
    Role: editor, admin

======================
🔗 WEBHOOK APIs
======================

27. Trigger Revalidation
    POST /api/v1/webhooks/revalidate
    Body: { slug, action: "publish" }
    Headers: x-webhook-secret: {WEBHOOK_SECRET}
    Public (with secret)

28. Get Webhook Logs (Admin only)
    GET /api/v1/webhooks/logs?status=failed&page=1&limit=50
    Headers: Authorization: Bearer {token}
    Role: admin

29. Retry Failed Webhook (Admin only)
    POST /api/v1/webhooks/logs/:id/retry
    Headers: Authorization: Bearer {token}
    Role: admin

======================
🏥 HEALTH CHECK
======================

30. Health Check
    GET /health
    Public
    Response: { status, timestamp, uptime, environment }

31. API Info
    GET /api/v1
    Public
    Response: { message, version, docs }

==================================================
📊 RESPONSE FORMATS
==================================================

Success Response:
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}

Error Response:
{
  "success": false,
  "message": "Error message",
  "errors": [ { field: "email", message: "Invalid email" } ]
}

Paginated Response:
{
  "success": true,
  "message": "Success",
  "data": [ ... ],
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 10
  }
}

==================================================
🔑 USER ROLES & PERMISSIONS
==================================================

viewer: Can only view published content
author: Can create/edit own content, upload media
editor: Can publish/schedule content, manage all content
admin: Full access to everything

==================================================
📝 NOTES FOR FRONTEND DEVELOPERS
==================================================

1. Store JWT token in localStorage or httpOnly cookie
2. Send token in Authorization header: "Bearer {token}"
3. Handle 401 errors → redirect to login
4. Handle 403 errors → show "No permission" message
5. Implement token refresh logic using refresh token
6. Rate limits: 100 req/15min (general), 5 req/15min (auth)
7. File upload max size: 50MB
8. Supported file types: images, videos, PDFs, documents

*/