"use client";
import React from 'react';

/**
 * Displays a card with a list of categories in the sidebar.
 * @param {Object} props - Component props.
 * @param {Array<Object>} props.categories - Array of category objects.
 * @param {string} props.categories[].name - Category name.
 * @param {number} props.categories[].count - Number of articles in the category.
 * @param {string} props.categories[].href - Category link.
 */
export default function SidebarCategories({ categories }) {
    return (
        // Dark mode: dark:bg-gray-900, dark:shadow-xl
        <div className="card bg-base-100 shadow-lg mb-8 dark:bg-gray-900 dark:border dark:border-gray-700">
            <div className="card-body p-5">
                {/* Dark mode: dark:text-white */}
                <h3 className="card-title text-xl mb-4 font-bold text-gray-900 dark:text-white">Categories</h3>
                <ul className="space-y-2">
                    {categories.map((category) => (
                        <li key={category.name}>
                            <a href={category.href} className="flex justify-between items-center text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
                                <span>{category.name}</span>
                                {/* Dark mode: dark:bg-gray-700, dark:text-gray-300 */}
                                <span className="badge badge-sm bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300">{category.count}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}