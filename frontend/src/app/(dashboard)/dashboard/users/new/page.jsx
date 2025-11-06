'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { useUser } from '@/hooks/useUser';
import UserForm from '@/components/dashboard/UserForm';

export default function NewUserPage() {
    const router = useRouter();
    const { create: addUser } = useUser();
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await addUser(data);
            toast.success('User created successfully!');
            router.push('/dashboard/users');
        } catch (error) {
            const errorMessage = error?.message || error?.payload || 'An error occurred';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return <UserForm isEditMode={false} onSubmit={onSubmit} isSubmitting={isSubmitting} />;
}
