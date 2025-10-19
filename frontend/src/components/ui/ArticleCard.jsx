import { MessageSquare } from 'lucide-react';

export default function ArticleCard({
    category,
    title,
    excerpt,
    author,
    date,
    comments,
    image
}) {
    return (
        <article className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-blue-600 dark:bg-blue-500 text-white px-3 py-1 rounded text-xs font-medium">
                    {category}
                </span>
            </div>
            <h4 className="font-bold text-lg sm:text-xl mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-tight dark:text-white">
                {title}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 leading-relaxed">
                {excerpt}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="font-medium">{author}</span>
                <span>•</span>
                <span>{date}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {comments}
                </span>
            </div>
        </article>
    );
}