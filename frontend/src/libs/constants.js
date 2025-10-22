
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api');

export const USER_ROLES = {
    ADMIN: 'admin',
    EDITOR: 'editor',
    AUTHOR: 'author',
    VIEWER: 'viewer'
};

export const CONTENT_STATUS = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    SCHEDULED: 'scheduled',
    ARCHIVED: 'archived'
};

export const TOAST_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

export const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
};

export const FILE_UPLOAD = {
    MAX_SIZE: 50 * 1024 * 1024, // 50MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword']
};

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    CONTENTS: '/dashboard/contents',
    MEDIA: '/dashboard/media',
    USERS: '/dashboard/users',
    PROFILE: '/dashboard/profile',
    BLOG: '/blog'
};
