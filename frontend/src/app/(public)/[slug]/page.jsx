// ============================================
// 📄 app/blog/[slug]/page.js
// Blog Post Page (SSR Version)
// ============================================

import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 🚀 SSR Metadata Generation
export async function generateMetadata({ params }) {
    try {
        const { slug } = params;
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/contents/slug/${slug}`,
            { cache: 'no-store' } // SSR: no caching
        );

        if (!res.ok) {
            return {
                title: 'Post Not Found',
                description: 'The requested blog post could not be found.',
            };
        }

        const data = await res.json();
        const post = data.data;

        return {
            title: post.seo?.metaTitle || post.title,
            description: post.seo?.metaDescription || post.excerpt,
            keywords: post.seo?.metaKeywords?.join(', ') || post.tags?.join(', '),
            authors: [{ name: post.author.name }],
            openGraph: {
                title: post.seo?.metaTitle || post.title,
                description: post.seo?.metaDescription || post.excerpt,
                url: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`,
                siteName: 'Headly CMS',
                images: [
                    {
                        url: post.featuredImage?.url || '/images/default-og.jpg',
                        width: 1200,
                        height: 630,
                        alt: post.featuredImage?.alt || post.title,
                    },
                ],
                type: 'article',
                publishedTime: post.publishAt || post.createdAt,
                modifiedTime: post.updatedAt,
                authors: [post.author.name],
                tags: post.tags,
            },
            twitter: {
                card: 'summary_large_image',
                title: post.seo?.metaTitle || post.title,
                description: post.seo?.metaDescription || post.excerpt,
                images: [post.featuredImage?.url || '/images/default-og.jpg'],
            },
            alternates: {
                canonical: `${process.env.NEXT_PUBLIC_APP_URL}/blog/${post.slug}`,
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Blog Post',
            description: 'Read our latest blog post',
        };
    }
}

// 🚫 Remove generateStaticParams — not needed for SSR

// 🧩 Main Blog Post Page (SSR)
export default async function BlogPostPage({ params }) {
    const { slug } = params;

    let post;
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/contents/slug/${slug}`,
            { cache: 'no-store' } // SSR fetch
        );

        if (!res.ok) notFound();

        const data = await res.json();
        post = data.data;
    } catch (error) {
        console.error('Error fetching post:', error);
        notFound();
    }

    const formatDate = (date) =>
        new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

    const readingTime = post.readTime || Math.ceil(post.body.split(' ').length / 200);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header/Navbar */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-2xl font-bold text-gray-900">
                            Headly
                        </Link>
                        <div className="flex items-center space-x-6">
                            <Link href="/blog" className="text-gray-600 hover:text-gray-900">Blog</Link>
                            <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
                            <Link href="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
                            <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                Login
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Article */}
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
                {post.categories?.length > 0 && (
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
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{post.title}</h1>

                {/* Excerpt */}
                {post.excerpt && (
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">{post.excerpt}</p>
                )}

                {/* Meta */}
                <div className="flex items-center flex-wrap gap-6 mb-8 pb-8 border-b">
                    {/* Author */}
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
                            <p className="text-sm font-medium text-gray-900">{post.author.name}</p>
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
                    <div className="mb-12 rounded-2xl overflow-hidden shadow-xl">
                        <Image
                            src={post.featuredImage.url}
                            alt={post.featuredImage.alt || post.title}
                            width={1200}
                            height={630}
                            className="w-full h-auto object-cover"
                            priority
                        />
                        {post.featuredImage.caption && (
                            <p className="text-sm text-gray-500 text-center mt-4 italic">
                                {post.featuredImage.caption}
                            </p>
                        )}
                    </div>
                )}

                {/* Body */}
                <div
                    className="prose prose-lg max-w-none mb-12"
                    dangerouslySetInnerHTML={{ __html: post.body }}
                />

                {/* Tags */}
                {post.tags?.length > 0 && (
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

                {/* Author Bio */}
                <div className="mb-12 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
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
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">{post.author.name}</h4>
                            <p className="text-gray-600 mb-3">{post.author.bio || 'Content creator and writer at Headly CMS'}</p>
                            <Link
                                href={`/blog?author=${post.author._id}`}
                                className="text-blue-600 hover:underline text-sm font-medium"
                            >
                                View all posts by {post.author.name} →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Related Posts */}
                <RelatedPosts currentPostId={post._id} categories={post.categories} />
            </article>
        </div>
    );
}

// 🔗 Related Posts (SSR fetch)
async function RelatedPosts({ currentPostId, categories }) {
    if (!categories || categories.length === 0) return null;

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/contents?status=published&category=${categories[0]}&limit=3`,
            { cache: 'no-store' }
        );

        if (!res.ok) return null;

        const data = await res.json();
        let relatedPosts = data.data.contents.filter((p) => p._id !== currentPostId);

        if (relatedPosts.length === 0) return null;

        return (
            <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedPosts.map((post) => (
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
                                <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
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
