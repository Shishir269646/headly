"use client";

import { TrendingUp } from 'lucide-react';
import TrendingPostCard from './TrendingPostCard';

export default function TrendingSection({ posts, allCategories = [], allAuthors = [] }) {
    // Display a loading state if posts are not yet available
    if (!posts || posts.length === 0) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-red-500 dark:text-red-400" />
                    <h3 className="text-xl font-bold dark:text-white">Trending Now</h3>
                </div>
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="animate-pulse flex items-start gap-4">
                        <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                            <div className="bg-gray-300 dark:bg-gray-700 h-4 w-1/4 rounded"></div>
                            <div className="bg-gray-300 dark:bg-gray-700 h-6 w-3/4 rounded"></div>
                            <div className="bg-gray-300 dark:bg-gray-700 h-4 w-1/2 rounded"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-red-500 dark:text-red-400" />
                <h3 className="text-xl font-bold dark:text-white">Trending Now</h3>
            </div>
            {posts.map((post) => (
                <TrendingPostCard key={post._id} post={post} allCategories={allCategories} allAuthors={allAuthors} />
            ))}
        </div>
    );
}