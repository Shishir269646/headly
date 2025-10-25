// ============================================
// 📄 app/(dashboard)/layout.js
// Dashboard Layout with Sidebar
// ============================================

'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }) {
    const { isAuthenticated, loading, user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);

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
        { name: 'Dashboard', href: '/dashboard', icon: '📊' },
        { name: 'Contents', href: '/dashboard/contents', icon: '📝' },
        { name: 'Media', href: '/dashboard/media', icon: '🖼️' },
        { name: 'Users', href: '/dashboard/users', icon: '👥', adminOnly: true },
        { name: 'Profile', href: '/dashboard/profile', icon: '👤' },
    ];

    const filteredNavigation = navigation.filter(item =>
        !item.adminOnly || user?.role === 'admin'
    );

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300`}>
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
                        {sidebarOpen ? '←' : '→'}
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {filteredNavigation.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
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

                {/* User Info at Bottom */}
                <div className="absolute w-fit bottom-0 left-0 right-0 p-4 border-t border-gray-800">
                    {sidebarOpen ? (
                        <div>
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{user?.name}</p>
                                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className=" bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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
                            🚪
                        </button>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="flex items-center justify-between px-6 py-4">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {pathname.split('/').pop().charAt(0).toUpperCase() + pathname.split('/').pop().slice(1)}
                        </h1>
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/"
                                target="_blank"
                                className="text-gray-600 hover:text-gray-900"
                            >
                                View Site →
                            </Link>
                            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {user?.role}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
