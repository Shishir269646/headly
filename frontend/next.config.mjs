/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "headly-upload-bucket.s3.us-east-1.amazonaws.com",
                pathname: "**", // all path
            },
            {
                protocol: "https",
                hostname: "headly-upload-bucket.s3.amazonaws.com",
                pathname: "**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                pathname: "**",
            },
            {
                protocol: "https",
                hostname: "via.placeholder.com",
                pathname: "**",
            },
            
        ],
        formats: ["image/avif", "image/webp"],
    },
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    },
    experimental: {
        serverActions: true,
    },
};

export default nextConfig;
