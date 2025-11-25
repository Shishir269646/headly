"use client";
import React from 'react';
import { Clock, User, MessageSquare } from 'lucide-react';
import Image from 'next/image';

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
        <div className="dark:bg-gray-900">

            {/* Category Badge */}
            <div className="mb-4">

                <span className="badge badge-primary badge-lg">
                    {category?.name.toUpperCase() || 'UNCATEGORIZED'}
                </span>
            </div>

            {/* Article Title */}
            <h1 className="text-4xl md:text-5xl font-extrabold dark:text-white mb-6 leading-tight">
                {title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm dark:text-gray-200 mb-6 pb-6 border-b dark:border-gray-700">
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
                <Image
                    src={featuredImage?.url}
                    alt={featuredImage?.alt || 'Featured Image'}
                    width={1200}
                    height={600}
                    loading="lazy"
                    className="w-full h-auto rounded-lg shadow-xl"
                />

                {featuredImage?.caption && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
                        {featuredImage.caption}
                    </p>
                )}
            </div>
        </div>
    );
}