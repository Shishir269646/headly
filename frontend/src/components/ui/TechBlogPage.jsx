"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContentById } from "@/store/slices/contentSlice";
import { useParams } from "next/navigation";
import ArticleBreadcrumb from './ArticleBreadcrumb';
import ArticleHeader from './ArticleHeader';
import ArticleBody from './ArticleBody';
import ArticleAuthorBio from './ArticleAuthorBio';
import ArticleCommentSection from './ArticleCommentSection';
import Sidebar from './Sidebar';

// --- Mock Data for the Article ---
const breadcrumbItems = [
    { label: 'Home', href: '#', isCurrent: false },
    { label: 'Technology', href: '#', isCurrent: false },
    { label: 'Tablet PC Market', href: '#', isCurrent: true },
];

const articleDetails = {
    category: 'Technology',
    title: 'Tablet PC Market to Witness Exponential Growth by 2028, Sources Say',
    author: 'Shane Doe',
    authorHref: '#',
    date: 'March 15, 2024',
    commentCount: 24,
    imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200&h=675&fit=crop',
    imageAlt: 'Tablet PC',
    imageCaption: 'Modern tablet devices continue to evolve with new features',
    tags: ['Tablets', 'Technology', 'Market Growth', '2028', 'Industry Analysis'],
};

const authorData = {
    name: 'Shane Doe',
    bio: 'Shane is a technology journalist with over 10 years of experience covering consumer electronics, emerging tech trends, and digital innovation. He specializes in mobile computing and has been following the tablet market since its inception.',
    avatarUrl: 'https://i.pravatar.cc/150?img=33',
    twitterUrl: '#',
    linkedinUrl: '#',
};

const mockComments = [
    { id: 'c1', author: 'User 1', avatarUrl: 'https://i.pravatar.cc/150?img=1', timestamp: '2 days ago', content: 'Great article! The insights about the tablet market growth are very informative. Looking forward to seeing how the market evolves.' },
    { id: 'c2', author: 'User 2', avatarUrl: 'https://i.pravatar.cc/150?img=2', timestamp: '1 day ago', content: 'I agree, the education sector is huge. My kids use their tablets daily now.' },
    { id: 'c3', author: 'User 3', avatarUrl: 'https://i.pravatar.cc/150?img=3', timestamp: '5 hours ago', content: 'Fantastic breakdown of the regional growth patterns. Asia-Pacific leading makes sense.' },
];

