'use client';

import { useMedia } from '@/hooks/useMedia';
import { useToast } from '@/hooks/useToast';
import { useRef } from 'react';

export default function ImageUploadButton({ editor }) {
    const { upload, uploading } = useMedia();
    const toast = useToast();
    const fileInputRef = useRef(null);

    const handleFileChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select a valid image file.');
            return;
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            toast.error('Image size must be less than 10MB.');
            return;
        }

        try {
            // Upload with proper metadata following backend requirements
            const result = await upload(file, {
                folder: 'content-images',
                alt: 'Content Image'
            });

            // Handle Redux thunk response structure
            const media = result.payload || result;
            
            if (media && media.url) {
                editor.chain().focus().setImage({ src: media.url }).run();
                toast.success('Image uploaded and inserted!');
            } else {
                toast.error('Failed to get image URL after upload.');
            }
        } catch (error) {
            const errorMessage = error?.payload || error?.message || 'Image upload failed.';
            toast.error(errorMessage);
            console.error('Image upload error:', error);
        } finally {
            // Reset input to allow uploading the same file again
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                disabled={uploading}
            />
            <button
                onClick={handleClick}
                disabled={uploading}
                className="px-3 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
                title="Add Image"
            >
                {uploading ? 'Uploading...' : '🖼️'}
            </button>
        </>
    );
}
