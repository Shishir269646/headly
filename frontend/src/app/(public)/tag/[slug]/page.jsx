'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Tag, TrendingUp, Calendar, Clock } from 'lucide-react';
import ArticleCard from '@/components/ui/ArticleCard';

export default function TagPage() {
    const params = useParams();
    const tagSlug = params.slug;
    const [tagInfo, setTagInfo] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data - replace with actual API call
        setTimeout(() => {
            setTagInfo({
                name: tagSlug,
                description: 'Articles and posts related to this topic',
                articleCount: 12
            });
            setArticles([
                {
                    _id: '1',
                    title: 'Sample Article 1',
                    slug: 'sample-article-1',
                    excerpt: 'This is a sample article description...',
                    featuredImage: { url: 'https://via.placeholder.com/400x300' },
                    author: { name: 'John Doe' },
                    createdAt: new Date(),
                    readTime: 5,
                    categories: ['Technology']
                },
                // Add more articles as needed
            ]);
            setLoading(false);
        }, 1000);
    }, [tagSlug]);

    return (
        <div className="min-h-screen bg-base-100">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 py-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-content mb-4">
                            <Tag className="w-5 h-5" />
                            <span className="font-semibold">Tag</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-4">
                            #{tagInfo?.name || tagSlug}
                        </h1>
                        {tagInfo?.description && (
                            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
                                {tagInfo.description}
                            </p>
                        )}
                        {tagInfo && (
                            <div className="mt-6 flex items-center justify-center gap-6">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                    <span className="font-semibold">{tagInfo.articleCount} Articles</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Articles Section */}
            <section className="py-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    {loading ? (
                        <div className="text-center py-12">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                        </div>
                    ) : articles.length > 0 ? (
                        <>
                            <h2 className="text-3xl font-bold mb-8 pb-4 border-b-2 border-primary">
                                Latest Articles
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {articles.map((article, index) => (
                                    <ArticleCard key={article._id} post={article} priority={index < 3} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="card bg-base-200 shadow-lg">
                            <div className="card-body text-center py-12">
                                <Tag className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
                                <h3 className="text-2xl font-bold mb-2">No Articles Yet</h3>
                                <p className="text-base-content/70">
                                    There are no articles with this tag yet.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

