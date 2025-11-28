'use client';

import React from 'react';
import CommentItem from './CommentItem';

export default function CommentList({ comments = [] }) {
    if (!comments || comments.length === 0) {
        return (
            <div className="text-center py-8 text-base-content/70">
                <p>No comments yet. Be the first to comment!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {comments.map((comment) => (
                <CommentItem key={comment._id} comment={comment} />
            ))}
        </div>
    );
}

