export default function SidebarPost({ title, date, image }) {
    return (
        <div className="flex gap-3 group cursor-pointer">
            <img
                src={image}
                alt={title}
                className="w-16 sm:w-20 h-16 sm:h-20 object-cover rounded flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex-1 min-w-0">
                <h5 className="font-semibold text-sm mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition leading-tight dark:text-white line-clamp-2">
                    {title}
                </h5>
                <span className="text-xs text-gray-500 dark:text-gray-400">{date}</span>
            </div>
        </div>
    );
}