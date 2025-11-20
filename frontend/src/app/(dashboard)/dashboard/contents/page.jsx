// ============================================
// 📄 app/(dashboard)/dashboard/contents/page.js
// Contents List Page
// ============================================

'use client';


import withAuth from '@/hoc/withAuth';
import { useContent } from '@/hooks/useContent';
import { useToast } from '@/hooks/useToast';
import { useModal } from '@/hooks/useModal';
import { useState } from 'react';
import Link from 'next/link';
import { formatDate, truncateText } from '@/libs/utils';
import { Eye, Edit, CheckCircle, Trash2 } from 'lucide-react';

function ContentsPage() {
    const [filters, setFilters] = useState({
        status: '',
        page: 1,
        limit: 10
    });

    const { contents, pagination, loading, remove, publish, updateFlags } = useContent(filters);
    const toast = useToast();
    const deleteModal = useModal();

    const handleFlagChange = (id, flag, value) => {
        updateFlags(id, { [flag]: value });
    };

    const handleDelete = async () => {
        try {
            await remove(deleteModal.data);
            toast.success('Content deleted successfully!');
            deleteModal.close();
        } catch (error) {
            toast.error('Failed to delete content');
        }
    };

    const handlePublish = async (id) => {
        try {
            await publish(id);
            toast.success('Content published successfully!');
        } catch (error) {
            toast.error('Failed to publish content');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Contents</h1>
                    <p className="text-gray-600 mt-1">Manage all your content</p>
                </div>
                <Link
                    href="/dashboard/contents/new"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                    + New Content
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex gap-4">
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="scheduled">Scheduled</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Search contents..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Contents Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                ) : contents && contents.length > 0 ? (
                    <>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Author
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Featured
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Popular
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Featured Order
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {contents.map((content) => (
                                    <tr key={content._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <Link
                                                    href={`/dashboard/contents/${content._id}/edit`}
                                                    className="text-gray-900 font-medium hover:text-blue-600"
                                                >
                                                    {content.title}
                                                </Link>
                                                <p className="text-sm text-gray-500">{truncateText(content.excerpt, 60)}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${content.status === 'published' ? 'bg-green-100 text-green-800' :
                                                    content.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {content.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {content.author?.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(content.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={content.isFeatured}
                                                onChange={(e) => handleFlagChange(content._id, 'isFeatured', e.target.checked)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="checkbox"
                                                checked={content.isPopular}
                                                onChange={(e) => handleFlagChange(content._id, 'isPopular', e.target.checked)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input
                                                type="number"
                                                value={content.featuredOrder}
                                                onChange={(e) => handleFlagChange(content._id, 'featuredOrder', e.target.value)}
                                                className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end space-x-2">
                                                <Link
                                                    href={`/${content.slug}`}
                                                    target="_blank"
                                                    className="text-gray-600 hover:text-gray-900"
                                                    title="View"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                                <Link
                                                    href={`/dashboard/contents/${content._id}/edit`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="Edit"
                                                >
                                                    <Edit size={18} />
                                                </Link>
                                                {content.status === 'draft' && (
                                                    <button
                                                        onClick={() => handlePublish(content._id)}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Publish"
                                                    >
                                                        <CheckCircle size={18} />
                                                    </button>
                                                )}
                                                <button
                                                                                                            onClick={() => deleteModal.open(content._id)}
                                                                                                            className="text-red-600 hover:text-red-900"
                                                                                                            title="Delete"
                                                                                                        >
                                                                                                            <Trash2 size={18} />
                                                                                                        </button>                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                            <div className="text-sm text-gray-700">
                                Showing <span className="font-medium">{(pagination.page - 1) * filters.limit + 1}</span> to{' '}
                                <span className="font-medium">{Math.min(pagination.page * filters.limit, pagination.total)}</span> of{' '}
                                <span className="font-medium">{pagination.total}</span> results
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                                    disabled={pagination.page === 1}
                                    className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                                    disabled={pagination.page >= pagination.pages}
                                    className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="p-12 text-center">
                        <p className="text-gray-500 mb-4">No contents found</p>
                        <Link
                            href="/dashboard/contents/new"
                            className="text-blue-600 hover:underline"
                        >
                            Create your first content →
                        </Link>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this content? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={deleteModal.close}
                                className="px-4 py-2 border rounded hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notifications */}
            <div className="fixed top-4 right-4 space-y-2 z-50">
                {toast.toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`px-6 py-3 rounded-lg shadow-lg text-white ${t.type === 'success' ? 'bg-green-500' :
                                t.type === 'error' ? 'bg-red-500' :
                                    'bg-blue-500'
                            }`}
                    >
                        {t.message}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ... other components and functions

function AuthWrapper() {
    const AuthenticatedContentsPage = withAuth(ContentsPage, ['admin', 'editor', 'author']);
    return <AuthenticatedContentsPage />;
}

export default AuthWrapper;