// ============================================
// 📄 app/(dashboard)/dashboard/profile/page.js
// User Profile Page
// ============================================

'use client';

import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { formatImageUrl } from '@/libs/utils';
import { useToast } from '@/hooks/useToast';
import { useState, useRef } from 'react';

export default function ProfilePage() {
    const { user } = useAuth();
    const { updateMyProfile, uploadUserimage } = useUser();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [imageFile, setimageFile] = useState(null);
    const [imagePreview, setimagePreview] = useState(null);
    const [imageUploading, setimageUploading] = useState(false);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        bio: user?.bio || ''
    });

    const handleimageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file.');
            return;
        }

        // Validate file size (max 5MB for images)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            toast.error('image size must be less than 5MB.');
            return;
        }

        // Clean up previous preview URL to prevent memory leaks
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setimageFile(file);
        setimagePreview(URL.createObjectURL(file));
    };

    const handleimageUpload = async () => {
        if (!imageFile) return;

        setimageUploading(true);
        try {
            // Upload image following backend requirements
            // Backend expects field name 'image' at /users/profile/image
            const result = await uploadUserimage(imageFile);
            
            // Handle Redux thunk response structure
            const userData = result.payload || result;
            
            if (userData && (userData.image?.url || userData.image?._id)) {
                toast.success('image uploaded successfully!');
                // Clean up preview URL
                if (imagePreview) {
                    URL.revokeObjectURL(imagePreview);
                }
                setimageFile(null);
                setimagePreview(null);
                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                toast.error('image uploaded but failed to get updated user data.');
            }
        } catch (error) {
            const errorMessage = error?.payload || error?.message || 'Failed to upload image.';
            toast.error(errorMessage);
            console.error('image upload error:', error);
        } finally {
            setimageUploading(false);
        }
    };

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
                    <img 
                        src={
                            user?.image?.url
                                ? formatImageUrl(user.image.url)
                                : (user?.image || `https://ui-images.com/api/?name=${user?.name}&background=random`)
                        }
                        alt="image"
                        className="w-20 h-20 rounded-full object-cover"
                    />
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
                            image
                        </label>
                        <div className="flex items-center space-x-4">
                            <img 
                                src={
                                    imagePreview || (user?.image?.url
                                        ? formatImageUrl(user.image.url)
                                        : (user?.image || `https://ui-images.com/api/?name=${user?.name}&background=random`))
                                }
                                alt="image"
                                className="w-20 h-20 rounded-full object-cover"
                            />
                            <input 
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleimageChange}
                                className="hidden"
                            />
                            <button 
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                            >
                                Change
                            </button>
                            {imageFile && (
                                <button 
                                    type="button"
                                    onClick={handleimageUpload}
                                    disabled={imageUploading}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                >
                                    {imageUploading ? 'Uploading...' : 'Upload'}
                                </button>
                            )}
                        </div>
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

