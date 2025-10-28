'use client';

import React, { useEffect } from 'react';
import SEO from '@/components/seo/SEO';
import { useParams } from 'next/navigation';
import { useContent } from '@/hooks/useContent';
import ContentRenderer from '@/components/content/ContentRenderer';
import { format } from 'date-fns';

export default function PostPage() {
    const { slug } = useParams();
    const { currentContent, loading, error, getContentBySlug } = useContent();

    useEffect(() => {
        if (slug) {
            getContentBySlug(slug);
        }
    }, [slug]);

    console.log("Post by slug", currentContent);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-10">Error: {error}</div>;
    }

    if (!currentContent) {
        return <div className="text-center mt-10">Post not found.</div>;
    }

    const {
        title,
        excerpt,
        body,
        featuredImage,
        author,
        createdAt,
        categories,
        tags,
        seo,
        readTime,
        views
    } = currentContent;

    return (
        <>
            <SEO
                title={seo?.metaTitle || title}
                description={seo?.metaDescription || excerpt}
                keywords={seo?.metaKeywords || tags}
                slug={slug}
                image={seo?.ogImage || featuredImage?.url}
            />
            <div className="container mx-auto px-4 py-8">
                <article className="max-w-4xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">{title}</h1>
                        {excerpt && <p className="text-lg text-gray-600 mb-4">{excerpt}</p>}
                        <div className="flex items-center text-sm text-gray-500">
                            <span>By {author?.name || 'Unknown'}</span>
                            <span className="mx-2">•</span>
                            <span>{createdAt ? format(new Date(createdAt), 'MMMM dd, yyyy') : 'N/A'}</span>
                            <span className="mx-2">•</span>
                            <span>{readTime} min read</span>
                            <span className="mx-2">•</span>
                            <span>{views} views</span>
                        </div>
                    </header>

                    {featuredImage && (
                        <img
                            src={featuredImage.url}
                            alt={title}
                            className="w-full h-auto rounded-lg mb-8"
                        />
                    )}

                    <div className="prose lg:prose-xl max-w-none">
                        <ContentRenderer content={body} />
                    </div>

                    <footer className="mt-12">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {categories?.length > 0 && <span className="font-bold">Categories:</span>}
                            {categories?.map(category => (
                                <span key={category} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                                    {category}
                                </span>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {tags?.length > 0 && <span className="font-bold">Tags:</span>}
                            {tags?.map(tag => (
                                <span key={tag} className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </footer>
                </article>
            </div>
        </>
    );
}
''