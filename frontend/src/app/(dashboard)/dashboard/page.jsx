// ============================================
// 📄 app/(dashboard)/dashboard/page.js
// Dashboard Home Page
// ============================================

'use client';

import { useAuth } from '@/hooks/useAuth';
import { useContent } from '@/hooks/useContent';
import { useMedia } from '@/hooks/useMedia';
import Link from 'next/link';
import { useEffect } from 'react';

export default function DashboardPage() {
    const { user } = useAuth();
    const { contents, loading: contentsLoading } = useContent({ limit: 5 });
    const { media, loading: mediaLoading } = useMedia({ limit: 5 });

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Welcome back, {user?.name}! 👋
                </h2>
                <p className="text-gray-600">
                    Here's what's happening with your content today.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    title="Total Contents"
                    value={contents?.length || 0}
                    icon="📝"
                    color="bg-blue-500"
                />
                <StatCard
                    title="Published"
                    value={contents?.filter(c => c.status === 'published').length || 0}
                    icon="✅"
                    color="bg-green-500"
                />
                <StatCard
                    title="Drafts"
                    value={contents?.filter(c => c.status === 'draft').length || 0}
                    icon="📄"
                    color="bg-yellow-500"
                />
                <StatCard
                    title="Media Files"
                    value={media?.length || 0}
                    icon="🖼️"
                    color="bg-purple-500"
                />
            </div>

            {/* Recent Contents */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Contents</h3>
                    <Link href="/dashboard/contents" className="text-blue-600 hover:underline text-sm">
                        View all →
                    </Link>
                </div>
                <div className="p-6">
                    {contentsLoading ? (
                        <div>Loading...</div>
                    ) : contents && contents.length > 0 ? (
                        <div className="space-y-4">
                            {contents.slice(0, 5).map((content) => (
                                <div key={content._id} className="flex items-center justify-between py-3 border-b last:border-0">
                                    <div className="flex-1">
                                        <Link
                                            href={`/dashboard/contents/${content._id}/edit`}
                                            className="text-gray-900 font-medium hover:text-blue-600"
                                        >
                                            {content.title}
                                        </Link>
                                        <p className="text-sm text-gray-500">
                                            {new Date(content.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs ${content.status === 'published' ? 'bg-green-100 text-green-800' :
                                            content.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                                'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {content.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <p>No contents yet</p>
                            <Link href="/dashboard/contents/new" className="text-blue-600 hover:underline mt-2 inline-block">
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
                    icon="✍️"
                    href="/dashboard/contents/new"
                />
                <QuickActionCard
                    title="Upload Media"
                    description="Add images, videos, or documents"
                    icon="📤"
                    href="/dashboard/media/upload"
                />
                <QuickActionCard
                    title="View Analytics"
                    description="Check your content performance"
                    icon="📊"
                    href="/dashboard/analytics"
                />
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-2xl`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

function QuickActionCard({ title, description, icon, href }) {
    return (
        <Link href={href} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">{icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </Link>
    );
}

