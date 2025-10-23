// pages/dashboard/contents/new/page.js
'use client';

import { useContent } from '@/hooks/useContent';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';

export default function CreateContentPage() {
    const { create } = useContent();
    const toast = useToast();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            title: e.target.title.value,
            body: e.target.body.value,
            status: 'draft'
        };

        try {
            await create(formData);
            toast.success('Content created!');
            router.push('/dashboard/contents');
        } catch (error) {
            toast.error('Failed to create content');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="title" placeholder="Title" required />
            <textarea name="body" placeholder="Content" required />
            <button type="submit">Create</button>
        </form>
    );
}
