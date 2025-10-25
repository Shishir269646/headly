// ============================================
// 📄 app/(dashboard)/dashboard/profile/page.js
// User Profile Page
// ============================================

'use client';

import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/useToast';
import { useState } from 'react';

export default function ProfilePage() {
    const { user } = useAuth();
    const { updateMyProfile } = useUser();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: user?.bio || '',
        avatar: user?.avatar || ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await updateMyProfile(formData);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                <p className="text-gray-600 mt-1">Manage your account information</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center space-x-4 mb-6 pb-6 border-b">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                        <p className="text-gray-600">{user?.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {user?.role}
                        </span>
                    </div>
                </div>

                {/* Edit Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bio
                        </label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            rows="4"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Avatar URL
                        </label>
                        <input
                            type="url"
                            value={formData.avatar}
                            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://example.com/avatar.jpg"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                <dl className="space-y-3">
                    <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Email</dt>
                        <dd className="text-sm font-medium text-gray-900">{user?.email}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Role</dt>
                        <dd className="text-sm font-medium text-gray-900">{user?.role}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-sm text-gray-600">Member Since</dt>
                        <dd className="text-sm font-medium text-gray-900">
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </dd>
                    </div>
                </dl>
            </div>

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

