'use client';

import withAuth from '@/hoc/withAuth';
import { useMedia } from '@/hooks/useMedia';
import { useToast } from '@/hooks/useToast';
import { useModal } from '@/hooks/useModal';
import Link from 'next/link';
import Image from 'next/image';
import { formatFileSize, formatDate } from '@/libs/utils';
import { useEffect } from 'react';

function MediaPage() {
    const { media, loading, remove, refetch } = useMedia({}, true);  
    const toast = useToast();
    const deleteModal = useModal();

    useEffect(() => {
        console.log('Media state:', { media, loading });
    }, [media, loading]);


    const handleDelete = async () => {
        try {
            await remove(deleteModal.data);
            toast.success('Media deleted successfully!');
            deleteModal.close();
        } catch (error) {
            toast.error('Failed to delete media');
        }
    };



    const copyUrl = (url) => {
        navigator.clipboard.writeText(url);
        toast.success('URL copied to clipboard!');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
                    <p className="text-gray-600 mt-1">Manage your images and files</p>
                </div>
                <Link
                    href="/dashboard/media/upload"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                    + Upload Media
                </Link>
            </div>

            {/* Media Grid */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                </div>
            ) : media && media.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {media.map((item) => (
                        <div key={item._id} className="group relative bg-white rounded-lg shadow overflow-hidden">
                            <div className="aspect-square relative">
                                <Image
                                    src={item.url}
                                    alt={item.alt || item.originalName}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => copyUrl(item.url)}
                                            className="p-2 bg-white rounded-full hover:bg-gray-100"
                                            title="Copy URL"
                                        >
                                            📋
                                        </button>
                                        <button
                                            onClick={() => deleteModal.open(item._id)}
                                            className="p-2 bg-white rounded-full hover:bg-gray-100"
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-2">
                                <p className="text-xs text-gray-600 truncate">{item.originalName}</p>
                                <p className="text-xs text-gray-400">{formatFileSize(item.size)}</p>
                            </div>
                        </div>
                    ))}

                </div>
            ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <p className="text-gray-500 mb-4">No media files yet</p>
                    <Link href="/dashboard/media/upload" className="text-blue-600 hover:underline">
                        Upload your first file →
                    </Link>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Delete</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this media file?
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button onClick={deleteModal.close} className="px-4 py-2 border rounded hover:bg-gray-50">
                                Cancel
                            </button>
                            <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toasts */}
            <div className="fixed top-4 right-4 space-y-2 z-50">
                {toast.toasts.map((t) => (
                    <div key={t.id} className={`px-6 py-3 rounded-lg shadow-lg text-white ${t.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                        {t.message}
                    </div>
                ))}
            </div>
        </div>
    );
}

// ... other components and functions

function AuthWrapper() {
    const AuthenticatedMediaPage = withAuth(MediaPage, ['admin', 'editor', 'author']);
    return <AuthenticatedMediaPage />;
}

export default AuthWrapper;