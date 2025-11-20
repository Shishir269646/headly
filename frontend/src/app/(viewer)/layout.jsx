'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import Image from 'next/image';

export default function ViewerLayout({ children }) {
    const { isAuthenticated, loading, user, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [loading, isAuthenticated, router]);

    if (loading || !isAuthenticated || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }
    
    // If the user is not a viewer, redirect them away.
    // This adds an extra layer of protection for this layout.
    if (user.role !== 'viewer') {
        router.replace('/dashboard'); // Or any other appropriate page
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0">
                            <Link href="/" className="text-xl font-bold text-gray-900">
                                Headly
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-700">Welcome, {user.name}</span>
                             <div className="dropdown dropdown-end">
                                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                    <div className="w-10 rounded-full">
                                         {user?.image && typeof user.image === 'object' && user.image.url ? (
                                            <Image
                                                src={user.image.url}
                                                alt={user.image.alt || user.name}
                                                width={40}
                                                height={40}
                                                className="rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                                                {user?.name?.charAt(0)?.toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                </label>
                                <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                                    <li>
                                        <Link href="/profile" className="justify-between">
                                            Profile
                                            <span className="badge">New</span>
                                        </Link>
                                    </li>
                                    <li><a onClick={logout}>Logout</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Page Content */}
            <main className="py-10">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
