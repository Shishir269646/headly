"use client";
import React, { useState } from 'react';
import { Facebook, Twitter, Linkedin, Link2, Check } from 'lucide-react';

// A simple utility to copy text
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        const a = document.createElement('textarea');
        a.value = text;
        a.select();
        document.execCommand('copy');
        a.remove();
    }
}

export default function ArticleBody({ children, tags, title, url }) {
    const [copied, setCopied] = useState(false);

    // Encode text for use in a URL
    const encodedTitle = encodeURIComponent(title || '');
    const encodedUrl = encodeURIComponent(url || '');

    const handleCopy = () => {
        copyToClipboard(url);
        setCopied(true);
        // Reset the icon after 2 seconds
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            {/* Article Body Content */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
                {children}
            </div>

            {/* Tags */}
            {tags && tags.length > 0 && (
                <div className="mt-8 pt-6 border-t dark:border-gray-700 dark:bg-gray-900">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-base-content mr-2">
                            Tags:
                        </span>
                        {tags.map((tag) => (
                            <a
                                href={`/tags/${tag}`} // Make tags functional links
                                key={tag}
                                className="badge badge-outline border-gray-300 text-base-content transition-colors no-underline hover:no-underline"
                            >
                                {tag}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Share Buttons */}
            <div className="mt-8 pt-6 border-t dark:border-gray-700">
                <div className="flex flex-wrap items-center gap-4">
                    <span className="text-sm font-semibold text-base-content">
                        Share:
                    </span>
                    {/* Use <a> tags for social links */}
                    <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-circle btn-sm btn-ghost hover:bg-gray-100 dark:hover:bg-gray-800"
                        aria-label="Share on Facebook"
                    >
                        <Facebook size={20} className="text-blue-600" />
                    </a>
                    <a
                        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-circle btn-sm btn-ghost hover:bg-gray-100 dark:hover:bg-gray-800"
                        aria-label="Share on Twitter"
                    >
                        <Twitter size={20} className="text-sky-500" />
                    </a>
                    <a
                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-circle btn-sm btn-ghost hover:bg-gray-100 dark:hover:bg-gray-800"
                        aria-label="Share on LinkedIn"
                    >
                        <Linkedin size={20} className="text-blue-700" />
                    </a>
                    {/* Use <button> for the copy action */}
                    <button
                        onClick={handleCopy}
                        className="btn btn-circle btn-sm btn-ghost hover:bg-gray-100 dark:hover:bg-gray-800"
                        aria-label="Copy link"
                    >
                        {copied ? (
                            <Check size={20} className="text-green-500" />
                        ) : (
                            <Link2 size={20} className="text-gray-600 dark:text-gray-400" />
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}