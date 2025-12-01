"use client";
import React from 'react';
import Link from 'next/link';

export default function ArticleBreadcrumb({ homePath = '/', category, articleTitle }) {
    const items = [];

    // Always start with Home
    items.push({ label: 'Home', href: homePath, isCurrent: false });

    // Add Category if provided
    if (category && category.slug && category.name) {
        items.push({ label: category.name, href: `/category/${category.slug}`, isCurrent: false });
    }

    // Add Article Title as the current item
    if (articleTitle) {
        items.push({ label: articleTitle, isCurrent: true });
    } else if (items.length > 0) {
        // If no article title but there are other items, make the last one current
        items[items.length - 1].isCurrent = true;
    }

    // Generate JSON-LD for SEO
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.label,
            "item": item.isCurrent ? undefined : item.href
        }))
    };

    return (
        <div className="bg-base-200 border-b">
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
                <div className="text-sm breadcrumbs">
                    <ul>
                        {items.map((item, index) => (
                            <li key={index}>
                                {item.isCurrent ? (
                                    <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                                ) : (
                                    <Link href={item.href} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                        {item.label}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}