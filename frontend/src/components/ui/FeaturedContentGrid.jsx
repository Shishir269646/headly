"use client";
import React from 'react';

const FeaturedContentGrid = ({ posts }) => {
    // Display a loading state if posts are not yet available
    if (!posts || posts.length === 0) {
        return (
            <div className="animate-pulse">
                <div className="relative overflow-hidden rounded-lg shadow-xl h-[600px] dark:bg-gray-900">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                        <div className="space-y-4">
                            <div className="bg-gray-400 dark:bg-gray-600 h-6 w-24 rounded-md"></div>
                            <div className="bg-gray-400 dark:bg-gray-600 h-8 w-3/4 rounded-md"></div>
                            <div className="flex items-center gap-4">
                                <div className="bg-gray-400 dark:bg-gray-600 h-8 w-8 rounded-full"></div>
                                <div className="bg-gray-400 dark:bg-gray-600 h-4 w-20 rounded-md"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Use the first post from the array as the featured post
    const featuredPost = posts[0];

    return (
        <section className="mb-8 px-4 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="relative group">
                    {/* Main Featured Article */}
                    <article className="relative overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 h-[600px]">
                        {/* Background Image with Overlay */}
                        <div className="absolute inset-0">
                            <img
                                src={featuredPost.featuredImage?.url || 'https://via.placeholder.com/800x600'}
                                alt={featuredPost.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        </div>

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                            <div className="space-y-4">
                                {/* Category Badge */}
                                {featuredPost.categories && featuredPost.categories.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <span className="bg-blue-500 text-white px-4 py-1.5 rounded-md text-sm font-normal uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer">
                                            {featuredPost.categories[0]}
                                        </span>
                                    </div>
                                )}

                                {/* Title */}
                                <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight hover:text-gray-200 transition-colors cursor-pointer">
                                    <a href={`/${featuredPost.slug}`} className="block">
                                        {featuredPost.title}
                                    </a>
                                </h2>

                                {/* Meta Information */}
                                <div className="flex items-center gap-4 text-gray-200">
                                    {/* Author */}
                                    {featuredPost.author && (
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={featuredPost.author.avatar || 'https://via.placeholder.com/40'}
                                                alt={featuredPost.author.name}
                                                className="w-8 h-8 rounded-full border-2 border-white/50"
                                            />
                                            <a
                                                href={`/author/${featuredPost.author.slug}`}
                                                className="text-sm font-medium hover:text-white transition-colors"
                                            >
                                                {featuredPost.author.name}
                                            </a>
                                        </div>
                                    )}

                                    {/* Separator */}
                                    {featuredPost.author && <span className="text-gray-400">•</span>}

                                    {/* Date */}
                                    <time className="text-sm">
                                        {new Date(featuredPost.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </time>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
};

export default FeaturedContentGrid;