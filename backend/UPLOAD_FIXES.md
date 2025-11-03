# Image Upload System Fixes

## Backend Fixes Applied

### 1. Fixed Missing Import
- **File**: `backend/controllers/media.controller.js`
- **Fix**: Added missing `ApiError` import

### 2. Fixed Upload Directory Creation
- **File**: `backend/middlewares/upload.middleware.js`
- **Fix**: Added automatic creation of `uploads/tmp` directory if it doesn't exist

### 3. Enhanced Media Service
- **File**: `backend/services/media.service.js`
- **Fixes**:
  - Fixed `this.uploadMedia` to `exports.uploadMedia` in `uploadMultipleMedia`
  - Added S3 configuration check with fallback to local storage
  - Added automatic directory creation for local storage
  - Added file sanitization for filenames
  - Added cleanup of temporary files after upload
  - Improved error handling with proper cleanup on errors

### 4. Static File Serving
- **File**: `backend/app.js`
- **Fix**: Updated static file serving to serve from `uploads` directory

## Frontend Fixes Applied

### 1. Image Upload Components
- **Files**: 
  - `frontend/src/components/editor/ImageUploadButton.jsx`
  - `frontend/src/components/content/ContentForm.jsx`
  - `frontend/src/app/(dashboard)/dashboard/profile/page.jsx`
- **Fixes**:
  - Added file validation (type and size)
  - Improved error handling
  - Fixed response structure handling
  - Added proper metadata (folder, alt, caption)

### 2. Redux Slices
- **Files**:
  - `frontend/src/store/slices/mediaSlice.js`
  - `frontend/src/store/slices/userSlice.js`
- **Fixes**:
  - Added documentation comments
  - Improved error handling
  - Better metadata filtering

## How It Works

### Content Images
1. Uploads via `POST /api/media/upload`
2. Field name: `file`
3. Metadata: `folder` (content-images or featured-images), `alt`, `caption`
4. Returns: Media object with `_id`, `url`, etc.

### User Avatar
1. Uploads via `PUT /api/users/profile/avatar`
2. Field name: `avatar` (NOT `file`)
3. Returns: User object with updated `avatar` URL

### Storage Backend
- **S3 (if configured)**: Files uploaded to AWS S3, returns S3 URL
- **Local (fallback)**: Files stored in `uploads/{folder}/`, returns `/uploads/{folder}/{filename}`

## Environment Variables Needed

### For S3 (Optional)
```env
AWS_S3_BUCKET_NAME=your-bucket-name
AWS_REGION=your-region
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

### For Local Storage (Default)
- No additional configuration needed
- Files stored in `backend/uploads/` directory

## Testing

To test uploads:
1. Ensure backend is running on `http://localhost:4000`
2. Ensure frontend is configured with `NEXT_PUBLIC_API_URL=http://localhost:4000/api`
3. Upload an image through:
   - Content editor (for content images)
   - Content form (for featured images)
   - Profile page (for user avatars)

## File Size Limits
- Images: 10MB max (frontend validation)
- Avatars: 5MB max (frontend validation)
- Backend: 50MB max (multer configuration)

