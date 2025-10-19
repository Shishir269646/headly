"use client";
import React from 'react';

/**
 * Displays a list of comments for the article.
 * @param {Object} props - Component props.
 * @param {number} props.totalComments - The total number of comments.
 * @param {Array<Object>} props.comments - Array of comment objects.
 * @param {string} props.comments[].id - Unique comment ID.
 * @param {string} props.comments[].author - Commenter's name.
 * @param {string} props.comments[].avatarUrl - Commenter's avatar URL.
 * @param {string} props.comments[].timestamp - Relative timestamp (e.g., '2 days ago').
 * @param {string} props.comments[].content - The comment text.
 */
export default function ArticleCommentSection({ totalComments, comments }) {
    return (
        <div className="mt-12">
            {/* Dark mode: dark:text-white */}
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{totalComments} Comments</h3>
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg shadow-sm dark:bg-gray-800">
                        {/* Avatar */}
                        <div className="avatar shrink-0">
                            <div className="w-12 rounded-full">
                                <img src={comment.avatarUrl} alt={comment.author} />
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                {/* Dark mode: dark:text-white */}
                                <span className="font-semibold text-gray-900 dark:text-white">{comment.author}</span>
                                {/* Dark mode: dark:text-gray-400 */}
                                <span className="text-sm text-gray-500 dark:text-gray-400">{comment.timestamp}</span>
                            </div>
                            {/* Dark mode: dark:text-gray-300 */}
                            <p className="text-gray-700 dark:text-gray-300 text-sm">
                                {comment.content}
                            </p>
                            <button className="btn btn-xs btn-ghost mt-2 text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-blue-400">Reply</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}