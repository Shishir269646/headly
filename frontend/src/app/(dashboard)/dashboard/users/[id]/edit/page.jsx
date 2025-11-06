'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useToast } from '@/hooks/useToast';
// Assuming 'update' is available via the useUser hook
import { useUser } from '@/hooks/useUser';
import UserForm from '@/components/dashboard/UserForm';

export default function EditUserPage() {
    const router = useRouter();
    const { id } = useParams();
    const { currentUser, getUserById, loading, error, update } = useUser(); // 💡 Assuming 'update' is here
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. Fetch user data on mount or ID change
    useEffect(() => {
        if (id) {
            // Ensure id is treated as a string for API call if it comes from URL
            getUserById(Array.isArray(id) ? id[0] : id);
        }
    }, [id, getUserById]);

    // Handle update
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const userId = Array.isArray(id) ? id[0] : id;

        try {
            // Make sure the update function is imported/available (e.g., from useUser)
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

    // 2. Handle Loading State
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading user data...</p>
                </div>
            </div>
        );
    }

    // 3. Handle Error State (e.g., API failure)
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

    // 4. Handle "User Not Found" State (after loading and no error)
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

    // 5. Render Form
    return (
        <UserForm
            isEditMode={true}
            user={currentUser}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
        />
    );
}