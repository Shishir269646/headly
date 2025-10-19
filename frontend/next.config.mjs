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

export default nextConfig;


