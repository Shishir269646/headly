import { MessageSquare } from 'lucide-react';

export default function TrendingPostCard({
    category,
    title,
    author,
    date,
    comments,
    image
}) {
    return (
        <div className="group cursor-pointer border-b pb-3 flex items-start gap-4">
            <div className="relative w-36 h-36 flex-shrink-0 overflow-hidden rounded-full">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-1/2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                    {category}
                </span>
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xl mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-tight dark:text-white">
                    {title}
                </h4>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    <span>{author}</span>
                    <span>•</span>
                    <span>{date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {comments}
                    </span>
                </div>
            </div>
            
            
        </div>
    );
}