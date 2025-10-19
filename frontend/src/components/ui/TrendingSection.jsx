"use client";

import { TrendingUp } from 'lucide-react';
import TrendingPostCard from './TrendingPostCard';

export default function TrendingSection({ posts }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-red-500 dark:text-red-400" />
                <h3 className="text-xl font-bold dark:text-white">Trending Now</h3>
            </div>
            {posts.map((post, index) => (
                <TrendingPostCard key={index} {...post} />
            ))}
        </div>
    );
}