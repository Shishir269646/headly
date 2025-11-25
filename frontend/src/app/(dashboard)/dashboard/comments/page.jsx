'use client';

import withAuth from '@/hoc/withAuth';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import {
    getAllComments,
    moderateComment,
    bulkModerateComments,
    getCommentStats,
    deleteComment
} from '@/store/slices/commentSlice';


function CommentsPage() {
    const dispatch = useDispatch();
    const { allComments, stats, pagination, loading } = useSelector((state) => state.comment);
    const { user } = useSelector((state) => state.auth);

    const [filters, setFilters] = useState({
        status: '',
        search: '',
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });
    const [selectedComments, setSelectedComments] = useState([]);
    const [bulkAction, setBulkAction] = useState('');

    useEffect(() => {
        dispatch(getAllComments(filters));
        dispatch(getCommentStats());
    }, [dispatch, filters]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 1 // Reset to first page
        }));
        setSelectedComments([]);
    };

    const handleModerate = async (commentId, status) => {
        try {
            await dispatch(moderateComment({ commentId, status })).unwrap();
            // Refresh comments
            dispatch(getAllComments(filters));
            dispatch(getCommentStats());
        } catch (error) {
            alert(error || 'Failed to moderate comment');
        }
    };

    const handleBulkAction = async () => {
        if (!bulkAction || selectedComments.length === 0) {
            alert('Please select comments and an action');
            return;
        }

        if (!confirm(`Are you sure you want to ${bulkAction} ${selectedComments.length} comment(s)?`)) {
            return;
        }

        try {
            await dispatch(bulkModerateComments({
                commentIds: selectedComments,
                status: bulkAction
            })).unwrap();
            setSelectedComments([]);
            setBulkAction('');
            dispatch(getAllComments(filters));
            dispatch(getCommentStats());
        } catch (error) {
            alert(error || 'Failed to perform bulk action');
        }
    };

    const handleDelete = async (commentId) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        try {
            await dispatch(deleteComment(commentId)).unwrap();
            dispatch(getAllComments(filters));
            dispatch(getCommentStats());
        } catch (error) {
            alert(error || 'Failed to delete comment');
        }
    };

    const toggleSelectComment = (commentId) => {
        setSelectedComments(prev =>
            prev.includes(commentId)
                ? prev.filter(id => id !== commentId)
                : [...prev, commentId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedComments.length === allComments.length) {
            setSelectedComments([]);
        } else {
            setSelectedComments(allComments.map(c => c._id));
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            approved: 'badge-success',
            pending: 'badge-warning',
            spam: 'badge-error',
            trash: 'badge-ghost'
        };
        return badges[status] || 'badge-ghost';
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">Comments</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage and moderate comments</p>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="stat bg-base-200 rounded-lg">
                        <div className="stat-title">Total</div>
                        <div className="stat-value text-2xl">{stats.total}</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg">
                        <div className="stat-title">Approved</div>
                        <div className="stat-value text-2xl text-success">{stats.approved}</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg">
                        <div className="stat-title">Pending</div>
                        <div className="stat-value text-2xl text-warning">{stats.pending}</div>
                    </div>
                    <div className="stat bg-base-200 rounded-lg">
                        <div className="stat-title">Spam</div>
                        <div className="stat-value text-2xl text-error">{stats.spam}</div>
                    </div>
                </div>
            )}

            {/* Filters and Bulk Actions */}
            <div className="card bg-base-100 shadow-xl mb-6">
                <div className="card-body">
                    <div className="flex flex-wrap gap-4 items-end">
                        {/* Status filter */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Status</span>
                            </label>
                            <select
                                className="select select-bordered"
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                <option value="">All</option>
                                <option value="approved">Approved</option>
                                <option value="pending">Pending</option>
                                <option value="spam">Spam</option>
                                <option value="trash">Trash</option>
                            </select>
                        </div>

                        {/* Search */}
                        <div className="form-control flex-1 min-w-[200px]">
                            <label className="label">
                                <span className="label-text">Search</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Search comments..."
                                className="input input-bordered"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                            />
                        </div>

                        {/* Sort */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Sort By</span>
                            </label>
                            <select
                                className="select select-bordered"
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                            >
                                <option value="createdAt">Date</option>
                                <option value="likes">Likes</option>
                            </select>
                        </div>

                        {/* Bulk Actions */}
                        {selectedComments.length > 0 && (
                            <div className="flex gap-2">
                                <select
                                    className="select select-bordered"
                                    value={bulkAction}
                                    onChange={(e) => setBulkAction(e.target.value)}
                                >
                                    <option value="">Bulk Action</option>
                                    <option value="approved">Approve</option>
                                    <option value="pending">Mark as Pending</option>
                                    <option value="spam">Mark as Spam</option>
                                    <option value="trash">Move to Trash</option>
                                </select>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleBulkAction}
                                    disabled={!bulkAction}
                                >
                                    Apply ({selectedComments.length})
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Comments Table */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-0">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    ) : allComments.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p>No comments found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th>
                                            <input
                                                type="checkbox"
                                                className="checkbox"
                                                checked={selectedComments.length === allComments.length && allComments.length > 0}
                                                onChange={toggleSelectAll}
                                            />
                                        </th>
                                        <th>Author</th>
                                        <th>Comment</th>
                                        <th>Content</th>
                                        <th>Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allComments.map((comment) => (
                                        <tr key={comment._id}>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <div className="avatar">
                                                        <div className="w-10 rounded-full">
                                                            <Image
                                                                src={comment.author?.image?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author?.name || comment.guestName || 'Anonymous')}&background=random`}
                                                                alt={comment.author?.name || comment.guestName}
                                                                width={40}
                                                                height={40}
                                                                loading="lazy"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold">
                                                            {comment.author?.name || comment.guestName || 'Anonymous'}
                                                        </div>
                                                        {comment.guestEmail && (
                                                            <div className="text-xs text-gray-500">
                                                                {comment.guestEmail}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="max-w-md">
                                                    <p className="line-clamp-2 text-sm">
                                                        {comment.body}
                                                    </p>
                                                    {comment.parent && (
                                                        <span className="badge badge-sm badge-ghost mt-1">
                                                            Reply
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-sm">
                                                    {comment.content?.title || 'N/A'}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="text-sm text-gray-500">
                                                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${getStatusBadge(comment.status)}`}>
                                                    {comment.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="flex gap-2">
                                                    {comment.status !== 'approved' && (
                                                        <button
                                                            className="btn btn-xs btn-success"
                                                            onClick={() => handleModerate(comment._id, 'approved')}
                                                        >
                                                            Approve
                                                        </button>
                                                    )}
                                                    {comment.status !== 'spam' && (
                                                        <button
                                                            className="btn btn-xs btn-warning"
                                                            onClick={() => handleModerate(comment._id, 'spam')}
                                                        >
                                                            Spam
                                                        </button>
                                                    )}
                                                    {comment.status !== 'trash' && (
                                                        <button
                                                            className="btn btn-xs btn-error"
                                                            onClick={() => handleModerate(comment._id, 'trash')}
                                                        >
                                                            Trash
                                                        </button>
                                                    )}
                                                    <button
                                                        className="btn btn-xs btn-ghost"
                                                        onClick={() => handleDelete(comment._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div className="flex justify-center items-center gap-2 p-4">
                            <button
                                className="btn btn-sm"
                                disabled={filters.page === 1}
                                onClick={() => handleFilterChange('page', filters.page - 1)}
                            >
                                Previous
                            </button>
                            <span className="text-sm">
                                Page {pagination.page} of {pagination.pages}
                            </span>
                            <button
                                className="btn btn-sm"
                                disabled={filters.page >= pagination.pages}
                                onClick={() => handleFilterChange('page', filters.page + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ... other components and functions

function AuthWrapper() {
    const AuthenticatedCommentsPage = withAuth(CommentsPage, ['admin', 'editor']);
    return <AuthenticatedCommentsPage />;
}

export default AuthWrapper;