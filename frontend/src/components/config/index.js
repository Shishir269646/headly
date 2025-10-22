const config = {
    apiBase: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'),
    cloudinaryBase: process.env.NEXT_PUBLIC_CLOUDINARY_BASE,
    revalidateSecret: process.env.REVALIDATE_SECRET,
    previewToken: process.env.PREVIEW_TOKEN,
    analyticsId: process.env.NEXT_PUBLIC_ANALYTICS_ID,
};
export default config;


