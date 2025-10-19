"use client";
import React from 'react';
import { Facebook, Twitter, Linkedin, Link2 } from 'lucide-react';

/**
 * Displays the main article content, tags, and share buttons.
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The main prose content of the article.
 * @param {Array<string>} props.tags - List of article tags.
 */
export default function ArticleBody({ children, tags }) {
    return (
        <>
            {/* Article Body Content */}
            {/* Dark mode: prose-invert handles dark mode for the prose content */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
                {children}
            </div>

            {/* Tags */}
            {/* Dark mode: dark:border-gray-700, dark:text-gray-300, dark:badge-neutral */}
            <div className="mt-8 pt-6 border-t dark:border-gray-700">
                <div className="flex flex-wrap gap-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mr-2">Tags:</span>
                    {tags.map((tag) => (
                        <span key={tag} className="badge badge-outline border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Share Buttons */}
            {/* Dark mode: dark:border-gray-700, dark:text-gray-300, dark:hover:bg-gray-800 */}
            <div className="mt-8 pt-6 border-t dark:border-gray-700">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Share:</span>
                    <button className="btn btn-circle btn-sm btn-ghost hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Facebook size={20} className="text-blue-600" />
                    </button>
                    <button className="btn btn-circle btn-sm btn-ghost hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Twitter size={20} className="text-sky-500" />
                    </button>
                    <button className="btn btn-circle btn-sm btn-ghost hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Linkedin size={20} className="text-blue-700" />
                    </button>
                    <button className="btn btn-circle btn-sm btn-ghost hover:bg-gray-100 dark:hover:bg-gray-800">
                        <Link2 size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                </div>
            </div>
        </>
    );
}