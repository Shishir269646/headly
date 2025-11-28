'use client';

import React, { useEffect } from 'react';
import { useContent } from '@/hooks/useContent';
import { useCategories } from '@/hooks/useCategories';

import FeaturedContentGrid from '@/components/ui/FeaturedContentGrid';
import TrendingSection from '@/components/ui/TrendingSection';
import ArticleCard from '@/components/ui/ArticleCard';
import Sidebar from '@/components/ui/Sidebar';

export default function Home() {
    const {
        featured,
        popular,
        trending,
        latest,
        loading: contentLoading,
        error: contentError,
        getFeatured,
        getPopular,
        getTrending,
        getLatest
    } = useContent();
    
    const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();

    useEffect(() => {
        // Fetch all the data on component mount
        getFeatured();
        getLatest();
        getPopular();
        getTrending();
    }, []); // Empty dependency array - only run once on mount

    const loading = contentLoading || categoriesLoading;
    const error = contentError || categoriesError;

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="min-h-screen w-full dark:bg-gray-900 mx-auto px-4 py-8 max-w-7xl">
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
                        {latest.map((post, index) => (
                            <ArticleCard key={post._id} post={post} priority={index < 2} />
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <Sidebar categories={categories} />
            </div>
        </div>
    );
}