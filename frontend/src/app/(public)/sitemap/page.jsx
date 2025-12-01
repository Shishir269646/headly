'use client';

import React, { useState, useEffect } from 'react';
import { Map, Home, FileText, Users, Mail, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';
import axios from '@/libs/axios';
import { toast } from 'react-hot-toast';

export default function SitemapPage() {
    const [sitemapData, setSitemapData] = useState({
        categories: [],
        contents: [],
        popularTags: [],
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSitemapData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/sitemap');
                setSitemapData(response.data.data);
            } catch (error) {
                toast.error('Failed to fetch sitemap data.');
                console.error('Sitemap fetch error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSitemapData();
    }, []);

    const siteSections = [
        {
            icon: Home,
            title: 'Main Pages',
            links: [
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
                { href: '/newsletter', label: 'Newsletter' }
            ]
        },
        {
            icon: FileText,
            title: 'Content',
            links: [
                { href: '/search', label: 'Search' },
                { href: '/archive', label: 'Archive' },
                { href: '/sitemap', label: 'Sitemap' }
            ]
        },
        {
            icon: Users,
            title: 'User & Legal',
            links: [
                { href: '/terms', label: 'Terms of Service' },
                { href: '/privacy', label: 'Privacy Policy' },
                { href: '/login', label: 'Login' },
                { href: '/register', label: 'Register' },
            ]
        }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-100">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

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
                                {sitemapData.categories.map((category, index) => (
                                    <Link
                                        key={index}
                                        href={`/category/${category.slug}`}
                                        className="btn btn-outline btn-sm"
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Popular Tags */}
                    <div className="card bg-base-200 shadow-lg mb-8">
                        <div className="card-body">
                            <div className="flex items-center gap-3 mb-4">
                                <Tag className="w-6 h-6 text-accent" />
                                <h2 className="text-2xl font-bold">Popular Tags</h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {sitemapData.popularTags.map((tag, index) => (
                                    <Link
                                        key={index}
                                        href={`/tag/${tag.slug}`}
                                        className="badge badge-lg badge-outline"
                                    >
                                        {tag.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Contents */}
                    <div className="card bg-base-200 shadow-lg mb-8">
                        <div className="card-body">
                            <div className="flex items-center gap-3 mb-4">
                                <Calendar className="w-6 h-6 text-primary" />
                                <h2 className="text-2xl font-bold">Recent Contents</h2>
                            </div>
                            <div className="space-y-2">
                                {sitemapData.contents.map((content, index) => (
                                    <Link
                                        key={index}
                                        href={`/${content.slug}`}
                                        className="block p-3 rounded-lg bg-base-100 hover:bg-base-300 transition-colors"
                                    >
                                        {content.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    
                </div>
            </section>
        </div>
    );
}