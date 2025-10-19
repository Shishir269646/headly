import PopularPostsWidget from './PopularPostsWidget';
import NewsletterWidget from './NewsletterWidget';

export default function BlogSidebar({ popularPosts }) {
    return (
        <aside className="lg:col-span-1">
            <div className="sticky top-24">
                <PopularPostsWidget posts={popularPosts} />
                <NewsletterWidget />
            </div>
        </aside>
    );
}