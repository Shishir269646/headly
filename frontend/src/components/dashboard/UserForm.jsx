'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import Link from 'next/link';
// Assuming you have daisyUI properly installed and configured in your Next.js project.

// Helper function to format ISO date string to YYYY-MM-DD for <input type="date">
const formatDate = (isoString) => {
    if (!isoString) return '';
    // new Date(isoString).toISOString().split('T')[0] converts "2023-10-26T10:00:00.000Z" to "2023-10-26"
    try {
        const date = new Date(isoString);
        // Check for "Invalid Date"
        if (isNaN(date.getTime())) return '';
        // Use a method that reliably gets YYYY-MM-DD in the local timezone or UTC
        return date.toISOString().split('T')[0];
    } catch (e) {
        return '';
    }
};

export default function UserForm({ isEditMode, user, onSubmit, isSubmitting }) {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            role: user?.role || 'user',
            isActive: user?.isActive || true

        }
    });

    useEffect(() => {
        if (user) {
            setValue('name', user.name || '');
            setValue('email', user.email || '');
            setValue('role', user.role || 'user');
            setValue('isActive', user.isActive ?? true);
        }
    }, [user, setValue]);

    return (
        <div className="mx-auto max-w-3xl py-8 px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
                <header className="pb-6 border-b border-base-200">
                    <h1 className="text-3xl font-extrabold leading-tight text-base-content">
                        {isEditMode ? 'Edit User' : 'Create New User'}
                    </h1>
                    <p className="mt-2 text-base text-base-content/70">
                        {isEditMode ? `Editing user: ${user?.name || ''}` : 'Fill in the details to create a new user account.'}
                    </p>
                </header>

                <div className="card bg-base-100 shadow-xl p-6 sm:p-8 border border-base-200">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name Field */}
                        <div className="form-control w-full">
                            <label htmlFor="name" className="label">
                                <span className="label-text font-medium">Full Name</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                placeholder="Enter full name"
                                {...register('name', { required: 'Name is required' })}
                                className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                            />
                            {errors.name && <p className="label-text-alt text-error mt-1">{errors.name.message}</p>}
                        </div>

                        {/* Email Field */}
                        <div className="form-control w-full">
                            <label htmlFor="email" className="label">
                                <span className="label-text font-medium">Email Address</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                placeholder="user@example.com"
                                {...register('email', {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /\S+@\S+\.\S+/,
                                        message: 'Invalid email address'
                                    }
                                })}
                                className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
                            />
                            {errors.email && <p className="label-text-alt text-error mt-1">{errors.email.message}</p>}
                        </div>



                        {/* Password Field (Create Mode Only) */}
                        {!isEditMode && (
                            <div className="form-control w-full">
                                <label htmlFor="password" className="label">
                                    <span className="label-text font-medium">Password</span>
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="••••••••"
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                    })}
                                    className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                                />
                                {errors.password && <p className="label-text-alt text-error mt-1">{errors.password.message}</p>}
                            </div>
                        )}

                        {/* Role Field */}
                        <div className="form-control w-full">
                            <label htmlFor="role" className="label">
                                <span className="label-text font-medium">Role</span>
                            </label>
                            <select
                                id="role"
                                {...register('role', { required: 'Role is required' })}
                                className={`select select-bordered w-full ${errors.role ? 'select-error' : ''}`}
                            >
                                <option value="user">User</option>
                                <option value="author">Author</option>
                                <option value="editor">Editor</option>
                                <option value="admin">Admin</option>
                            </select>
                            {errors.role && <p className="label-text-alt text-error mt-1">{errors.role.message}</p>}
                        </div>

                        {/* Active Toggle */}
                        <div className="form-control w-full pt-4 border-t border-base-200">
                            <label htmlFor="isActive" className="label cursor-pointer justify-start gap-4">
                                <span className="label-text font-medium">Active Status</span>
                                <input
                                    id="isActive"
                                    type="checkbox"
                                    {...register('isActive')}
                                    className="toggle toggle-primary"
                                />
                            </label>
                            <span className="label-text-alt text-base-content/70 ml-16 -mt-2">
                                Set user status to active or inactive.
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-6 border-t border-base-200 mt-8">
                            <div className="flex justify-end space-x-3">
                                <Link
                                    href="/dashboard/users"
                                    className="btn btn-ghost"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                                >
                                    {isSubmitting ? 'Saving...' : (isEditMode ? 'Update User' : 'Create User')}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}