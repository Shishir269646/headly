"use client";
import React, { useEffect } from 'react';
import { useContent } from '@/hooks/useContent';
import PopularPostsWidget from './PopularPostsWidget';
import NewsletterWidget from './NewsletterWidget';
import SidebarCategories from './SidebarCategories';



const mockCategories = [
    { name: 'Technology', count: 45, href: '#' },
    { name: 'Gadgets', count: 32, href: '#' },
    { name: 'Reviews', count: 28, href: '#' },
    { name: 'Mobile', count: 41, href: '#' },
    { name: 'Apps', count: 23, href: '#' },
];



export default function Sidebar() {

    const {
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
                        // Dark mode: dark:bg-gray-800, dark:text-white, dark:border-gray-700
                        className="input input-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
                    />
                </div>
                <PopularPostsWidget posts={popular} loading={loading} />
                <SidebarCategories categories={mockCategories} />
                <NewsletterWidget />
            </div>
        </aside>
    );
}