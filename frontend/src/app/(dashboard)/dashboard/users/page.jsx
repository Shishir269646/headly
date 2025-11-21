// ============================================
// 📄 app/(dashboard)/dashboard/users/page.js
// Users Management Page (Admin Only)
// ============================================

'use client';

import withAuth from '@/hoc/withAuth';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { useModal } from '@/hooks/useModal';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { formatDate } from '@/libs/utils';
import { Plus, Pencil, Trash2, FolderPlus, CheckCircle2, XCircle } from 'lucide-react';

function UsersPage() {
    const { user: currentUser } = useAuth();
    const { users, loading, remove } = useUser();
    const toast = useToast();
    const deleteModal = useModal();
    const router = useRouter();



    const handleDelete = async () => {
        try {
            await remove(deleteModal.data);
            toast.success('User deleted successfully!');
            deleteModal.close();
        } catch (error) {
            toast.error('Failed to delete user');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Users</h1>
                    <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
                </div>
                <Link
                    href="/dashboard/users/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    Add User
                </Link>
            </div>

            {/* Users Table */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                {loading ? (
                    <div className="flex justify-center items-center p-8">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                        <p className="ml-4 text-gray-600">Loading users...</p>
                    </div>
                ) : users && users.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Joined
                                    </th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin' ? 'bg-red-100 text-red-800' :
                                                user.role === 'editor' ? 'bg-blue-100 text-blue-800' :
                                                    user.role === 'author' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(user.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end items-center space-x-3">
                                                <Link
                                                    href={`/dashboard/users/${user._id}/edit`}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="Edit User"
                                                >
                                                    <Pencil className="h-5 w-5" />
                                                </Link>
                                                {user._id !== currentUser.id && (
                                                    <button
                                                        onClick={() => deleteModal.open(user._id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center bg-gray-50">
                        <FolderPlus className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No users</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Get started by adding a new user.
                        </p>
                        <div className="mt-6">
                            <Link
                                href="/dashboard/users/new"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <Plus className="-ml-1 mr-2 h-5 w-5" />
                                Add New User
                            </Link>
                        </div>
                    </div>
                )}
            </div>


            {/* Delete Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
                    <div className="relative p-8 border w-full max-w-md m-auto bg-white rounded-md shadow-lg">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Deletion</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this user? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={deleteModal.close}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Toasts */}
            <div className="fixed bottom-4 right-4 space-y-2 z-50">
                {toast.toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${t.type === 'success' ? 'border-l-4 border-green-400' : 'border-l-4 border-red-400'}`}
                    >
                        <div className="p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    {t.type === 'success' ? (
                                        <CheckCircle2 className="h-6 w-6 text-green-400" />
                                    ) : (
                                        <XCircle className="h-6 w-6 text-red-400" />
                                    )}
                                </div>
                                <div className="ml-3 w-0 flex-1 pt-0.5">
                                    <p className="text-sm font-medium text-gray-900">
                                        {t.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ... imports
// ... rest of the UsersPage component

function AuthWrapper() {
    const AuthenticatedUsersPage = withAuth(UsersPage, ['admin']);
    return <AuthenticatedUsersPage />;
}

export default AuthWrapper;