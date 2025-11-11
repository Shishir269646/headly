'use client';

import React, { useEffect, useCallback } from 'react';
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


export default function PostPage() {
    const { slug } = useParams();
    const {
        currentContent,
        loading,
        error,
        getContentBySlug,
        clearError
    } = useContent();



    // FIX: Use async/await in useEffect to properly handle the thunk promise
    useEffect(() => {
        // 1. Clear any previous error before a new fetch attempt
        clearError();

        if (slug) {
            const fetchContent = async () => {
                try {
                    // Call the action. We await it to ensure completion before proceeding, 
                    // though the state update happens via Redux slice
                    await getContentBySlug(slug);
                } catch (err) {
                    // This catches the error returned by the .unwrap() in the hook.
                    // The error state in Redux should also be updated.
                    console.error('Error fetching content by slug:', err);
                }
            };
            fetchContent();
        }
    }, [slug, getContentBySlug, clearError]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-lg">
                Loading post...
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="text-center mt-10 text-red-500">
                <p>Error: {error}</p>
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => {
                        clearError();
                        getContentBySlug(slug);
                    }}
                >
                    Retry
                </button>
            </div>
        );
    }

    // No content found
    if (!currentContent) {
        return (
            <div className="text-center mt-10 text-gray-500">
                <p>Post not found.</p>
                <p className="text-sm mt-2">Slug: {slug}</p>
            </div>
        );
    }


    // FIX: Destructure 'categories' (plural) as an array, not 'category'
    const {
        title,
        excerpt,
        body,
        featuredImage,
        author,
        createdAt,
        category, // Use 'category' to match your JSON structure
        tags = [],
        seo,
        readTime,
        views,
    } = currentContent;

    // Example breadcrumb items (using the first category from the array)
    const breadcrumbItems = [
        { name: 'Home', href: '/' },
        { name: category?.name  },
        { name: title, href: `/${slug}` },
    ];

    // Fallback for author display, since the author field might be a reference (string) or populated object.
    const authorName = typeof author === 'object' && author !== null ? author.name : (author || 'Unknown Author');


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

                            {/* Article Header */}
                            <ArticleHeader
                                category={category || 'Uncategorized'} // Use the first category
                                title={title}
                                authorName={authorName}
                                date={createdAt ? format(new Date(createdAt), 'PPP') : '—'}
                                readTime={readTime}
                                views={views}
                                featuredImage={featuredImage}
                            />

                            {/* Render actual CMS body */}
                            <ArticleBody tags={tags}>
                                <ContentRenderer content={body} />
                            </ArticleBody>

                            {/* Author Bio (only display if author is a populated object) */}
                            {typeof author === 'object' && author !== null && (
                                <ArticleAuthorBio
                                    name={author.name || 'Unknown Author'}
                                    bio={author.bio || 'No bio available.'}
                                    avatarUrl={author.avatarUrl || '/default-avatar.png'}
                                    twitterUrl={author.twitter || '#'}
                                    linkedinUrl={author.linkedin || '#'}
                                />
                            )}

                            {/* Comments Section */}
                            <ArticleCommentSection
                                // Assuming your content object has an '_id' for the comment anchor
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