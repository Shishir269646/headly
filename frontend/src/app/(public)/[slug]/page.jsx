'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import SEO from '@/components/seo/SEO';
import { useContent } from '@/hooks/useContent';
import ContentRenderer from '@/components/content/ContentRenderer';

// Optional (only if these are already made in your components folder)
import ArticleBreadcrumb from '@/components/ui/ArticleBreadcrumb';
import ArticleHeader from '@/components/ui/ArticleHeader';
import ArticleBody from '@/components/ui/ArticleBody';
import ArticleAuthorBio from '@/components/ui/ArticleAuthorBio';
import ArticleCommentSection from '@/components/ui/ArticleCommentSection';
import Sidebar from '@/components/ui/Sidebar';



/* {
      "title": "Getting Started with Headly CMS",
      "excerpt": "Learn how to use Headly CMS for your next project",
      "body": "Headly is a modern headless CMS built with Node.js and MongoDB...",
      "featuredImage": null,
      "status": "published",
      "publishAt": null,
      "author": {
        "$oid": "68f5dd0591e429314fc830d7"
      },
      "categories": [
        "Tutorial",
        "Getting Started"
      ],
      "tags": [
        "headless-cms",
        "nodejs",
        "mongodb"
      ],
      "seo": {
        "metaTitle": "Getting Started with Headly CMS",
        "metaDescription": "Complete guide to getting started with Headly CMS",
        "metaKeywords": []
      },
      "readTime": 1,
      "views": 2,
      "isDeleted": false,
      "createdAt": {
        "$date": "2025-10-20T06:56:06.567Z"
      },
      "updatedAt": {
        "$date": "2025-11-01T15:01:00.813Z"
      },
      "slug": "getting-started-with-headly-cms-1760943366567",
      "__v": 0,
      "featuredOrder": 2,
      "isFeatured": false,
      "isPopular": true
    }
     */





export default function PostPage() {
    const { slug } = useParams();
    const { currentContent, loading, error, getContentBySlug } = useContent();

    useEffect(() => {
        if (slug) getContentBySlug(slug);
    }, [slug]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
    }

    if (!currentContent) {
        return <div className="text-center mt-10">Post not found.</div>;
    }

    // ✅ Destructure your mongoose model fields
    const {
        title,
        excerpt,
        body,
        featuredImage,
        author,
        createdAt,
        categories = [],
        tags = [],
        seo,
        readTime,
        views,
    } = currentContent;

    // ✅ Example breadcrumb items
    const breadcrumbItems = [
        { name: 'Home', href: '/' },
        { name: categories?.[0] || 'Blog', href: '/blog' },
        { name: title, href: `/post/${slug}` },
    ];

    return (
        <>
            <SEO
                title={seo?.metaTitle || title}
                description={seo?.metaDescription || excerpt}
                keywords={seo?.metaKeywords?.length ? seo.metaKeywords : tags}
                slug={slug}
                image={seo?.ogImage || featuredImage?.url}
            />

            <div className="min-h-screen bg-white dark:bg-gray-950 dark:text-gray-200">
                {/* Breadcrumb */}
                <ArticleBreadcrumb items={breadcrumbItems} />

                <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* ======= Left Column: Article ======= */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* ✅ Article Header */}
                            <ArticleHeader
                                category={categories?.[0] || 'Uncategorized'}
                                title={title}
                                authorName={typeof author === 'object' ? author.name : author}
                                date={createdAt ? format(new Date(createdAt), 'PPP') : '—'}
                                readTime={readTime}
                                views={views}
                                featuredImage={featuredImage}
                            />

                            {/* ✅ Render actual CMS body */}
                            <ArticleBody tags={tags}>
                                <ContentRenderer content={body} />
                            </ArticleBody>

                            {/* ✅ Author Bio */}
                            {author && (
                                <ArticleAuthorBio
                                    name={author.name || 'Unknown Author'}
                                    bio={author.bio || 'No bio available.'}
                                    avatarUrl={author.avatarUrl || '/default-avatar.png'}
                                    twitterUrl={author.twitter || '#'}
                                    linkedinUrl={author.linkedin || '#'}
                                />
                            )}

                            {/* ✅ Comments Section */}
                            <ArticleCommentSection
                                contentId={currentContent._id}
                            />
                        </div>

                        {/* ======= Right Column: Sidebar ======= */}
                        <div className="lg:col-span-1">
                            <Sidebar />
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
