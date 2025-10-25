// ============================================
// 📄 app/(dashboard)/dashboard/contents/new/page.js
// Create New Content Page
// ============================================

'use client';

import ContentForm from '@/components/content/ContentForm';

export default function NewContentPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Create New Content</h1>
                <p className="text-gray-600 mt-1">Write and publish your content</p>
            </div>
            <ContentForm />
        </div>
    );
}


