'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from '@/libs/axios';
import { useToast } from '@/hooks/useToast';
import Loader from '../common/Loader';

// A reusable form component for creating/editing a category
function CategoryForm({ onSubmit, isSubmitting, defaultValues = {}, onCancel }) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues });

    useEffect(() => {
        reset(defaultValues);
    }, [defaultValues, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 card bg-base-100 shadow-lg p-6 border border-base-200">
            <div className="form-control">
                <label htmlFor="name" className="label">
                    <span className="label-text font-medium">Category Name</span>
                </label>
                <input
                    type="text"
                    id="name"
                    placeholder="e.g., Technology"
                    {...register('name', { required: 'Name is required' })}
                    className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
                />
                {errors.name && <p className="text-error text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div className="form-control">
                <label htmlFor="description" className="label">
                    <span className="label-text font-medium">Description</span>
                </label>
                <textarea
                    id="description"
                    placeholder="A short description of the category."
                    {...register('description')}
                    className="textarea textarea-bordered w-full"
                />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="btn btn-ghost">Cancel</button>
                <button type="submit" disabled={isSubmitting} className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}>
                    {isSubmitting ? 'Saving...' : 'Save Category'}
                </button>
            </div>
        </form>
    );
}

// The main manager component
export default function CategoryManager() {
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null); // null for new, or category object for editing
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { success, error } = useToast();

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/categories');
            setCategories(response.data.data);
        } catch (err) {
            error('Failed to fetch categories.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleFormSubmit = async (data) => {
        setIsSubmitting(true);
        const isEditMode = !!editingCategory?._id;
        const url = isEditMode ? `/categories/${editingCategory._id}` : '/categories';
        const method = isEditMode ? 'put' : 'post';

        try {
            const response = await axios[method](url, data);
            success(`Category ${isEditMode ? 'updated' : 'created'} successfully!`);
            setEditingCategory(null); // Close the form
            fetchCategories(); // Refresh the list
        } catch (err) {
            const errorMessage = err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} category.`;
            error(errorMessage);
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await axios.delete(`/categories/${categoryId}`);
                success('Category deleted successfully.');
                fetchCategories(); // Refresh list
            } catch (err) {
                const errorMessage = err.response?.data?.message || 'Failed to delete category.';
                error(errorMessage);
                console.error(err);
            }
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setEditingCategory(null);
    };

    return (
        <div className="space-y-8">
            {/* Form Section */}
            <div>
                <h2 className="text-xl font-semibold mb-3">{editingCategory?._id ? 'Edit Category' : 'Create New Category'}</h2>
                <CategoryForm
                    onSubmit={handleFormSubmit}
                    isSubmitting={isSubmitting}
                    defaultValues={editingCategory || { name: '', description: '' }}
                    onCancel={handleCancel}
                />
            </div>

            {/* List Section */}
            <div className="card bg-base-100 shadow-lg p-6 border border-base-200">
                <h2 className="text-xl font-semibold mb-4">Existing Categories</h2>
                {isLoading ? (
                    <Loader />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(cat => (
                                    <tr key={cat._id} className="hover">
                                        <td className="font-medium">{cat.name}</td>
                                        <td>{cat.description || '-'}</td>
                                        <td>
                                            <div className="flex space-x-2">
                                                <button onClick={() => handleEdit(cat)} className="btn btn-sm btn-outline btn-primary">Edit</button>
                                                <button onClick={() => handleDelete(cat._id)} className="btn btn-sm btn-outline btn-error">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {categories.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="text-center py-4">No categories found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
