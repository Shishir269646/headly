import { Eye } from 'lucide-react';

export default function TrendingPostCard({ post }) {
    const { title, slug, featuredImage, categories, author, createdAt, views } = post;

    return (
        <div className="group cursor-pointer border-b pb-3 flex items-start gap-4">
            <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
                <img
                    src={featuredImage?.url || 'https://via.placeholder.com/150'}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className="flex-1 min-w-0">
                {categories && categories.length > 0 && (
                    <span className="text-blue-600 dark:text-blue-400 text-xs font-medium mb-1 block">
                        {categories[0]}
                    </span>
                )}
                <h4 className="font-bold text-md mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-tight dark:text-white">
                    <a href={`/${slug}`}>{title}</a>
                </h4>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    {author && <span>{author.name}</span>}
                    {author && <span>•</span>}
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