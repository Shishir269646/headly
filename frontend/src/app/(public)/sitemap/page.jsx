'use client';

import React from 'react';
import { Map, Home, FileText, Users, Mail, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function SitemapPage() {
    const siteSections = [
        {
            icon: Home,
            title: 'Main Pages',
            links: [
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' }
            ]
        },
        {
            icon: FileText,
            title: 'Content',
            links: [
                { href: '/search', label: 'Search' },
                { href: '/archive', label: 'Archive' },
                { href: '/newsletter', label: 'Newsletter' }
            ]
        },
        {
            icon: Users,
            title: 'Resources',
            links: [
                { href: '/terms', label: 'Terms of Service' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/sitemap', label: 'Sitemap' }
            ]
        }
    ];

    const categories = [
        { href: '/category/technology', label: 'Technology' },
        { href: '/category/business', label: 'Business' },
        { href: '/category/design', label: 'Design' },
        { href: '/category/science', label: 'Science' },
        { href: '/category/lifestyle', label: 'Lifestyle' }
    ];

    const popularTags = [
        { href: '/tag/react', label: '#react' },
        { href: '/tag/javascript', label: '#javascript' },
        { href: '/tag/design', label: '#design' },
        { href: '/tag/innovation', label: '#innovation' },
        { href: '/tag/web-development', label: '#webdev' }
    ];

    const recentMonths = [
        { href: '/archive/2024/July', label: 'July 2024' },
        { href: '/archive/2024/June', label: 'June 2024' },
        { href: '/archive/2024/May', label: 'May 2024' }
    ];

    return (
        <div className="min-h-screen bg-base-100">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 py-16">
                <div className="container mx-auto px-4 max-w-6xl text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-content mb-6">
                        <Map className="w-10 h-10" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Site <span className="text-primary">Map</span>
                    </h1>
                    <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
                        Navigate through all our pages and content
                    </p>
                </div>
            </section>

            {/* Sitemap Content */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Main Sections */}
                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        {siteSections.map((section, index) => {
                            const Icon = section.icon;
                            return (
                                <div key={index} className="card bg-base-200 shadow-lg">
                                    <div className="card-body">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Icon className="w-6 h-6 text-primary" />
                                            <h2 className="card-title">{section.title}</h2>
                                        </div>
                                        <ul className="space-y-2">
                                            {section.links.map((link, linkIndex) => (
                                                <li key={linkIndex}>
                                                    <Link 
                                                        href={link.href}
                                                        className="link link-hover text-primary hover:text-primary-focus"
                                                    >
                                                        {link.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Categories */}
                    <div className="card bg-base-200 shadow-lg mb-8">
                        <div className="card-body">
                            <div className="flex items-center gap-3 mb-4">
                                <FileText className="w-6 h-6 text-secondary" />
                                <h2 className="text-2xl font-bold">Categories</h2>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {categories.map((category, index) => (
                                    <Link
                                        key={index}
                                        href={category.href}
                                        className="btn btn-outline btn-sm"
                                    >
                                        {category.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Popular Tags */}
                    <div className="card bg-base-200 shadow-lg mb-8">
                        <div className="card-body">
                            <div className="flex items-center gap-3 mb-4">
                                <FileText className="w-6 h-6 text-accent" />
                                <h2 className="text-2xl font-bold">Popular Tags</h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {popularTags.map((tag, index) => (
                                    <Link
                                        key={index}
                                        href={tag.href}
                                        className="badge badge-lg badge-outline"
                                    >
                                        {tag.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Archives */}
                    <div className="card bg-base-200 shadow-lg mb-8">
                        <div className="card-body">
                            <div className="flex items-center gap-3 mb-4">
                                <Calendar className="w-6 h-6 text-primary" />
                                <h2 className="text-2xl font-bold">Recent Archives</h2>
                            </div>
                            <div className="space-y-2">
                                {recentMonths.map((month, index) => (
                                    <Link
                                        key={index}
                                        href={month.href}
                                        className="block p-3 rounded-lg bg-base-100 hover:bg-base-300 transition-colors"
                                    >
                                        {month.label}
                                    </Link>
                                ))}
                            </div>
                            <div className="mt-4">
                                <Link href="/archive" className="btn btn-sm btn-primary">
                                    View All Archives
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Search Section */}
                    <div className="card bg-gradient-to-br from-primary/10 to-transparent shadow-xl">
                        <div className="card-body text-center">
                            <h2 className="text-2xl font-bold mb-4">Find What You're Looking For?</h2>
                            <p className="text-base-content/70 mb-6">
                                Use our search functionality to quickly find articles, topics, and more
                            </p>
                            <Link href="/search" className="btn btn-primary btn-lg">
                                Search Content
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

