'use client';
import NewsletterForm from './NewsletterForm';

export default function NewsletterWidget() {
    return (
        <div className="bg-base-200 rounded-lg p-6">
            <NewsletterForm source="sidebar-widget" />
        </div>
    );
}