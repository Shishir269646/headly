'use client';

import withAuth from '@/hoc/withAuth';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@/hooks/useAuth';
import { fetchDashboardStats } from '@/store/slices/dashboardSlice';
import Link from 'next/link';
import { FiFileText, FiCheckCircle, FiFile, FiImage, FiEdit, FiUploadCloud, FiBarChart2, FiMessageSquare, FiClock, FiActivity, FiXCircle } from 'react-icons/fi';
import { format } from 'date-fns';

function DashboardPage() {
    const dispatch = useDispatch();
    const { user, isEditorOrAbove } = useAuth();
    const { stats, recentContents, loading, error } = useSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(fetchDashboardStats());
    }, [dispatch]);

    return (
        <div className="space-y-8 p-6 lg:p-10">
            {/* Welcome Section - Hero Card */}
            <div className="card bg-base-200 shadow-xl p-6">
                <div className="card-body p-0">
                    <h2 className="text-3xl font-extrabold text-base-content mb-1 flex items-center">
                        Welcome back, {user?.name || 'User'}!
                        <span className="text-4xl ml-2">👋</span>
                    </h2>
                    <p className="text-lg text-base-content/70">
                        A quick overview of your content management hub.
                    </p>
                </div>
            </div>

            {/* Loading State - DaisyUI Spinner */}
            {loading && (
                <div className="flex flex-col justify-center items-center py-20 bg-base-100 rounded-box shadow-lg">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="mt-4 text-lg text-base-content/70">Fetching dashboard data...</p>
                </div>
            )}

            {/* Error State - DaisyUI Alert */}
            {error && (
                <div className="alert alert-error shadow-lg">
                    <FiXCircle className="w-6 h-6" />
                    <div>
                        <h3 className="font-bold">Error Loading Data!</h3>
                        <div className="text-xs">{error}</div>
                    </div>
                </div>
            )}

            {/* Main Dashboard Content */}
            {!loading && !error && (
                <>
                    {/* Stat Cards - Grid with different colors */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Contents"
                            value={stats.totalContents || 0}
                            icon={<FiFileText />}
                            color="bg-blue-500"
                        />
                        <StatCard
                            title="Published"
                            value={stats.publishedContents || 0}
                            icon={<FiCheckCircle />}
                            color="bg-green-500"
                        />
                        <StatCard
                            title="Drafts"
                            value={stats.draftContents || 0}
                            icon={<FiFile />}
                            color="bg-yellow-500"
                        />
                        <StatCard
                            title="Scheduled"
                            value={stats.scheduledContents || 0}
                            icon={<FiClock />}
                            color="bg-orange-500"
                        />
                    </div>

                    {/* Secondary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                            color="bg-indigo-500"
                        />
                        {isEditorOrAbove ? (
                            <StatCard
                                title="Pending Comments"
                                value={stats.pendingComments || 0}
                                icon={<FiMessageSquare />}
                                color="bg-red-500"
                                href="/dashboard/comments"
                            />
                        ) : null}
                    </div>

                    {/* Recent Contents - Table Component */}
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="card-title text-xl font-bold">Recent Contents</h3>
                                <Link href="/dashboard/contents" className="btn btn-sm btn-ghost text-primary hover:bg-base-200">
                                    View all <span className="ml-1">→</span>
                                </Link>
                            </div>

                            {recentContents && recentContents.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="table w-full">
                                        {/* head */}
                                        <thead>
                                            <tr>
                                                <th className='w-1/2'>Title</th>
                                                <th>Status</th>
                                                <th>Created At</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentContents.slice(0, 5).map((content) => (
                                                <tr key={content._id} className="hover:bg-base-200 transition-colors duration-150">
                                                    <td>
                                                        <Link
                                                            href={`/dashboard/contents/${content._id}/edit`}
                                                            className="link link-hover font-medium text-base-content"
                                                        >
                                                            {content.title}
                                                        </Link>
                                                    </td>
                                                    <td>
                                                        <div className={`badge ${content.status === 'published' ? 'badge-success' :
                                                                content.status === 'draft' ? 'badge-neutral' :
                                                                    content.status === 'scheduled' ? 'badge-warning' :
                                                                        'badge-info'
                                                            } badge-outline badge-sm uppercase`}>
                                                            {content.status}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {content.createdAt ? format(new Date(content.createdAt), 'MMM dd, yyyy') : 'N/A'}
                                                    </td>
                                                    <td>
                                                        <Link href={`/dashboard/contents/${content._id}/edit`} className="btn btn-ghost btn-xs text-primary">
                                                            <FiEdit className="w-4 h-4" /> Edit
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-base-content/60">
                                    <FiActivity className="w-10 h-10 mx-auto mb-3 text-base-content/40" />
                                    <p className="mb-3">No contents have been created yet.</p>
                                    <Link
                                        href="/dashboard/contents/new"
                                        className="btn btn-primary btn-sm"
                                    >
                                        <FiEdit className="w-4 h-4" /> Create First Content
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions - Action Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <QuickActionCard
                            title="Create New Content"
                            description="Start writing a new article or blog post."
                            icon={<FiEdit />}
                            iconClass="text-blue-600 bg-blue-100"
                            href="/dashboard/contents/new"
                        />
                        <QuickActionCard
                            title="Media Library"
                            description="Manage and upload all your images and files."
                            icon={<FiUploadCloud />}
                            iconClass="text-purple-600 bg-purple-100"
                            href="/dashboard/media"
                        />
                        {isEditorOrAbove && (
                            <QuickActionCard
                                title="View Analytics"
                                description="Check performance and gain insights."
                                icon={<FiBarChart2 />}
                                iconClass="text-green-600 bg-green-100"
                                href="/dashboard/analytics"
                            />
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

// --- Component for Stat Cards ---
function StatCard({ title, value, icon, color, href }) {
    const iconStyle = {
        background: color,
        boxShadow: `0 4px 6px -1px ${color.replace('-500', '-400').replace('bg-', '')}, 0 2px 4px -2px ${color.replace('-500', '-400').replace('bg-', '')}`
    };

    const content = (
        <div className="card card-compact bg-base-100 shadow-lg hover:shadow-xl transition duration-300">
            <div className="card-body flex-row items-center justify-between p-6">
                <div>
                    <p className="text-sm font-semibold text-base-content/70 mb-1">{title}</p>
                    <p className="text-4xl font-extrabold text-base-content">{value}</p>
                </div>
                <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-white text-3xl`}
                    style={iconStyle}
                >
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

// --- Component for Quick Action Cards ---
function QuickActionCard({ title, description, icon, iconClass, href }) {
    return (
        <Link
            href={href}
            className="card bg-base-100 shadow-lg hover:shadow-xl hover:ring-2 ring-primary ring-opacity-50 transition duration-300 group"
        >
            <div className="card-body p-6">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${iconClass}`}>
                    <span className="text-2xl">{icon}</span>
                </div>
                <h3 className="card-title text-xl font-semibold group-hover:text-primary transition">{title}</h3>
                <p className="text-sm text-base-content/70">{description}</p>
            </div>
        </Link>
    );
}

// ... StatCard and QuickActionCard definitions

function AuthWrapper() {
    const AuthenticatedDashboardPage = withAuth(DashboardPage, ['admin', 'editor', 'author', 'viewer']);
    return <AuthenticatedDashboardPage />;
}

export default AuthWrapper;
