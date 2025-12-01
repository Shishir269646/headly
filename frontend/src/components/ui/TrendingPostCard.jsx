import Link from 'next/link';
import { Eye } from 'lucide-react';
import Image from 'next/image';
import { generateSlug } from '../../libs/utils'; // Import generateSlug

export default function TrendingPostCard({ post, allCategories = [], allAuthors = [] }) {
    const { title, slug, featuredImage, category, author, createdAt, views } = post; // Changed from categories to category for consistency

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
            
            displayCategoryName = category;
            displayCategorySlug = generateSlug(category);
        }
    } else if (post.categories && post.categories.length > 0) {
        const categoryItem = post.categories[0];
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
        <div className="group cursor-pointer border-b pb-3 flex items-start gap-4">
            <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                <Link href={`/${slug}`}>
                    <Image
                        src={featuredImage?.url || 'https://via.placeholder.com/150'}
                        alt={title}
                        width={150}
                        height={150}
                        loading="lazy"
                        unoptimized
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </Link>
            </div>
            <div className="flex-1 min-w-0">
                {displayCategoryName && displayCategorySlug && (
                    <Link href={`/categories/${displayCategorySlug}`} className="text-blue-600 dark:text-blue-400 text-xs font-medium mb-1 block">
                        {displayCategoryName}
                    </Link>
                )}
                <h4 className="font-bold text-md mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-tight dark:text-white">
                    <Link href={`/${slug}`}>{title}</Link>
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    {displayAuthorName && displayAuthorId && (
                        <Link href={`/authors/${displayAuthorId}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                            {displayAuthorName}
                        </Link>
                    )}
                    {displayAuthorName && <span>•</span>}
                    <span>{new Date(createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {views}
                    </span>
                </div>
            </div>
        </div>
    );
}