// --- Main Page Component ---
export default function TechBlogPage() {

    const { id } = useParams();
    const dispatch = useDispatch();
    const { currentContent, loading, error } = useSelector((state) => state.content);

    useEffect(() => {
        if (id) dispatch(fetchContentById(id));
    }, [dispatch, id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!currentContent) return <p>No content found</p>;


    return (
        // Main container. Dark mode: dark:bg-gray-950, dark:text-gray-200
        <div className="min-h-screen bg-white dark:bg-gray-950 dark:text-gray-200">
            {/* Breadcrumb Component */}
            <ArticleBreadcrumb items={breadcrumbItems} />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Responsive Grid: 2/3 for content, 1/3 for sidebar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Article Content Column */}
                    <div className="lg:col-span-2">

                        {/* Article Header Component */}
                        <ArticleHeader
                            category={articleDetails.category}
                            title={articleDetails.title}
                            authorName={articleDetails.author}
                            authorHref={articleDetails.authorHref}
                            date={articleDetails.date}
                            commentCount={articleDetails.commentCount}
                            imageUrl={articleDetails.imageUrl}
                            imageAlt={articleDetails.imageAlt}
                            imageCaption={articleDetails.imageCaption}
                        />

                        {/* Article Body Component - The children prop contains the complex prose content */}
                        <ArticleBody tags={articleDetails.tags}>
                            <p className="text-xl text-gray-700 mb-6 leading-relaxed font-medium dark:text-gray-300">
                                The global tablet PC market is poised for significant expansion over the next five years, with industry analysts predicting exponential growth driven by technological advancements and changing consumer preferences.
                            </p>

                            <p className="text-gray-700 mb-4 leading-relaxed dark:text-gray-300">
                                According to recent market research, the tablet PC industry is expected to witness unprecedented growth by 2028, with a compound annual growth rate (CAGR) exceeding 8%. This surge is attributed to several key factors, including the increasing adoption of remote work, enhanced educational technology requirements, and the continuous evolution of tablet hardware and software capabilities.
                            </p>

                            <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4 dark:text-white">Market Drivers and Trends</h2>

                            <p className="text-gray-700 mb-4 leading-relaxed dark:text-gray-300">
                                Industry experts point to several driving forces behind this growth trajectory. The proliferation of 5G networks has enabled tablets to become more versatile communication and productivity tools. Additionally, the integration of artificial intelligence and machine learning capabilities has transformed tablets from simple consumption devices into powerful computing platforms.
                            </p>

                            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8 dark:bg-blue-950 dark:border-blue-700">
                                <p className="text-gray-800 italic text-lg dark:text-blue-200">
                                    "The tablet market is experiencing a renaissance. We're seeing innovations that blur the lines between tablets, laptops, and smartphones, creating entirely new use cases." - Tech Industry Analyst
                                </p>
                            </div>

                            <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4 dark:text-white">Key Market Segments</h2>

                            <p className="text-gray-700 mb-4 leading-relaxed dark:text-gray-300">
                                The education sector represents one of the fastest-growing segments for tablet adoption. Schools and universities worldwide are increasingly incorporating tablets into their digital learning infrastructure, recognizing their potential to enhance student engagement and facilitate personalized learning experiences.
                            </p>

                            <p className="text-gray-700 mb-4 leading-relaxed dark:text-gray-300">
                                Healthcare providers are also embracing tablet technology, utilizing these devices for patient records management, telemedicine consultations, and medical imaging. The portability and intuitive interfaces of modern tablets make them ideal tools for healthcare professionals who require quick access to critical information.
                            </p>

                            <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4 dark:text-white">Technological Innovations</h2>

                            <p className="text-gray-700 mb-4 leading-relaxed dark:text-gray-300">
                                Recent advancements in display technology, including OLED and mini-LED screens, have significantly improved the visual experience on tablets. Coupled with more powerful processors and extended battery life, these improvements are making tablets increasingly attractive to both consumers and business users.
                            </p>

                            <p className="text-gray-700 mb-4 leading-relaxed dark:text-gray-300">
                                The integration of stylus support and improved keyboard accessories has also expanded the creative and productivity capabilities of tablets, positioning them as viable alternatives to traditional laptops for many use cases.
                            </p>

                            <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4 dark:text-white">Regional Growth Patterns</h2>

                            <p className="text-gray-700 mb-4 leading-relaxed dark:text-gray-300">
                                Asia-Pacific regions are expected to lead the market growth, driven by increasing disposable incomes, growing tech-savvy populations, and substantial investments in digital infrastructure. North America and Europe are also anticipated to maintain strong growth rates, particularly in the premium tablet segment.
                            </p>

                            <p className="text-gray-700 mb-4 leading-relaxed dark:text-gray-300">
                                As we approach 2028, the tablet PC market appears well-positioned for sustained growth, with manufacturers continuing to innovate and expand the capabilities of these versatile devices. The convergence of hardware improvements, software ecosystem maturity, and evolving consumer needs suggests that tablets will play an increasingly central role in our digital lives.
                            </p>
                        </ArticleBody>

                        {/* Author Bio Component */}
                        <ArticleAuthorBio
                            name={authorData.name}
                            bio={authorData.bio}
                            avatarUrl={authorData.avatarUrl}
                            twitterUrl={authorData.twitterUrl}
                            linkedinUrl={authorData.linkedinUrl}
                        />

                        {/* Comments Section Component */}
                        <ArticleCommentSection
                            totalComments={articleDetails.commentCount}
                            comments={mockComments}
                        />
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:col-span-1">
                        <Sidebar />
                    </div>
                </div>
            </main>
        </div>
    );
}