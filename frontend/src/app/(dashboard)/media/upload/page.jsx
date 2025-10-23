'use client';

import { useMedia } from '@/hooks/useMedia';
import { useToast } from '@/hooks/useToast';

export default function MediaUploadPage() {
    const { upload, uploading } = useMedia();
    const toast = useToast();

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            await upload(file, { alt: 'Image', folder: 'blog' });
            toast.success('Media uploaded!');
        } catch (error) {
            toast.error('Upload failed');
        }
    };

    return (
        <div>
            <input
                type="file"
                onChange={handleUpload}
                disabled={uploading}
            />
            {uploading && <p>Uploading...</p>}
        </div>
    );
}
