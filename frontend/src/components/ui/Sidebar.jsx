"use client";
import React from 'react';
import SidebarPopularPosts from './SidebarPopularPosts'; // Assuming these are in the same directory
import SidebarCategories from './SidebarCategories';

// Mock data for demonstration
const mockPosts = [
    { id: 'p1', title: 'Latest Tech Trends Shaping the Future of Computing', date: 'March 11, 2024', imageUrl: 'https://images.unsplash.com/photo-1550000000001?w=100&h=100&fit=crop', href: '#' },
    { id: 'p2', title: 'The Rise of AI in Everyday Gadgets', date: 'March 12, 2024', imageUrl: 'https://images.unsplash.com/photo-1550000000002?w=100&h=100&fit=crop', href: '#' },
    { id: 'p3', title: 'Understanding 5G: Speed and Latency', date: 'March 13, 2024', imageUrl: 'https://images.unsplash.com/photo-1550000000003?w=100&h=100&fit=crop', href: '#' },
    { id: 'p4', title: 'Review: Top 5 New Smartwatches of the Year', date: 'March 14, 2024', imageUrl: 'https://images.unsplash.com/photo-1550000000004?w=100&h=100&fit=crop', href: '#' },
];

const mockCategories = [
    { name: 'Technology', count: 45, href: '#' },
    { name: 'Gadgets', count: 32, href: '#' },
    { name: 'Reviews', count: 28, href: '#' },
    { name: 'Mobile', count: 41, href: '#' },
    { name: 'Apps', count: 23, href: '#' },
];

/**
 * Container component for the article sidebar.
 */
export default function Sidebar() {
    return (
        <aside>
            {/* Search */}
            <div className="mb-8">
                <input
                    type="text"
                    placeholder="Search articles..."
                    // Dark mode: dark:bg-gray-800, dark:text-white, dark:border-gray-700
                    className="input input-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
                />
            </div>

            {/* Popular Posts */}
            <SidebarPopularPosts posts={mockPosts} />

            {/* Categories */}
            <SidebarCategories categories={mockCategories} />

            {/* Newsletter (Placeholder for future component) */}
            {/* You can add a <SidebarNewsletter /> component here */}

        </aside>
    );
}