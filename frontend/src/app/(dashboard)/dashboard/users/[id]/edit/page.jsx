'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
import { useUser } from '@/hooks/useUser';
import UserForm from '@/components/dashboard/UserForm';
import Loader from '@/components/common/Loader';

export default function EditUserPage() {
    const router = useRouter();
    const { id } = useParams();
    const { currentUser, getUserById, loading, error, update } = useUser();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        if (id) {

            getUserById(Array.isArray(id) ? id[0] : id);
        }
    }, [id, getUserById]);

    // Handle update
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const userId = Array.isArray(id) ? id[0] : id;

        try {

            const resultAction = await update(userId, data);

            if (resultAction.meta?.requestStatus === 'fulfilled') {
                toast.success('User updated successfully!');
                router.push('/dashboard/users');
            } else {
                const message = resultAction.payload || 'Failed to update user';
                toast.error(message);
            }
        } catch (err) {
            const errorMessage = err?.message || err?.payload || 'An error occurred during update';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle Loading State
    if (loading) {
        return (
            <Loader />
        );
    }

    //  Handle Error State
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-red-700">Error Loading User</h2>
                    <p className="text-gray-600 mt-2">{error || 'An unknown error occurred while fetching the user.'}</p>
                    {/* Optionally: a button to retry fetching */}
                </div>
            </div>
        );
    }

    //Handle "User Not Found" State
    if (!currentUser) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-700">User Not Found</h2>
                    <p className="text-gray-600 mt-2">The requested user ID does not exist or could not be loaded.</p>
                </div>
            </div>
        );
    }

    // Render Form
    return (
        <UserForm
            isEditMode={true}
            user={currentUser}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
        />
    );
}