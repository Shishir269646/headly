"use client";
import React, { useEffect } from 'react';
import { useContent } from '@/hooks/useContent';
import PopularPostsWidget from './PopularPostsWidget';
import NewsletterWidget from './NewsletterWidget';
import SidebarCategories from './SidebarCategories';

export default function Sidebar() {
    const {
        fetchContents,
        popular,
        loading,
        error,
        getPopular,
    } = useContent();

    useEffect(() => {
        getPopular();
    }, []);

    return (
        <aside className="lg:col-span-1">
            <div className="sticky top-24">
                <div className="mb-8">
                    <input
                        type="text"
                        placeholder="Search articles..."
                        className="input input-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    />
                </div>
                <PopularPostsWidget posts={popular} loading={loading} />
                <SidebarCategories />
                <NewsletterWidget />
            </div>
        </aside>
    );
}