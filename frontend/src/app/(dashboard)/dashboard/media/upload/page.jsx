'use client';

import { useMedia } from '@/hooks/useMedia';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function UploadMediaPage() {
    const { upload, uploadMultiple, uploading } = useMedia();
    const toast = useToast();
    const router = useRouter();
    const [preview, setPreview] = useState(null);
    const [metadata, setMetadata] = useState({
        alt: '',
        caption: '',
        folder: 'general'
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        const file = e.target.elements.file.files[0];
        if (!file) return;

        try {
            await upload(file, metadata);
            toast.success('Media uploaded successfully!');
            router.push('/dashboard/media');
        } catch (error) {
            toast.error('Upload failed');
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Upload Media</h1>
                <p className="text-gray-600 mt-1">Add images, videos, or documents</p>
            </div>

            <form onSubmit={handleUpload} className="bg-white rounded-lg shadow p-6 space-y-6">
                {/* File Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Choose File
                    </label>
                    <input
                        type="file"
                        name="file"
                        accept="image/*,video/*,.pdf,.doc,.docx"
                        onChange={handleFileChange}
                        required
                        className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
                    />
                </div>

                {/* Preview */}
                {preview && (
                    <div className="border rounded-lg p-4">
                        <img src={preview} alt="Preview" className="max-w-full h-auto rounded" />
                    </div>
                )}

                {/* Alt Text */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alt Text
                    </label>
                    <input
                        type="text"
                        value={metadata.alt}
                        onChange={(e) => setMetadata({ ...metadata, alt: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Description for accessibility"
                    />
                </div>

                {/* Caption */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Caption
                    </label>
                    <input
                        type="text"
                        value={metadata.caption}
                        onChange={(e) => setMetadata({ ...metadata, caption: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Optional caption"
                    />
                </div>

                {/* Folder */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Folder
                    </label>
                    <select
                        value={metadata.folder}
                        onChange={(e) => setMetadata({ ...metadata, folder: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="general">General</option>
                        <option value="blog-images">Blog Images</option>
                        <option value="featured-images">Featured Images</option>
                        <option value="documents">Documents</option>
                    </select>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-6 py-2 border rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={uploading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
            </form>

            {/* Toast */}
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
