'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Clock, User, Calendar } from 'lucide-react';
import ArticleCard from '@/components/ui/ArticleCard';

function SearchPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        performSearch(searchQuery);
    };

    const performSearch = async (query) => {
        setLoading(true);
        setHasSearched(true);
        
        // Mock search results - replace with actual API call
        setTimeout(() => {
            const mockResults = [
                {
                    _id: '1',
                    title: `Search Result: ${query}`,
                    slug: 'example-post',
                    excerpt: 'This is a search result matching your query...',
                    featuredImage: { url: 'https://via.placeholder.com/400x300' },
                    author: { name: 'John Doe' },
                    createdAt: new Date(),
                    readTime: 5,
                    categories: ['Technology']
                },
                // Add more mock results as needed
            ];
            
            setResults(mockResults);
            setLoading(false);
        }, 1000);
    };

    useEffect(() => {
        const q = searchParams.get('q');
        if (q) {
            setSearchQuery(q);
            performSearch(q);
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-base-100">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
                        Search Content
                    </h1>
                    
                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="mb-8">
                        <div className="join w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search articles, topics, authors..."
                                className="input input-bordered input-lg w-full join-item focus:outline-none"
                            />
                            <button type="submit" className="btn btn-primary btn-lg join-item">
                                <Search className="w-6 h-6" />
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Results Section */}
            <section className="py-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    {loading ? (
                        <div className="text-center py-12">
                            <span className="loading loading-spinner loading-lg text-primary"></span>
                            <p className="mt-4 text-base-content/70">Searching...</p>
                        </div>
                    ) : hasSearched ? (
                        <>
                            {/* Results Header */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold mb-2">
                                    Search Results
                                </h2>
                                <p className="text-base-content/70">
                                    Found {results.length} result{results.length !== 1 ? 's' : ''} for "{searchQuery}"
                                </p>
                            </div>

                            {/* Results */}
                            {results.length > 0 ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {results.map((post) => (
                                        <ArticleCard key={post._id} post={post} />
                                    ))}
                                </div>
                            ) : (
                                <div className="card bg-base-200 shadow-lg">
                                    <div className="card-body text-center py-12">
                                        <Search className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
                                        <h3 className="text-2xl font-bold mb-2">No Results Found</h3>
                                        <p className="text-base-content/70 mb-6">
                                            We couldn't find any articles matching your search.
                                        </p>
                                        <div className="space-y-2 text-sm">
                                            <p className="font-semibold">Suggestions:</p>
                                            <ul className="space-y-1">
                                                <li>• Check your spelling</li>
                                                <li>• Try different keywords</li>
                                                <li>• Use more general terms</li>
                                                <li>• Browse our categories instead</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="card bg-base-200 shadow-lg">
                            <div className="card-body text-center py-12">
                                <Search className="w-16 h-16 mx-auto mb-4 text-primary" />
                                <h3 className="text-2xl font-bold mb-2">Start Your Search</h3>
                                <p className="text-base-content/70">
                                    Enter keywords in the search box above to find articles, topics, and more.
                                </p>
                                
                                {/* Popular Searches */}
                                <div className="mt-8">
                                    <p className="font-semibold mb-4">Popular Searches:</p>
                                    <div className="flex flex-wrap justify-center gap-2">
                                        {['Technology', 'Business', 'Design', 'Science', 'Lifestyle'].map((tag) => (
                                            <button
                                                key={tag}
                                                onClick={() => setSearchQuery(tag)}
                                                className="btn btn-sm btn-ghost"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchPageContent />
        </Suspense>
    );
}