'use client';


import React, { useEffect, useCallback, useState } from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import SEO from '@/components/seo/SEO';
import { useContent } from '@/hooks/useContent';
import ContentRenderer from '@/components/content/ContentRenderer';



import ArticleBreadcrumb from '@/components/ui/ArticleBreadcrumb';
import ArticleHeader from '@/components/ui/ArticleHeader';
import ArticleBody from '@/components/ui/ArticleBody';
import ArticleAuthorBio from '@/components/ui/ArticleAuthorBio';
import ArticleCommentSection from '@/components/ui/ArticleCommentSection';
import Sidebar from '@/components/ui/Sidebar';
import Loader from '@/components/common/Loader';


export default function PostPage() {

    const { slug } = useParams();
    const {
        currentContent,
        loading,
        error,
        getContentBySlug,
        clearError
    } = useContent();


    const [postUrl, setPostUrl] = useState('');


    useEffect(() => {

        if (typeof window !== 'undefined') {
            setPostUrl(window.location.href);
        }
    }, []);



    useEffect(() => {

        clearError();

        if (slug) {
            const fetchContent = async () => {
                try {
                    await getContentBySlug(slug);
                } catch (err) {
                    console.error('Error fetching content by slug:', err);
                }
            };
            fetchContent();
        }
    }, [slug, getContentBySlug, clearError]);


    if (loading) {
        return (
            <Loader />
        );
    }

    if (error) {
        return (
            <div className="text-center mt-10 text-red-500 dark:text-red-400">
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

    if (!currentContent) {
        return (
            <div className="text-center mt-10 text-gray-500 dark:text-gray-400">
                <p>Post not found.</p>
                <p className="text-sm mt-2">Slug: {slug}</p>
            </div>
        );
    }



    const {
        title,
        excerpt,
        body,
        featuredImage,
        author,
        createdAt,
        category,
        tags = [],
        seo,
        readTime,
        views,
    } = currentContent;

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

            <div className="min-h-screen dark:bg-gray-900 dark:text-gray-200">
                <ArticleBreadcrumb category={category} articleTitle={title} />

                <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 dark:bg-gray-900">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6 dark:bg-gray-900">

                            <ArticleHeader
                                category={category || 'Uncategorized'}
                                title={title}
                                authorName={authorName}
                                date={createdAt ? format(new Date(createdAt), 'PPP') : '—'}
                                readTime={readTime}
                                views={views}
                                featuredImage={featuredImage}
                            />

                            <ArticleBody
                                tags={tags}
                                title={title}
                                url={postUrl}
                            >
                                <ContentRenderer content={body} />
                            </ArticleBody>


                            {typeof author === 'object' && author !== null && (
                                <ArticleAuthorBio
                                    name={author?.name}
                                    bio={author?.bio}
                                    avatarUrl={author?.image?.url}
                                    twitterUrl={author.twitter || '#'}
                                    linkedinUrl={author.linkedin || '#'}
                                />
                            )}

                            <ArticleCommentSection
                                contentId={currentContent._id}
                            />
                        </div>

                        <div className="lg:col-span-1">
                            <Sidebar />
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}