"use client";

import Head from "next/head";

/**
 * SEO Component
 * Dynamically sets meta tags for each page/content.
 *
 * Usage:
 * <SEO
 *   title="Post Title"
 *   description="Short description for SEO"
 *   keywords={["blog", "nextjs", "merncommerce"]}
 *   slug="/post/awesome-article"
 *   image="/uploads/featured.jpg"
 * />
 */

export default function SEO({
    title = "MERNCommerce CMS",
    description = "A modern content management system built with Next.js and Tiptap.",
    keywords = [],
    slug = "",
    image = "/default-og-image.jpg",
}) {
    const baseUrl =
        typeof window !== "undefined"
            ? window.location.origin
            : "https://yourdomain.com";

    const canonicalUrl = `${baseUrl}${slug}`;

    return (
        <Head>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            {keywords.length > 0 && (
                <meta name="keywords" content={keywords.join(", ")} />
            )}
            <meta name="author" content="Manjirul Islam Shishir" />

            {/* Canonical Link */}
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="article" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={`${baseUrl}${image}`} />
            <meta property="og:url" content={canonicalUrl} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={`${baseUrl}${image}`} />
        </Head>
    );
}
