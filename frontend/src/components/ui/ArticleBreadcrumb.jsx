"use client";
import React from 'react';





export default function ArticleBreadcrumb({ items=[] }) {
    return (
        // Responsive BG and border. Dark mode: dark:bg-gray-800, dark:border-gray-700
        <div className="bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
                <div className="text-sm breadcrumbs">
                    <ul>
                        {items.map((item, index) => (
                            <li key={index}>
                                {item.isCurrent ? (
                                    // Current item style. Dark mode: dark:text-gray-300
                                    <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                                ) : (
                                    // Link item style. Dark mode: dark:text-blue-400
                                    <a href={item.href} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                        {item.label}
                                    </a>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}