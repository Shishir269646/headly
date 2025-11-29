"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; // Import Link
import { generateSlug } from '../../libs/utils'; // Import generateSlug

const FeaturedContentGrid = ({ posts, allCategories = [], allAuthors = [] }) => {
    // Display a loading state if posts are not yet available
    if (!posts || posts.length === 0) {
        return (
            <div className="animate-pulse">
                <div className="relative overflow-hidden rounded-lg shadow-xl h-[600px] dark:bg-gray-900">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                        <div className="space-y-4">
                            <div className="bg-gray-400 dark:bg-gray-600 h-6 w-24 rounded-md"></div>
                            <div className="bg-gray-400 dark:bg-gray-600 h-8 w-3/4 rounded-md"></div>
                            <div className="flex items-center gap-4">
                                <div className="bg-gray-400 dark:bg-gray-600 h-8 w-8 rounded-full"></div>
                                <div className="bg-gray-400 dark:bg-gray-600 h-4 w-20 rounded-md"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Use the first post from the array as the featured post
    const featuredPost = posts[0];

    // Resolve category details
    let displayCategoryName = '';
    let displayCategorySlug = '';
    if (typeof featuredPost.category === 'object' && featuredPost.category !== null) {
        displayCategoryName = featuredPost.category.name;
        displayCategorySlug = featuredPost.category.slug;
    } else if (typeof featuredPost.category === 'string') {
        const foundCategory = allCategories.find(cat => cat._id === featuredPost.category || cat.name === featuredPost.category);
        if (foundCategory) {
            displayCategoryName = foundCategory.name;
            displayCategorySlug = foundCategory.slug;
        } else {
            // Fallback if not found in allCategories (e.g., if category is a raw name string)
            displayCategoryName = featuredPost.category;
            displayCategorySlug = generateSlug(featuredPost.category);
        }
    } else if (featuredPost.categories && featuredPost.categories.length > 0) { // For old `categories` array if still present
        const categoryItem = featuredPost.categories[0];
        if (typeof categoryItem === 'object' && categoryItem !== null) {
             displayCategoryName = categoryItem.name;
             displayCategorySlug = categoryItem.slug;
        } else if (typeof categoryItem === 'string') {
            const foundCategory = allCategories.find(cat => cat._id === categoryItem || cat.name === categoryItem);
            if (foundCategory) {
                displayCategoryName = foundCategory.name;
                displayCategorySlug = foundCategory.slug;
            } else {
                displayCategoryName = categoryItem;
                displayCategorySlug = generateSlug(categoryItem);
            }
        }
    }


    // Resolve author details
    let displayAuthorName = '';
    let displayAuthorId = '';
    let displayAuthorSlug = '';
    let displayAuthorImage = featuredPost.author?.image?.url;

    if (typeof featuredPost.author === 'object' && featuredPost.author !== null) {
        displayAuthorName = featuredPost.author.name;
        displayAuthorId = featuredPost.author._id;
        // Assuming author object has a slug, if not, create one from name
        displayAuthorSlug = featuredPost.author.slug || generateSlug(featuredPost.author.name);
        displayAuthorImage = featuredPost.author.image?.url;
    } else if (typeof featuredPost.author === 'string') {
        const foundAuthor = allAuthors.find(auth => auth._id === featuredPost.author);
        if (foundAuthor) {
            displayAuthorName = foundAuthor.name;
            displayAuthorId = foundAuthor._id;
            displayAuthorSlug = foundAuthor.slug || generateSlug(foundAuthor.name);
            displayAuthorImage = foundAuthor.image?.url;
        } else {
            // Fallback if not found in allAuthors
            displayAuthorName = 'Unknown Author';
            displayAuthorId = featuredPost.author;
            displayAuthorSlug = generateSlug('Unknown Author'); // Placeholder slug
            displayAuthorImage = null;
        }
    }

    return (
        <section className="mb-8 px-4 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="relative group">
                    {/* Main Featured Article */}
                    <article className="relative overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 h-[600px]">
                        {/* Background Image with Overlay */}
                        <div className="absolute inset-0">
                            <Image
                                src={featuredPost.featuredImage?.url || 'https://via.placeholder.com/800x600'}
                                alt={featuredPost.title}
                                width={800}
                                height={600}
                                priority
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        </div>

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                            <div className="space-y-4">
                                {/* Category Badge */}
                                {displayCategoryName && displayCategorySlug && (
                                    <div className="flex items-center gap-2">
                                        <Link href={`/categories/${displayCategorySlug}`} className="bg-blue-500 text-white px-4 py-1.5 rounded-md text-sm font-normal uppercase tracking-wider hover:opacity-90 transition-opacity">
                                            {displayCategoryName}
                                        </Link>
                                    </div>
                                )}

                                {/* Title */}
                                <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight hover:text-gray-200 transition-colors">
                                    <Link href={`/${featuredPost.slug}`} className="block">
                                        {featuredPost.title}
                                    </Link>
                                </h2>

                                {/* Meta Information */}
                                <div className="flex items-center gap-4 text-gray-200">
                                    {/* Author */}
                                    {displayAuthorName && displayAuthorId && (
                                        <div className="flex items-center gap-2">
                                            {displayAuthorImage && (
                                                <Image
                                                    src={displayAuthorImage}
                                                    alt={displayAuthorName}
                                                    width={40}
                                                    height={40}
                                                    loading="lazy"
                                                    unoptimized
                                                    className="w-8 h-8 rounded-full border-2 border-white/50"
                                                />
                                            )}
                                            <Link
                                                href={`/authors/${displayAuthorId}`}
                                                className="text-sm font-medium hover:text-white transition-colors"
                                            >
                                                {displayAuthorName}
                                            </Link>
                                        </div>
                                    )}

                                    {/* Separator */}
                                    {displayAuthorName && <span>•</span>}

                                    {/* Date */}
                                    <time className="text-sm">
                                        {new Date(featuredPost.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </time>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
};

export default FeaturedContentGrid;