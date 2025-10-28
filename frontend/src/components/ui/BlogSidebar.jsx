import PopularPostsWidget from './PopularPostsWidget';
import NewsletterWidget from './NewsletterWidget';

export default function BlogSidebar({ popularPosts, loading }) {
    return (
        <aside className="lg:col-span-1">
            <div className="sticky top-24">
                <PopularPostsWidget posts={popularPosts} loading={loading} />
                <NewsletterWidget />
            </div>
        </aside>
    );
}