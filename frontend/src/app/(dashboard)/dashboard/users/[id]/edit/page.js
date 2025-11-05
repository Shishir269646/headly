'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditUserRedirect() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    useEffect(() => {
        if (id) {
            router.replace(`/dashboard/users/new?id=${id}`);
        }
    }, [id, router]);

    return null;
}