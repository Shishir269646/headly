'use client';

import withAuth from '@/hoc/withAuth';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@/hooks/useAuth';
import { fetchDashboardStats } from '@/store/slices/dashboardSlice';
import Link from 'next/link';
import { FiFileText, FiCheckCircle, FiFile, FiImage, FiMessageSquare, FiClock, FiUsers, FiSettings, FiPlusCircle, FiXCircle } from 'react-icons/fi';




function StatCard({ title, value, icon, color, href }) {
    const iconColorClass = color.replace('bg-', 'text-');

    const content = (
        <div className="card card-compact bg-base-100 border border-base-200 hover:border-primary/50 shadow-md hover:shadow-lg transition duration-300 ease-in-out">
            <div className="card-body flex-row items-center justify-between p-6">
                <div>
                    <p className="text-sm font-semibold text-base-content/60 uppercase tracking-wider mb-2">{title}</p>
                    <p className="text-4xl font-bold text-base-content">{value.toLocaleString()}</p>
                </div>
                <div
                    className={`w-14 h-14 rounded-lg flex items-center justify-center text-white text-3xl transition duration-300 ${iconColorClass} bg-opacity-10`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );

    if (href) {
        return <Link href={href} className="block hover:scale-[1.02] transition duration-300">{content}</Link>;
    }

    return content;
}


function QuickActionCard({ title, icon: Icon, description, href, color }) {
    return (
        <Link href={href} className="card card-compact bg-base-100 border border-base-200 hover:border-primary hover:shadow-xl transition duration-300 group">
            <div className="card-body p-6 flex-row items-center">
                <div className={`text-4xl p-3 rounded-xl ${color} bg-opacity-10 transition duration-300 group-hover:bg-opacity-20`}>
                    <Icon className={`${color}`} />
                </div>
                <div className="ml-4">
                    <h3 className="card-title text-base-content text-lg font-bold group-hover:text-primary transition duration-300">{title}</h3>
                    <p className="text-sm text-base-content/70">{description}</p>
                </div>
            </div>
        </Link>
    );
}



function DashboardPage() {
    const dispatch = useDispatch();
    const { user, isEditorOrAbove, isAdministrator } = useAuth();
    const { stats, loading, error } = useSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(fetchDashboardStats());
    }, [dispatch]);

    return (
        <div className="space-y-10 p-6 lg:p-10">

            {/* 1. Welcome Section - Hero Card */}
            <div className="bg-base-100 rounded-xl shadow-lg p-6 border border-base-200">
                <h2 className="text-3xl font-bold text-base-content mb-1 flex items-center">
                    Hello, {user?.name || 'User'}!
                    <span className="text-4xl ml-2">👋</span>
                </h2>
                <p className="text-lg text-base-content/70">
                    Your content management summary for a productive day.
                </p>
            </div>

            {/* Loading/Error States */}
            {loading && (
                <div className="flex flex-col justify-center items-center py-20 bg-base-100 rounded-xl shadow-lg">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4 text-lg text-base-content/70">Fetching dashboard data...</p>
                </div>
            )}

            {error && (
                <div role="alert" className="alert alert-error shadow-lg">
                    <FiXCircle className="w-6 h-6" />
                    <div>
                        <h3 className="font-bold">Error Loading Data!</h3>
                        <div className="text-sm">{error}</div>
                    </div>
                </div>
            )}

            {/* Main Dashboard Content */}
            {!loading && !error && (
                <div className="space-y-10">

                    {/* 2. Primary Stat Cards (ALWAYS VISIBLE) */}
                    <section>
                        <h3 className="text-2xl font-semibold text-base-content mb-6 border-b pb-2">Content Overview</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="Total Contents"
                                value={stats.totalContents || 0}
                                icon={<FiFileText />}
                                color="bg-primary"
                                href="/dashboard/contents"
                            />
                            <StatCard
                                title="Published"
                                value={stats.publishedContents || 0}
                                icon={<FiCheckCircle />}
                                color="bg-green-500"
                                href="/dashboard/contents?status=published"
                            />
                            <StatCard
                                title="Drafts"
                                value={stats.draftContents || 0}
                                icon={<FiFile />}
                                color="bg-yellow-500"
                                href="/dashboard/contents?status=draft"
                            />
                            <StatCard
                                title="Scheduled"
                                value={stats.scheduledContents || 0}
                                icon={<FiClock />}
                                color="bg-orange-500"
                                href="/dashboard/contents?status=scheduled"
                            />
                        </div>
                    </section>


                    {isEditorOrAbove && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                            {/* 3a. Quick Actions Section */}
                            <section className="lg:col-span-2 space-y-4">
                                <h3 className="text-2xl font-semibold text-base-content mb-6 border-b pb-2">Quick Actions</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <QuickActionCard
                                        title="Create New Post"
                                        description="Start writing a new article or content piece."
                                        icon={FiPlusCircle}
                                        href="/dashboard/contents/new"
                                        color="text-primary"
                                    />
                                    <QuickActionCard
                                        title="Review Comments"
                                        description="Moderate pending comments and engage with users."
                                        icon={FiMessageSquare}
                                        href="/dashboard/comments"
                                        color="text-red-500"
                                    />
                                    {isAdministrator && (
                                        <QuickActionCard
                                            title="Manage Users"
                                            description="View, edit, or remove user accounts and permissions."
                                            icon={FiUsers}
                                            href="/dashboard/users"
                                            color="text-indigo-500"
                                        />
                                    )}
                                    <QuickActionCard
                                        title="View Media Library"
                                        description="Upload and manage all image and video files."
                                        icon={FiImage}
                                        href="/dashboard/media"
                                        color="text-purple-500"
                                    />
                                </div>
                            </section>

                            {/* 3b. Secondary Stats Section */}
                            <section className="space-y-6">
                                <h3 className="text-2xl font-semibold text-base-content mb-6 border-b pb-2">Secondary Metrics</h3>
                                <StatCard
                                    title="Media Files"
                                    value={stats.totalMedia || 0}
                                    icon={<FiImage />}
                                    color="bg-purple-500"
                                />
                                <StatCard
                                    title="Total Comments"
                                    value={stats.totalComments || 0}
                                    icon={<FiMessageSquare />}
                                    color="bg-cyan-500"
                                />
                                <StatCard
                                    title="Pending Comments"
                                    value={stats.pendingComments || 0}
                                    icon={<FiMessageSquare />}
                                    color="bg-red-500"
                                    href="/dashboard/comments?status=pending"
                                />
                            </section>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default withAuth(DashboardPage, ['admin', 'editor', 'author']);