'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useContent } from '@/hooks/useContent';
import ArticleCard from '@/components/ui/ArticleCard';

export default function AuthorContentPage() {
    const { authorId } = useParams();
    const { contents, loading, error, getContents } = useContent();

    useEffect(() => {
        if (authorId) {
            getContents({ author: authorId });
        }
    }, [authorId, getContents]);

    if (loading) {
        return <div className="min-h-screen w-full flex items-center justify-center dark:bg-gray-900 text-white">Loading content by author...</div>;
    }

    if (error) {
        return <div className="min-h-screen w-full flex items-center justify-center dark:bg-gray-900 text-red-500">Error: {error}</div>;
    }

    // Attempt to get author name from the first content item, if available
    const authorName = contents.length > 0 && contents[0].author?.name ? contents[0].author.name : 'Unknown Author';

    if (!contents || contents.length === 0) {
        return <div className="min-h-screen w-full flex items-center justify-center dark:bg-gray-900 text-gray-400">No content found by {authorName}.</div>;
    }

    return (
        <div className="min-h-screen w-full dark:bg-gray-900 mx-auto px-4 py-8 max-w-7xl">
            <h1 className="text-3xl sm:text-4xl font-bold mb-8 pb-4 border-b-2 border-blue-600 dark:border-blue-500 dark:text-white">
                Articles by: <span className="text-blue-600 dark:text-blue-400">{authorName}</span>
            </h1>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {contents.map((post) => (
                    <ArticleCard key={post._id} post={post} />
                ))}
            </div>
        </div>
    );
}
