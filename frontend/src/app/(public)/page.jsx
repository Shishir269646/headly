'use client';

import React, { useEffect } from 'react';
import { useContent } from '@/hooks/useContent';
import { useCategories } from '@/hooks/useCategories';
import { useUser } from '@/hooks/useUser';

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
    const { users, loading: usersLoading, error: usersError } = useUser();

    useEffect(() => {
        
        getFeatured();
        getLatest();
        getPopular();
        getTrending();
    }, []);

    const loading = contentLoading || categoriesLoading || usersLoading;
    const error = contentError || categoriesError || usersError;

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
                    <FeaturedContentGrid posts={featured} allCategories={categories} allAuthors={users} />
                </div>

                {/* Trending Posts */}
                <TrendingSection posts={trending} allCategories={categories} allAuthors={users} />
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
                            <ArticleCard
                                key={post._id}
                                post={post}
                                priority={index < 2}
                                allCategories={categories}
                                allAuthors={users}
                            />
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <Sidebar />
            </div>
        </div>
    );
}