// ============================================
// 📄 app/(dashboard)/dashboard/page.js
// Dashboard Home Page
// ============================================

'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@/hooks/useAuth';
import { fetchDashboardStats } from '@/store/slices/dashboardSlice';
import Link from 'next/link';
import { FiFileText, FiCheckCircle, FiFile, FiImage, FiEdit, FiUploadCloud, FiBarChart2, FiMessageSquare, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';

export default function DashboardPage() {
    const dispatch = useDispatch();
    const { user } = useAuth();
    const { stats, recentContents, loading, error } = useSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(fetchDashboardStats());
    }, [dispatch]);

    return (
        <div className="space-y-6 p-6">
            {/* Welcome Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Welcome back, {user?.name || 'User'}! 👋
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Here's what's happening with your content today.
                </p>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="alert alert-error">
                    <span>{error}</span>
                </div>
            )}

            {/* Stats Cards */}
            {!loading && !error && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Contents"
                            value={stats.totalContents || 0}
                            icon={<FiFileText className="text-white text-2xl" />}
                            color="bg-blue-500"
                        />
                        <StatCard
                            title="Published"
                            value={stats.publishedContents || 0}
                            icon={<FiCheckCircle className="text-white text-2xl" />}
                            color="bg-green-500"
                        />
                        <StatCard
                            title="Drafts"
                            value={stats.draftContents || 0}
                            icon={<FiFile className="text-white text-2xl" />}
                            color="bg-yellow-500"
                        />
                        <StatCard
                            title="Scheduled"
                            value={stats.scheduledContents || 0}
                            icon={<FiClock className="text-white text-2xl" />}
                            color="bg-orange-500"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard
                            title="Media Files"
                            value={stats.totalMedia || 0}
                            icon={<FiImage className="text-white text-2xl" />}
                            color="bg-purple-500"
                        />
                        <StatCard
                            title="Total Comments"
                            value={stats.totalComments || 0}
                            icon={<FiMessageSquare className="text-white text-2xl" />}
                            color="bg-indigo-500"
                        />
                        {user?.role === 'admin' || user?.role === 'editor' ? (
                            <StatCard
                                title="Pending Comments"
                                value={stats.pendingComments || 0}
                                icon={<FiMessageSquare className="text-white text-2xl" />}
                                color="bg-red-500"
                                href="/dashboard/comments"
                            />
                        ) : null}
                    </div>

                    {/* Recent Contents */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Contents</h3>
                            <Link href="/dashboard/contents" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                                View all →
                            </Link>
                        </div>
                        <div className="p-6">
                            {recentContents && recentContents.length > 0 ? (
                                <div className="space-y-4">
                                    {recentContents.map((content) => (
                                        <div
                                            key={content._id}
                                            className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0"
                                        >
                                            <div className="flex-1">
                                                <Link
                                                    href={`/dashboard/contents/${content._id}/edit`}
                                                    className="text-gray-900 dark:text-white font-medium hover:text-blue-600 dark:hover:text-blue-400"
                                                >
                                                    {content.title}
                                                </Link>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {content.createdAt ? format(new Date(content.createdAt), 'PPP') : 'N/A'}
                                                </p>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs ${
                                                    content.status === 'published'
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                        : content.status === 'draft'
                                                        ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                                        : content.status === 'scheduled'
                                                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                }`}
                                            >
                                                {content.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <p>No contents yet</p>
                                    <Link
                                        href="/dashboard/contents/new"
                                        className="text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block"
                                    >
                                        Create your first content →
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <QuickActionCard
                            title="Create Content"
                            description="Write a new blog post or article"
                            icon={<FiEdit className="text-blue-600 text-3xl" />}
                            href="/dashboard/contents/new"
                        />
                        <QuickActionCard
                            title="Upload Media"
                            description="Add images, videos, or documents"
                            icon={<FiUploadCloud className="text-purple-600 text-3xl" />}
                            href="/dashboard/media/upload"
                        />
                        {(user?.role === 'admin' || user?.role === 'editor') && (
                            <QuickActionCard
                                title="View Analytics"
                                description="Check your content performance"
                                icon={<FiBarChart2 className="text-green-600 text-3xl" />}
                                href="/dashboard/analytics"
                            />
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

function StatCard({ title, value, icon, color, href }) {
    const content = (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                </div>
                <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    if (href) {
        return <Link href={href}>{content}</Link>;
    }

    return content;
}

function QuickActionCard({ title, description, icon, href }) {
    return (
        <Link
            href={href}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition"
        >
            <div className="mb-4">{icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </Link>
    );
}
