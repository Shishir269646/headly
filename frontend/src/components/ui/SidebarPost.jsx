import Image from 'next/image';

export default function SidebarPost({ post }) {
    // Display a loading state if the post is not yet available
    if (!post) {
        return (
            <div className="animate-pulse flex gap-3">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="flex-1 space-y-2">
                    <div className="bg-gray-300 dark:bg-gray-700 h-4 w-full rounded"></div>
                    <div className="bg-gray-300 dark:bg-gray-700 h-4 w-3/4 rounded"></div>
                    <div className="bg-gray-300 dark:bg-gray-700 h-3 w-1/2 rounded"></div>
                </div>
            </div>
        );
    }

    const { title, slug, featuredImage, createdAt } = post;

    return (
        <div className="flex gap-3 group cursor-pointer">
            <a href={`/${slug}`} className="flex-shrink-0">
                <Image
                    src={featuredImage?.url || 'https://via.placeholder.com/80'}
                    alt={title}
                    width={80}
                    height={80}
                    loading="lazy"
                    className="w-16 sm:w-20 h-16 sm:h-20 object-cover rounded transition-transform duration-300 group-hover:scale-105"
                />
            </a>
            <div className="flex-1 min-w-0">
                <h5 className="font-semibold text-sm mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-tight dark:text-white line-clamp-2">
                    <a href={`/${slug}`}>{title}</a>
                </h5>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </span>
            </div>
        </div>
    );
}