"use client";
import React from 'react';
import Image from 'next/image';


export default function ArticleAuthorBio({
    name,
    bio,
    avatarUrl,
}) {
    return (
        // Dark mode: dark:bg-gray-800, dark:shadow-xl
        <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-md dark:bg-gray-800">
            <div className="flex items-start gap-4">
                <div className="avatar shrink-0">
                    <div className="w-20 rounded-full ring ring-blue-500 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-800">
                        <Image src={avatarUrl} alt={`${name}'s avatar`} width={80} height={80} loading="lazy" />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    {/* Dark mode: dark:text-white */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{name}</h3>
                    {/* Dark mode: dark:text-gray-400 */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {bio}
                    </p>

                </div>
            </div>
        </div>
    );
}