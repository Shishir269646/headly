"use client";
import React from 'react';
import { Clock, User, MessageSquare } from 'lucide-react';





export default function ArticleHeader({
    category,
    title,
    authorName,
    authorHref,
    date,
    commentCount,
    featuredImage,
}) {
    return (
        <>
            {/* Category Badge */}
            <div className="mb-4">
                {/* Dark mode: dark:badge-neutral, dark:text-white */}
                <span className="badge badge-primary badge-lg bg-blue-600 text-white border-blue-600 dark:bg-blue-700 dark:border-blue-700">
                    {category?.name.toUpperCase()}
                </span>
            </div>

            {/* Article Title */}
            {/* Responsive font size. Dark mode: dark:text-white */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                {title}
            </h1>

            {/* Meta Information */}
            {/* Responsive layout. Dark mode: dark:text-gray-400, dark:border-gray-700 */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>By <a href={authorHref} className="text-blue-600 hover:underline dark:text-blue-400">{authorName}</a></span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{date}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MessageSquare size={16} />
                    <span>{commentCount} Comments</span>
                </div>
            </div>

            {/* Featured Image */}
            <div className="mb-8">
                <img
                    src={featuredImage?.url}
                    alt={featuredImage?.alt || 'Featured Image'}
                    // Responsive width and height.
                    className="w-full h-auto rounded-lg shadow-xl"
                />
                {/* Dark mode: dark:text-gray-400 */}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">{featuredImage?.caption || " "}</p>
            </div>
        </>
    );
}