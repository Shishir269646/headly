// ============================================
// 📄 app/(public)/blog/[slug]/page.js
// Blog Post Page with ISR (Incremental Static Regeneration)
// ============================================

"use client";
import React, { useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from "react-redux";
import { fetchContentBySlug } from "@/store/slices/contentSlice";
import { useParams } from "next/navigation";




// Main Blog Post Page Component
export default async function BlogPostPage() {


    const { slug } = useParams();
    const dispatch = useDispatch();
    const { currentContent, loading, error } = useSelector((state) => state.content);

    useEffect(() => {
        if (slug) dispatch(fetchContentBySlug(slug));
    }, [dispatch, slug]);



    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!currentContent) return <p>No content found</p>;




    return (
        <div className="min-h-screen bg-gray-50">
            

            {/* Article Content */}
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumb */}
                <nav className="mb-8 text-sm text-gray-600">
                    <Link href="/" className="hover:text-gray-900">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/blog" className="hover:text-gray-900">Blog</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900">{post.title}</span>
                </nav>

                {/* Categories */}
                {post.categories && post.categories.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                        {post.categories.map((category) => (
                            <Link
                                key={category}
                                href={`/blog?category=${category}`}
                                className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200"
                            >
                                {category}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                    {post.title}
                </h1>

                {/* Excerpt */}
                {post.excerpt && (
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        {post.excerpt}
                    </p>
                )}

                {/* Meta Info */}
                <div className="flex items-center space-x-6 mb-8 pb-8 border-b">
                    {/* Author Info */}
                    <div className="flex items-center">
                        {post.author.avatar ? (
                            <Image
                                src={post.author.avatar}
                                alt={post.author.name}
                                width={48}
                                height={48}
                                className="rounded-full"
                            />
                        ) : (
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                                {post.author.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">
                                {post.author.name}
                            </p>
                            <p className="text-sm text-gray-500">
                                {formatDate(post.publishAt || post.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* Reading Time */}
                    <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {readingTime} min read
                    </div>

                    {/* Views */}
                    <div className="flex items-center text-sm text-gray-500">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {post.views || 0} views
                    </div>
                </div>

                {/* Featured Image */}
                {post.featuredImage && (
                    <div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
                        <Image
                            src={post.featuredImage.url}
                            alt={post.featuredImage.alt || post.title}
                            width={1200}
                            height={630}
                            className="w-full h-auto object-cover"
                            priority
                        />
                        {post.featuredImage.caption && (
                            <p className="text-sm text-gray-500 text-center mt-2 italic">
                                {post.featuredImage.caption}
                            </p>
                        )}
                    </div>
                )}

                {/* Article Body */}
                <div
                    className="prose prose-lg max-w-none mb-12
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-gray-900 prose-pre:text-gray-100
            prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:pl-4 prose-blockquote:italic
            prose-img:rounded-lg prose-img:shadow-md
            prose-ul:list-disc prose-ol:list-decimal
            prose-li:text-gray-700"
                    dangerouslySetInnerHTML={{ __html: post.body }}
                />

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="mb-12 pb-12 border-b">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <Link
                                    key={tag}
                                    href={`/blog?tag=${tag}`}
                                    className="text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-200"
                                >
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Share Buttons */}
                <div className="mb-12 pb-12 border-b">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this post</h3>
                    <div className="flex space-x-4">
                        <a
                            href={`https://twitter.com/intent/tweet?url=${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}&text=${post.title}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                            </svg>
                            <span>Twitter</span>
                        </a>

                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                            </svg>
                            <span>Facebook</span>
                        </a>

                        <a
                            href={`https://www.linkedin.com/shareArticle?mini=true&url=${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}&title=${post.title}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-950"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                                <circle cx="4" cy="4" r="2"></circle>
                            </svg>
                            <span>LinkedIn</span>
                        </a>

                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`);
                                alert('Link copied to clipboard!');
                            }}
                            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>Copy Link</span>
                        </button>
                    </div>
                </div>

                {/* Author Bio */}
                <div className="mb-12 p-6 bg-gray-100 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Author</h3>
                    <div className="flex items-start space-x-4">
                        {post.author.avatar ? (
                            <Image
                                src={post.author.avatar}
                                alt={post.author.name}
                                width={80}
                                height={80}
                                className="rounded-full"
                            />
                        ) : (
                            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                {post.author.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                {post.author.name}
                            </h4>
                            <p className="text-gray-600 mb-3">
                                {post.author.bio || 'Content creator and writer at Headly CMS'}
                            </p>
                            <Link
                                href={`/blog?author=${post.author._id}`}
                                className="text-blue-600 hover:underline text-sm"
                            >
                                View all posts by {post.author.name} →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Related Posts Section */}
                <RelatedPosts currentPostId={post._id} categories={post.categories} />
            </article>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Headly</h3>
                            <p className="text-gray-400">
                                Modern headless CMS for content creators
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                                <li><Link href="/about" className="hover:text-white">About</Link></li>
                                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Follow Us</h4>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                                    </svg>
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2025 Headly CMS. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Related Posts Component
async function RelatedPosts({ currentPostId, categories }) {
    if (!categories || categories.length === 0) return null;

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/contents?status=published&category=${categories[0]}&limit=3`,
            { next: { revalidate: 300 } } // Cache for 5 minutes
        );

        if (!res.ok) return null;

        const data = await res.json();
        let relatedPosts = data.data.contents.filter(post => post._id !== currentPostId);

        if (relatedPosts.length === 0) return null;

        return (
            <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedPosts.slice(0, 3).map((post) => (
                        <Link
                            key={post._id}
                            href={`/blog/${post.slug}`}
                            className="group block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition"
                        >
                            {post.featuredImage && (
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={post.featuredImage.url}
                                        alt={post.title}
                                        width={400}
                                        height={250}
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                    />
                                </div>
                            )}
                            <div className="p-4">
                                <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 line-clamp-2">
                                    {post.title}
                                </h4>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {post.excerpt}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        );
    } catch (error) {
        console.error('Error fetching related posts:', error);
        return null;
    }
}
