'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format, formatDistanceToNow } from 'date-fns';
import { deleteComment, toggleLike } from '@/store/slices/commentSlice';
import CommentForm from './CommentForm';

export default function CommentItem({ comment, depth = 0, maxDepth = 5 }) {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const { loading } = useSelector((state) => state.comment);

    const [showReplyForm, setShowReplyForm] = useState(false);
    const [showReplies, setShowReplies] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    const isOwner = isAuthenticated && user?.id === comment.author?._id;
    const authorName = comment.author?.name || comment.guestName || 'Anonymous';
    const authorEmail = comment.author?.email || comment.guestEmail;
    const authorImage = comment.author?.image?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random`;

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this comment?')) return;
        
        setIsDeleting(true);
        try {
            await dispatch(deleteComment(comment._id)).unwrap();
        } catch (err) {
            alert(err || 'Failed to delete comment');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleLike = async () => {
        if (!isAuthenticated) {
            alert('Please login to like comments');
            return;
        }
        try {
            await dispatch(toggleLike(comment._id)).unwrap();
        } catch (err) {
            alert(err || 'Failed to like comment');
        }
    };

    const handleReplySuccess = () => {
        setShowReplyForm(false);
        setShowReplies(true);
    };

    if (comment.isDeleted) {
        return null;
    }

    return (
        <div className={`comment-item ${depth > 0 ? 'ml-8 mt-4 border-l-2 border-gray-200 dark:border-gray-700 pl-4' : ''}`}>
            <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
                {/* Avatar */}
                <div className="avatar shrink-0">
                    <div className="w-12 h-12 rounded-full">
                        <img src={authorImage} alt={authorName} />
                    </div>
                </div>

                {/* Comment content */}
                <div className="flex-1 min-w-0">
                    {/* Author info */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {authorName}
                        </span>
                        {comment.author && (
                            <span className="badge badge-sm badge-primary">Member</span>
                        )}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                        {comment.isEdited && (
                            <span className="text-xs text-gray-400 italic">(edited)</span>
                        )}
                    </div>

                    {/* Comment body */}
                    <div className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap mb-3">
                        {comment.body}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 flex-wrap">
                        <button
                            onClick={handleLike}
                            className="btn btn-xs btn-ghost text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                            disabled={loading}
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            {comment.likes || 0}
                        </button>

                        {depth < maxDepth && (
                            <button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="btn btn-xs btn-ghost text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-blue-400"
                            >
                                Reply
                            </button>
                        )}

                        {isOwner && (
                            <button
                                onClick={handleDelete}
                                className="btn btn-xs btn-ghost text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-red-400"
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        )}

                        {comment.replies && comment.replies.length > 0 && (
                            <button
                                onClick={() => setShowReplies(!showReplies)}
                                className="btn btn-xs btn-ghost text-gray-600 dark:text-gray-400"
                            >
                                {showReplies ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                            </button>
                        )}
                    </div>

                    {/* Reply form */}
                    {showReplyForm && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <CommentForm
                                contentId={comment.content}
                                parentId={comment._id}
                                onSuccess={handleReplySuccess}
                                onCancel={() => setShowReplyForm(false)}
                            />
                        </div>
                    )}

                    {/* Nested replies */}
                    {showReplies && comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 space-y-4">
                            {comment.replies.map((reply) => (
                                <CommentItem
                                    key={reply._id}
                                    comment={reply}
                                    depth={depth + 1}
                                    maxDepth={maxDepth}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

