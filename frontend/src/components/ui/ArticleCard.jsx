import { Clock } from 'lucide-react';
import Image from 'next/image';

export default function ArticleCard({ post }) {
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

    const { title, slug, excerpt, featuredImage, categories, author, createdAt, readTime } = post;

    return (
        <article className="group cursor-pointer bg-base-200 p-2 rounded-lg hover:shadow-lg transition-shadow">
            <div className="relative overflow-hidden rounded-lg mb-4">
                <a href={`/${slug}`}>
                    <Image
                        src={featuredImage?.url || 'https://via.placeholder.com/400x300'}
                        alt={title}
                        width={400}
                        height={300}
                        loading="lazy"
                        className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </a>
                {categories && categories.length > 0 && (
                    <span className="absolute top-3 left-3 bg-blue-600 dark:bg-blue-500 text-white px-3 py-1 rounded text-xs font-medium">
                        {categories[0]}
                    </span>
                )}
            </div>
            <h4 className="font-bold text-lg sm:text-xl mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-tight dark:text-white">
                <a href={`/${slug}`}>{title}</a>
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 leading-relaxed">
                {excerpt}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                {author && <span className="font-medium">{author.name}</span>}
                {author && <span>•</span>}
                <span>{new Date(createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {readTime} min read
                </span>
            </div>
        </article>
    );
}