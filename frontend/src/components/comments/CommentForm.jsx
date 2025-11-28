'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment } from '@/store/slices/commentSlice';


export default function CommentForm({ contentId, parentId = null, onSuccess, onCancel }) {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { loading } = useSelector((state) => state.comment);

    const [formData, setFormData] = useState({
        body: '',
        guestName: '',
        guestEmail: '',
        guestWebsite: ''
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!formData.body.trim()) {
            setError('Comment body is required');
            return;
        }

        if (!isAuthenticated) {
            if (!formData.guestName.trim()) {
                setError('Name is required');
                return;
            }
            if (!formData.guestEmail.trim()) {
                setError('Email is required');
                return;
            }
            if (formData.guestEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.guestEmail)) {
                setError('Please enter a valid email address');
                return;
            }
        }

        try {
            const commentData = {
                contentId,
                body: formData.body,
                ...(parentId && { parentId }),
                ...(!isAuthenticated && {
                    guestName: formData.guestName,
                    guestEmail: formData.guestEmail,
                    guestWebsite: formData.guestWebsite || ''
                })
            };

            await dispatch(createComment(commentData)).unwrap();
            
            // Reset form
            setFormData({
                body: '',
                guestName: '',
                guestEmail: '',
                guestWebsite: ''
            });

            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err || 'Failed to submit comment');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="alert alert-error text-sm">
                    <span>{error}</span>
                </div>
            )}

            {/* Guest fields for non-authenticated users */}
            {!isAuthenticated && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="label">
                            <span className="label-text">Name *</span>
                        </label>
                        <input
                            type="text"
                            name="guestName"
                            value={formData.guestName}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            required
                        />
                    </div>
                    <div>
                        <label className="label">
                            <span className="label-text">Email *</span>
                        </label>
                        <input
                            type="email"
                            name="guestEmail"
                            value={formData.guestEmail}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="label">
                            <span className="label-text">Website (optional)</span>
                        </label>
                        <input
                            type="url"
                            name="guestWebsite"
                            value={formData.guestWebsite}
                            onChange={handleChange}
                            className="input input-bordered w-full"
                            placeholder="https://example.com"
                        />
                    </div>
                </div>
            )}

            {/* Comment body */}
            <div>
                <label className="label">
                    <span className="label-text">Comment *</span>
                </label>
                <textarea
                    name="body"
                    value={formData.body}
                    onChange={handleChange}
                    className="textarea textarea-bordered w-full min-h-[120px]"
                    placeholder="Write your comment here..."
                    required
                />
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 justify-end">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="btn btn-ghost"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : parentId ? 'Reply' : 'Post Comment'}
                </button>
            </div>
        </form>
    );
}

