'use client';

import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const { user, isAdmin, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAdmin) {
            router.push('/dashboard');
        }
    }, [loading, isAdmin, router]);

    if (loading) return <div>Loading...</div>;
    if (!isAdmin) return null;

    return <div>Admin Panel Content</div>;
}
