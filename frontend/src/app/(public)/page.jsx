"use client";


import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContents } from "@/store/slices/contentSlice";

import FeaturedContentGrid from "@/components/ui/FeaturedContentGrid";
import TrendingSection from '@/components/ui/TrendingSection';
import ArticleCard from '@/components/ui/ArticleCard';
import BlogSidebar from '@/components/ui/BlogSidebar';
import TechBlogPage from "@/components/ui/TechBlogPage";
import ContentForm from "@/components/content/ContentForm";




export default function Home() {

    const dispatch = useDispatch();

    const { contents, loading, error } = useSelector((state) => state.content);

    useEffect(() => {
        // Page load হলে data আনো
        dispatch(fetchContents());
    }, [dispatch]);

    console.log("contents :", contents)

    const trendingPosts = [
        {
            category: 'Gadgets',
            title: 'Top 10 Smart Home Devices for 2025',
            author: 'Sarah Johnson',
            date: 'Oct 3, 2025',
            comments: 45,
            image: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400&h=300&fit=crop'
        },
        {
            category: 'Reviews',
            title: 'Smartphone Camera Comparison: Flagship Edition',
            author: 'Mike Chen',
            date: 'Oct 2, 2025',
            comments: 67,
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop'
        },
        {
            category: 'Gaming',
            title: 'Next-Gen Console Wars: A Comprehensive Analysis',
            author: 'Emily Davis',
            date: 'Oct 1, 2025',
            comments: 89,
            image: 'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?w=400&h=300&fit=crop'
        }
    ];

    const latestPosts = [
        {
            category: 'Software',
            title: 'Best Productivity Apps for Remote Workers',
            excerpt: 'Discover the essential tools that can boost your productivity while working from home.',
            author: 'Alex Brown',
            date: 'Oct 4, 2025',
            comments: 12,
            image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop'
        },
        {
            category: 'Security',
            title: 'Protecting Your Privacy in the Digital Age',
            excerpt: 'Essential tips and strategies to keep your personal data safe online.',
            author: 'Lisa Wang',
            date: 'Oct 3, 2025',
            comments: 34,
            image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop'
        },
        {
            category: 'Innovation',
            title: 'Breakthrough in Quantum Computing Technology',
            excerpt: 'Scientists achieve major milestone that could revolutionize computing.',
            author: 'David Park',
            date: 'Oct 3, 2025',
            comments: 56,
            image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop'
        },
        {
            category: 'Mobile',
            title: 'The Evolution of 5G and What Comes Next',
            excerpt: 'How next-generation networks will change connectivity forever.',
            author: 'Rachel Green',
            date: 'Oct 2, 2025',
            comments: 28,
            image: 'https://images.unsplash.com/photo-1573164713619-24c711fe7878?w=400&h=300&fit=crop'
        }
    ];

    const sidebarPosts = [
        {
            title: 'Electric Vehicles: The Road Ahead',
            date: 'Oct 4, 2025',
            image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=200&h=150&fit=crop'
        },
        {
            title: 'Cloud Computing Best Practices',
            date: 'Oct 3, 2025',
            image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=200&h=150&fit=crop'
        },
        {
            title: 'Wearable Tech: Health Monitoring',
            date: 'Oct 3, 2025',
            image: 'https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=200&h=150&fit=crop'
        },
        {
            title: 'Blockchain Beyond Cryptocurrency',
            date: 'Oct 2, 2025',
            image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&h=150&fit=crop'
        }
    ];


    return (
        <div className="dark:bg-gray-900 min-h-screen mx-auto px-4 py-8 max-w-7xl">
            {/* Featured Section */}
            <div className="grid lg:grid-cols-3 gap-6 mb-12">
                {/* Large Featured Post */}
                <div className="lg:col-span-2">
                    <FeaturedContentGrid />
                </div>

                {/* Trending Posts */}
                <TrendingSection posts={trendingPosts} />
            </div>

            {/* Latest Posts Section */}
            <div className="grid lg:grid-cols-4 gap-8">
                {/* Main Posts Grid */}
                <div className="lg:col-span-3">
                    <h3 className="text-xl sm:text-2xl font-bold mb-6 pb-3 border-b-2 border-blue-600 dark:border-blue-500 dark:text-white">
                        Latest Articles
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                        {latestPosts.map((post, index) => (
                            <ArticleCard key={index} {...post} />
                        ))}
                    </div>
                </div>

                {/* Sidebar */}
                <BlogSidebar popularPosts={sidebarPosts} />
            </div>

            <ContentForm />

            <TechBlogPage />
        </div>
    );
}