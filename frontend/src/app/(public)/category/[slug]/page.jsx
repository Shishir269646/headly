'use client';

import { useEffect } from 'react';
import { useContent } from '@/hooks/useContent';
import ArticleCard from '@/components/ui/ArticleCard';
import { notFound } from 'next/navigation';

export default function CategoryPage({ params }) {
    const { slug } = params;
    const { contents, pagination, loading, error, getContents } = useContent({ category: slug });

    useEffect(() => {
        if (slug) {
            getContents({ page: 1, limit: 10, category: slug });
        }
    }, [slug, getContents]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        // This could be a 404 if the category doesn't exist, or another server error
        if (error.response?.status === 404) {
            notFound();
        }
        return <div className="text-center text-red-500">Error loading content for this category.</div>;
    }
    
    const categoryName = contents[0]?.category?.name || slug.replace(/-/g, ' ');

    return (
        <div className="dark:bg-gray-900 min-h-screen mx-auto px-4 py-8 max-w-7xl">
            <header className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white capitalize">
                    Category: {categoryName}
                </h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                    Showing {pagination.total} article(s) in this category.
                </p>
            </header>

            {contents.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contents.map((post) => (
                        <ArticleCard key={post._id} post={post} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">No Articles Found</h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">There are currently no articles in the "{categoryName}" category.</p>
                </div>
            )}

            {/* TODO: Add pagination controls if pagination.pages > 1 */}
        </div>
    );
}
