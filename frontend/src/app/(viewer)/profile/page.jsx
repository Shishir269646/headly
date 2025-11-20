'use client';

import { useAuth } from '@/hooks/useAuth';
import withAuth from '@/hoc/withAuth';
import axios from '@/libs/axios';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useToast } from '@/hooks/useToast';
import { FaUser, FaEnvelope, FaImage, FaTrash } from 'react-icons/fa';

function ViewerProfilePage() {
    const { user, logout, fetchUser } = useAuth(); // Added fetchUser to refresh user data after update
    const { addToast } = useToast();
    const dispatch = useDispatch();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

    useEffect(() => {
        if (user) {
            reset({
                name: user.name,
                email: user.email,
            });
        }
    }, [user, reset]);

    const handleUpdateProfile = async (data) => {
        try {
            await axios.put('/users/profile/me', data);
            await fetchUser(); // Refresh user data in context after successful update
            addToast('Profile updated successfully!', 'success');
        } catch (error) {
            addToast(error.response?.data?.message || error.message || 'Failed to update profile.', 'error');
        }
    };

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
            <h1 className="text-3xl font-bold">My Profile</h1>
            
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title mb-6">Profile Information</h2>
                    <form onSubmit={handleSubmit(handleUpdateProfile)} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Full Name</span>
                            </label>
                            <div className="input-group">
                                <span><FaUser /></span>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                                    {...register('name', { required: 'Name is required' })}
                                />
                            </div>
                            {errors.name && <p className="text-error text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email Address</span>
                            </label>
                            <div className="input-group">
                                <span><FaEnvelope /></span>
                                <input
                                    type="email"
                                    placeholder="your.email@example.com"
                                    className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                                    {...register('email', { 
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^\S+@\S+$/i,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                />
                            </div>
                            {errors.email && <p className="text-error text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <div className="card-actions justify-end mt-6">
                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? 'Updating...' : 'Update Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

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
