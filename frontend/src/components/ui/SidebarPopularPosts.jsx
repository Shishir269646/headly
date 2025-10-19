"use client";
import React from 'react';

/**
 * Displays a card with a list of popular posts in the sidebar.
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.posts - Array of popular post objects.
 * @param {string} props.posts[].id - Unique post ID.
 * @param {string} props.posts[].title - Post title.
 * @param {string} props.posts[].date - Post date.
 * @param {string} props.posts[].imageUrl - Post thumbnail image URL.
 * @param {string} props.posts[].href - Post link.
 */
export default function SidebarPopularPosts({ posts }) {
    return (
        // Dark mode: dark:bg-gray-900, dark:shadow-xl
        <div className="card bg-base-100 shadow-lg mb-8 dark:bg-gray-900 dark:border dark:border-gray-700">
            <div className="card-body p-5">
                {/* Dark mode: dark:text-white */}
                <h3 className="card-title text-xl mb-4 font-bold text-gray-900 dark:text-white">Popular Posts</h3>
                <div className="space-y-4">
                    {posts.map((post) => (
                        <div key={post.id} className="flex gap-3 items-start">
                            <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-20 h-20 object-cover rounded shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                {/* Dark mode: dark:text-gray-200, dark:hover:text-blue-400 */}
                                <a href={post.href} className="font-semibold text-sm text-gray-800 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 cursor-pointer line-clamp-2 transition-colors">
                                    {post.title}
                                </a>
                                {/* Dark mode: dark:text-gray-500 */}
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{post.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}