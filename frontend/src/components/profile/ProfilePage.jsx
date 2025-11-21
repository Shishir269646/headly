// ============================================
// omponent 📄 /components/profile/ProfilePage.jsx
// ============================================

'use client';

import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { formatImageUrl } from '@/libs/utils';
import { useToast } from '@/hooks/useToast';
import { useState, useRef, useEffect } from 'react';

export default function ProfilePage({ user: initialUser, isDashboard = false }) {
    const { user: authUser, loading: authLoading } = useAuth();
    const { updateMyProfile, uploadUserimage } = useUser();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [imageFile, setimageFile] = useState(null);
    const [imagePreview, setimagePreview] = useState(null);
    const [imageUploading, setimageUploading] = useState(false);
    const fileInputRef = useRef(null);
    const [user, setUser] = useState(initialUser);

    useEffect(() => {
        if (isDashboard && authUser) {
            setUser(authUser);
        } else {
            setUser(initialUser);
        }
    }, [authUser, initialUser, isDashboard]);

    const [formData, setFormData] = useState({
        name: '',
        bio: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                bio: user.bio || ''
            });
        }
    }, [user]);

    const handleimageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file.');
            return;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            toast.error('image size must be less than 5MB.');
            return;
        }

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
            const result = await uploadUserimage(imageFile);
            const userData = result.payload || result;
            
            if (userData && (userData.image?.url || userData.image?._id)) {
                toast.success('image uploaded successfully!');
                if (imagePreview) {
                    URL.revokeObjectURL(imagePreview);
                }
                setimageFile(null);
                setimagePreview(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                // Update user state locally
                setUser(prevUser => ({ ...prevUser, image: userData.image }));
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
            // Dashboard users can update name and bio
            if (isDashboard) {
                await updateMyProfile(formData);
                toast.success('Profile updated successfully!');
                setUser(prevUser => ({ ...prevUser, ...formData }));
            } else {
                // Non-dashboard users (viewers) can only update bio
                await updateMyProfile({ bio: formData.bio });
                toast.success('Bio updated successfully!');
                setUser(prevUser => ({ ...prevUser, bio: formData.bio }));
            }
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || !user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg font-semibold dark:text-white">Loading profile...</div>
            </div>
        );
    }
    

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{isDashboard ? "Profile Settings" : "User Profile"}</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">{isDashboard ? "Manage your account information" : `Viewing profile of ${user.name}`}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center space-x-4 mb-6 pb-6 border-b dark:border-gray-700">
                    <img 
                        src={
                            imagePreview || (user.image?.url
                                ? formatImageUrl(user.image.url)
                                : `https://ui-images.com/api/?name=${user.name}&background=random`)
                        }
                        alt="image"
                        className="w-20 h-20 rounded-full object-cover"
                    />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                        <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full text-xs font-medium">
                            {user.role}
                        </span>
                    </div>
                </div>

                {/* Image Upload Section - Visible to all */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                        Profile Image
                    </label>
                    <div className="flex items-center space-x-4">
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
                            className="px-4 py-2 border dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
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

                <div className="mt-6">
                    {/* Common Bio Edit Form for both Dashboard and Viewer */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isDashboard && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                                Bio
                            </label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                rows="4"
                                className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 bg-white dark:bg-gray-700 dark:text-white"
                                placeholder="Tell us about yourself..."
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
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Information</h3>
                <dl className="space-y-3">
                    <div className="flex justify-between">
                        <dt className="text-sm text-gray-600 dark:text-gray-300">Email</dt>
                        <dd className="text-sm font-medium text-gray-900 dark:text-white">{user.email}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-sm text-gray-600 dark:text-gray-300">Role</dt>
                        <dd className="text-sm font-medium text-gray-900 dark:text-white">{user.role}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-sm text-gray-600 dark:text-gray-300">Member Since</dt>
                        <dd className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </dd>
                    </div>
                </dl>
            </div>


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
