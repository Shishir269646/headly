'use client';

import React, { useEffect } from 'react';
import { useContent } from '@/hooks/useContent';

import FeaturedContentGrid from '@/components/ui/FeaturedContentGrid';
import TrendingSection from '@/components/ui/TrendingSection';
import ArticleCard from '@/components/ui/ArticleCard';
import BlogSidebar from '@/components/ui/BlogSidebar';

export default function Home() {
    const {
        featured,
        popular,
        trending,
        latest,
        loading,
        error,
        getFeatured,
        getPopular,
        getTrending,
        getLatest
    } = useContent();

    useEffect(() => {
        // Fetch all the data on component mount
        getFeatured();
        getLatest();
        getPopular();
        getTrending();
    }, []); // Empty dependency array - only run once on mount

  

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="dark:bg-gray-900 min-h-screen mx-auto px-4 py-8 max-w-7xl">
            {/* Featured Section */}
            <div className="grid lg:grid-cols-3 gap-6 mb-12">
                {/* Large Featured Post */}
                <div className="lg:col-span-2">
                    <FeaturedContentGrid posts={featured} />
                </div>

                {/* Trending Posts */}
                <TrendingSection posts={trending} />
            </div>

            {/* Latest Posts Section */}
            <div className="grid lg:grid-cols-4 gap-8">
                {/* Main Posts Grid */}
                <div className="lg:col-span-3">
                    <h3 className="text-xl sm:text-2xl font-bold mb-6 pb-3 border-b-2 border-blue-600 dark:border-blue-500 dark:text-white">
                        Latest Articles
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                        {latest.map((post) => (
                            <ArticleCard key={post._id} post={post} />
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <BlogSidebar popularPosts={popular} />
            </div>
        </div>
    );
}