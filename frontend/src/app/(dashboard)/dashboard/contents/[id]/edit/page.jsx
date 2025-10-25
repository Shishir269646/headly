// ============================================
// 📄 app/(dashboard)/dashboard/contents/[id]/edit/page.js
// Edit Content Page
// ============================================

'use client';

import ContentForm from '@/components/content/ContentForm';

export default function EditContentPage({ params }) {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Edit Content</h1>
                <p className="text-gray-600 mt-1">Update your content</p>
            </div>
            <ContentForm contentId={params.id} />
        </div>
    );
}
