"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCommentsByContent, getCommentCount, clearComments } from '@/store/slices/commentSlice';
import CommentList from '@/components/comments/CommentList';
import CommentForm from '@/components/comments/CommentForm';

/**
 * Displays comments section for an article with nested replies support.
 * @param {Object} props - Component props.
 * @param {string} props.contentId - The content ID to fetch comments for.
 */
export default function ArticleCommentSection({ contentId }) {
    const dispatch = useDispatch();
    const { comments, commentCount, loading, error } = useSelector((state) => state.comment);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (contentId) {
            dispatch(getCommentsByContent({ contentId, status: 'approved' }));
            dispatch(getCommentCount({ contentId, status: 'approved' }));
        }

        return () => {
            dispatch(clearComments());
        };
    }, [contentId, dispatch]);

    const handleCommentSuccess = () => {
        setShowForm(false);
        // Refresh comments
        dispatch(getCommentsByContent({ contentId, status: 'approved' }));
        dispatch(getCommentCount({ contentId, status: 'approved' }));
    };

    return (
        <div className="mt-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-base-content">
                    {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}
                </h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn btn-primary btn-sm"
                >
                    {showForm ? 'Cancel' : 'Leave a Comment'}
                </button>
            </div>

            {/* Comment form */}
            {showForm && (
                <div className="mb-8 p-6 bg-base-300 rounded-lg">
                    <CommentForm
                        contentId={contentId}
                        onSuccess={handleCommentSuccess}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            )}

            {/* Loading state */}
            {loading && comments.length === 0 && (
                <div className="text-center py-8 text-base-content/70">
                    <span className="loading loading-spinner loading-md"></span>
                    <p className="mt-2">Loading comments...</p>
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="alert alert-error mb-4">
                    <span>{error}</span>
                </div>
            )}

            {/* Comments list */}
            {!loading && <CommentList comments={comments} />}
        </div>
    );
}