'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { User, Calendar, TrendingUp, FileText, Award } from 'lucide-react';
import ArticleCard from '@/components/ui/ArticleCard';

export default function AuthorPage() {
    const params = useParams();
    const authorSlug = params.slug;
    const [author, setAuthor] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data - replace with actual API call
        setTimeout(() => {
            setAuthor({
                name: 'John Doe',
                slug: authorSlug,
                avatar: 'https://via.placeholder.com/150',
                email: 'john@example.com',
                bio: 'Experienced writer with 5+ years in tech journalism. Passionate about emerging technologies and their impact on society.',
                articleCount: 15,
                totalViews: 45230,
                role: 'Senior Writer',
                joinedDate: '2020-01-15'
            });
            
            setArticles([
                {
                    _id: '1',
                    title: 'Sample Article by John Doe',
                    slug: 'sample-article',
                    excerpt: 'This is a sample article written by the author...',
                    featuredImage: { url: 'https://via.placeholder.com/400x300' },
                    author: { name: 'John Doe', avatar: 'https://via.placeholder.com/40' },
                    createdAt: new Date(),
                    readTime: 5,
                    categories: ['Technology']
                },
                // Add more articles
            ]);
            
            setLoading(false);
        }, 1000);
    }, [authorSlug]);

    return (
        <div className="min-h-screen bg-base-100">
            {/* Author Header */}
            <section className="bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 py-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            {loading ? (
                                <div className="text-center py-12">
                                    <span className="loading loading-spinner loading-lg"></span>
                                </div>
                            ) : author ? (
                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                    {/* Avatar */}
                                    <div className="flex-shrink-0">
                                        <div className="avatar placeholder">
                                            <div className="bg-primary text-primary-content rounded-full w-32">
                                                <span className="text-4xl">{author.name.charAt(0)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h1 className="text-4xl font-bold">{author.name}</h1>
                                            <span className="badge badge-primary">{author.role}</span>
                                        </div>
                                        <p className="text-lg text-base-content/70 mb-6">
                                            {author.bio}
                                        </p>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            <div className="stat bg-base-200 rounded-lg">
                                                <div className="stat-figure text-primary">
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <div className="stat-title">Articles</div>
                                                <div className="stat-value text-primary">{author.articleCount}</div>
                                            </div>

                                            <div className="stat bg-base-200 rounded-lg">
                                                <div className="stat-figure text-secondary">
                                                    <TrendingUp className="w-6 h-6" />
                                                </div>
                                                <div className="stat-title">Total Views</div>
                                                <div className="stat-value text-secondary">
                                                    {author.totalViews.toLocaleString()}
                                                </div>
                                            </div>

                                            <div className="stat bg-base-200 rounded-lg">
                                                <div className="stat-figure text-accent">
                                                    <Calendar className="w-6 h-6" />
                                                </div>
                                                <div className="stat-title">Joined</div>
                                                <div className="stat-value text-sm text-accent">
                                                    {new Date(author.joinedDate).getFullYear()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </section>

            {/* Author's Articles */}
            <section className="py-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    <h2 className="text-3xl font-bold mb-8 pb-4 border-b-2 border-primary">
                        Articles by {author?.name || 'Author'}
                    </h2>

                    {articles.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {articles.map((article, index) => (
                                <ArticleCard key={article._id} post={article} priority={index < 3} />
                            ))}
                        </div>
                    ) : (
                        <div className="card bg-base-200 shadow-lg">
                            <div className="card-body text-center py-12">
                                <FileText className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
                                <h3 className="text-2xl font-bold mb-2">No Articles Yet</h3>
                                <p className="text-base-content/70">
                                    This author hasn't published any articles yet.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

