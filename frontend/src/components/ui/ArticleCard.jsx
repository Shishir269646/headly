import Link from 'next/link';
import { Clock } from 'lucide-react';
import Image from 'next/image';
import { generateSlug } from '../../libs/utils';

export default function ArticleCard({ post, priority = false, allCategories = [], allAuthors = [] }) {
    // Display a loading state if the post is not yet available
    if (!post) {
        return (
            <article className="animate-pulse">
                <div className="relative overflow-hidden rounded-lg mb-4 bg-gray-300 dark:bg-gray-700 h-48 sm:h-56 md:h-64"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-4 w-1/4 mb-2 rounded"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-6 w-3/4 mb-3 rounded"></div>
                <div className="bg-gray-300 dark:bg-gray-700 h-4 w-full mb-3 rounded"></div>
                <div className="flex items-center gap-3 text-xs">
                    <div className="bg-gray-300 dark:bg-gray-700 h-4 w-16 rounded"></div>
                    <div className="bg-gray-300 dark:bg-gray-700 h-4 w-16 rounded"></div>
                    <div className="bg-gray-300 dark:bg-gray-700 h-4 w-16 rounded"></div>
                </div>
            </article>
        );
    }

    const { title, slug, excerpt, featuredImage, category, author, createdAt, readTime, tags } = post;

    // Resolve category details
    let displayCategoryName = '';
    let displayCategorySlug = '';
    if (typeof category === 'object' && category !== null) {
        displayCategoryName = category.name;
        displayCategorySlug = category.slug;
    } else if (typeof category === 'string') {
        const foundCategory = allCategories.find(cat => cat._id === category || cat.name === category);
        if (foundCategory) {
            displayCategoryName = foundCategory.name;
            displayCategorySlug = foundCategory.slug;
        } else {
            // Fallback if not found in allCategories (e.g., if category is a raw name string)
            displayCategoryName = category;
            displayCategorySlug = generateSlug(category);
        }
    }

    // Resolve author details
    let displayAuthorName = '';
    let displayAuthorId = '';
    if (typeof author === 'object' && author !== null) {
        displayAuthorName = author.name;
        displayAuthorId = author._id;
    } else if (typeof author === 'string') {
        const foundAuthor = allAuthors.find(auth => auth._id === author);
        if (foundAuthor) {
            displayAuthorName = foundAuthor.name;
            displayAuthorId = foundAuthor._id;
        } else {
            // Fallback if not found in allAuthors
            displayAuthorName = 'Unknown Author';
            displayAuthorId = author; // Still use the ID for the link if available
        }
    }
    
    return (
        <article className="group cursor-pointer bg-base-200 p-2 rounded-lg hover:shadow-lg transition-shadow">
            <div className="relative overflow-hidden rounded-lg mb-4">
                <Link href={`/${slug}`}>
                    <Image
                        src={featuredImage?.url || 'https://via.placeholder.com/400x300'}
                        alt={title}
                        width={400}
                        height={300}
                        priority={priority}
                        unoptimized
                        className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </Link>
                {displayCategoryName && displayCategorySlug && (
                    <Link href={`/categories/${displayCategorySlug}`} className="absolute top-3 left-3 bg-blue-600 dark:bg-blue-500 text-white px-3 py-1 rounded text-xs font-medium">
                        {displayCategoryName}
                    </Link>
                )}
            </div>
            <h4 className="font-bold text-lg sm:text-xl mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-tight dark:text-white">
                <Link href={`/${slug}`}>{title}</Link>
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 leading-relaxed">
                {excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                {displayAuthorName && displayAuthorId && (
                    <Link href={`/authors/${displayAuthorId}`} className="font-medium hover:text-blue-600 dark:hover:text-blue-400">
                        {displayAuthorName}
                    </Link>
                )}
                {displayAuthorName && <span>•</span>}
                <span>{new Date(createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {readTime} min read
                </span>
            </div>
            {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                        <Link key={tag} href={`/tags/${generateSlug(tag)}`} className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                            #{tag}
                        </Link>
                    ))}
                </div>
            )}
        </article>
    );
}