// ============================================
// 📄 app/(dashboard)/layout.js
// Dashboard Layout with Sidebar (fixed version)
// ============================================

'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    FaTachometerAlt,
    FaRegFileAlt,
    FaImages,
    FaUsers,
    FaEnvelope,
    FaNewspaper,
    FaChartLine,
    FaUserCircle,
    FaSignOutAlt,
    FaChevronLeft,
    FaChevronRight,
    FaComments,
} from 'react-icons/fa';
import Image from 'next/image';

export default function DashboardLayout({ children }) {
    const { isAuthenticated, loading, user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);





    // Redirect if not authenticated
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [loading, isAuthenticated, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    const navigation = [
        { name: 'Dashboard', href: '/dashboard', icon: <FaTachometerAlt /> },
        { name: 'Contents', href: '/dashboard/contents', icon: <FaRegFileAlt /> },
        { name: 'Comments', href: '/dashboard/comments', icon: <FaComments />, adminOnly: true },
        { name: 'Media', href: '/dashboard/media', icon: <FaImages /> },
        { name: 'Users', href: '/dashboard/users', icon: <FaUsers />, adminOnly: true },
        { name: 'Contacts', href: '/dashboard/contacts', icon: <FaEnvelope />, adminOnly: true },
        { name: 'Newsletter', href: '/dashboard/newsletter', icon: <FaNewspaper />, adminOnly: true },
        { name: 'Analytics', href: '/dashboard/analytics', icon: <FaChartLine />, adminOnly: true },
        { name: 'Profile', href: '/dashboard/profile', icon: <FaUserCircle /> },
    ];

    const filteredNavigation = navigation.filter(
        (item) => !item.adminOnly || user?.role === 'admin'
    );

    // Create readable title
    const currentPage = (() => {
        const parts = pathname?.split('/')?.filter(Boolean);
        if (!parts.length) return 'Dashboard';
        const last = parts[parts.length - 1];
        return last.charAt(0).toUpperCase() + last.slice(1);
    })();

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`relative flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'
                    } bg-gray-900 text-white transition-all duration-300`}
            >
                {/* Sidebar header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    {sidebarOpen && (
                        <Link href="/dashboard" className="text-xl font-bold">
                            Headly CMS
                        </Link>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded hover:bg-gray-800"
                    >
                        {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
                    </button>
                </div>

                {/* Sidebar navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {filteredNavigation.map((item) => {
                        const isActive =
                            pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                {sidebarOpen && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Info */}
                <div className="p-4 border-t border-gray-800">
                    {sidebarOpen ? (
                        <div>
                            <div className="flex items-center space-x-3 mb-3">

                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">


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
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{user?.name}</p>
                                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={logout}
                            className="w-full p-2 text-red-400 hover:bg-gray-800 rounded"
                            title="Logout"
                        >
                            <FaSignOutAlt />
                        </button>
                    )}
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="flex items-center justify-between px-6 py-4">
                        <h1 className="text-2xl font-bold text-gray-900">{currentPage}</h1>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/"
                                target="_blank"
                                className="text-gray-600 hover:text-gray-900"
                            >
                                View Site →
                            </Link>
                            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize">
                                {user?.role}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">{children}</main>
            </div>
        </div>
    );
}
