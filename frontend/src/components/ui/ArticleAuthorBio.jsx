"use client";
import React from 'react';
import { Twitter, Linkedin } from 'lucide-react';

/**
 * Displays the article author's biography.
 * @param {Object} props - Component props.
 * @param {string} props.name - Author's name.
 * @param {string} props.bio - Author's biography.
 * @param {string} props.avatarUrl - URL for the author's profile picture.
 * @param {string} [props.twitterUrl] - Optional Twitter link.
 * @param {string} [props.linkedinUrl] - Optional LinkedIn link.
 */
export default function ArticleAuthorBio({
    name,
    bio,
    avatarUrl,
    twitterUrl,
    linkedinUrl,
}) {
    return (
        // Dark mode: dark:bg-gray-800, dark:shadow-xl
        <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-md dark:bg-gray-800">
            <div className="flex items-start gap-4">
                <div className="avatar shrink-0">
                    <div className="w-20 rounded-full ring ring-blue-500 ring-offset-2 ring-offset-gray-50 dark:ring-offset-gray-800">
                        <img src={avatarUrl} alt={`${name}'s avatar`} />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    {/* Dark mode: dark:text-white */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{name}</h3>
                    {/* Dark mode: dark:text-gray-400 */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {bio}
                    </p>
                    <div className="flex gap-2">
                        {twitterUrl && (
                            <a href={twitterUrl} className="btn btn-xs btn-ghost text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400" aria-label={`Twitter profile for ${name}`}>
                                <Twitter size={14} />
                            </a>
                        )}
                        {linkedinUrl && (
                            <a href={linkedinUrl} className="btn btn-xs btn-ghost text-gray-500 hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-500" aria-label={`LinkedIn profile for ${name}`}>
                                <Linkedin size={14} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}