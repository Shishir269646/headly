import SidebarPost from './SidebarPost';

export default function PopularPostsWidget({ posts, loading }) {
    return (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 sm:p-6 mb-6">
            <h3 className="text-lg sm:text-xl font-bold mb-4 pb-2 border-b border-gray-200 dark:border-gray-700 dark:text-white">
                Popular Posts
            </h3>
            <div className="space-y-4">
                {loading ? (
                    [...Array(3)].map((_, index) => <SidebarPost key={index} />)
                ) : (
                    posts.map((post) => (
                        <SidebarPost key={post._id} post={post} />
                    ))
                )}
            </div>
        </div>
    );
}