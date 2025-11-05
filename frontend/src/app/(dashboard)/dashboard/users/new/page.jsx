'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/useToast';
import { useUser } from '@/hooks/useUser';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function NewUserPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const isEditMode = !!id;

    const { user: currentUser, isAdmin } = useAuth();
    const { addUser, updateUser, getUserById } = useUser();
    const toast = useToast();
    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm();

    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!isAdmin) {
            router.push('/dashboard');
            toast.error('Admin access required');
        }

        if (isEditMode) {
            const fetchUser = async () => {
                try {
                    const fetchedUser = await getUserById(id);
                    setUser(fetchedUser);
                    setValue('name', fetchedUser.name);
                    setValue('email', fetchedUser.email);
                    setValue('role', fetchedUser.role);
                    setValue('isActive', fetchedUser.isActive);
                } catch (error) {
                    toast.error('Failed to fetch user');
                    router.push('/dashboard/users');
                }
            };
            fetchUser();
        }
    }, [isAdmin, router, toast, isEditMode, id, getUserById, setValue]);

    const onSubmit = async (data) => {
        try {
            if (isEditMode) {
                await updateUser(id, data);
                toast.success('User updated successfully!');
            } else {
                await addUser(data);
                toast.success('User created successfully!');
            }
            router.push('/dashboard/users');
        } catch (error) {
            toast.error(error.message || 'An error occurred');
        }
    };

    if (!isAdmin) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {isEditMode ? 'Edit User' : 'Create New User'}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {isEditMode ? `Editing user: ${user?.name}` : 'Fill in the details to create a new user.'}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            {...register('name', { required: 'Name is required' })}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email address' } })}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    {!isEditMode && (
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                        </div>
                    )}

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                            Role
                        </label>
                        <select
                            id="role"
                            {...register('role', { required: 'Role is required' })}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="user">User</option>
                            <option value="author">Author</option>
                            <option value="editor">Editor</option>
                            <option value="admin">Admin</option>
                        </select>
                        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isActive"
                            {...register('isActive')}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                            Active
                        </label>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Link href="/dashboard/users" className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                        >
                            {isSubmitting ? 'Saving...' : (isEditMode ? 'Update User' : 'Create User')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
