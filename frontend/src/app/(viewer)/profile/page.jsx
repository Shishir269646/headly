'use client';

import { useAuth } from '@/hooks/useAuth';
import withAuth from '@/hoc/withAuth';
import axios from '@/libs/axios';
import { useToast } from '@/hooks/useToast';
import { FaTrash } from 'react-icons/fa';
import ProfilePageComponent from '@/components/profile/ProfilePage';

function ViewerProfilePage() {
    const { user, logout } = useAuth();
    const { addToast } = useToast();

    const handleDeleteAccount = async () => {
        if (window.confirm('Are you sure you want to delete your account? This action is irreversible.')) {
            try {
                await axios.delete('/users/profile/me');
                addToast('Account deleted successfully.', 'success');
                logout(); // Log out after account deletion
            } catch (error) {
                addToast(error.response?.data?.message || error.message || 'Failed to delete account.', 'error');
            }
        }
    };
    
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 lg:p-10 space-y-8">
            <ProfilePageComponent user={user} isDashboard={false} />

            <div className="card bg-base-100 shadow-xl border border-error">
                <div className="card-body">
                    <h2 className="card-title text-error">Delete Account</h2>
                    <p>Once you delete your account, there is no going back. Please be certain.</p>
                    <div className="card-actions justify-end">
                        <button onClick={handleDeleteAccount} className="btn btn-error">
                            <FaTrash /> Delete My Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withAuth(ViewerProfilePage, ['viewer']);
