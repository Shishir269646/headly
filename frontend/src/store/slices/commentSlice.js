import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../libs/axios';

// Async thunks
export const getCommentsByContent = createAsyncThunk(
    'comment/getCommentsByContent',
    async ({ contentId, status = 'approved' }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`/comments/content/${contentId}`, {
                params: { status, includeReplies: 'true' }
            });
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
        }
    }
);

export const createComment = createAsyncThunk(
    'comment/createComment',
    async (commentData, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post('/comments', commentData);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create comment');
        }
    }
);

export const updateComment = createAsyncThunk(
    'comment/updateComment',
    async ({ commentId, body }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.put(`/comments/${commentId}`, { body });
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update comment');
        }
    }
);

export const deleteComment = createAsyncThunk(
    'comment/deleteComment',
    async (commentId, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/comments/${commentId}`);
            return commentId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
        }
    }
);

export const toggleLike = createAsyncThunk(
    'comment/toggleLike',
    async (commentId, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`/comments/${commentId}/like`);
            return { commentId, ...data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to toggle like');
        }
    }
);

export const getCommentCount = createAsyncThunk(
    'comment/getCommentCount',
    async ({ contentId, status = 'approved' }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`/comments/content/${contentId}/count`, {
                params: { status }
            });
            return data.data.count;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch comment count');
        }
    }
);

// Admin thunks
export const getAllComments = createAsyncThunk(
    'comment/getAllComments',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get('/comments', { params: filters });
            return {
                comments: data.data,
                pagination: data.pagination
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
        }
    }
);

export const moderateComment = createAsyncThunk(
    'comment/moderateComment',
    async ({ commentId, status }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.put(`/comments/${commentId}/moderate`, { status });
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to moderate comment');
        }
    }
);

export const bulkModerateComments = createAsyncThunk(
    'comment/bulkModerateComments',
    async ({ commentIds, status }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.put('/comments/bulk/moderate', {
                commentIds,
                status
            });
            return { commentIds, status };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to bulk moderate comments');
        }
    }
);

export const getCommentStats = createAsyncThunk(
    'comment/getCommentStats',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get('/comments/stats/overview');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch comment stats');
        }
    }
);

// Initial state
const initialState = {
    comments: [],
    commentCount: 0,
    loading: false,
    error: null,
    // Admin state
    allComments: [],
    stats: null,
    pagination: null
};

// Slice
const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearComments: (state) => {
            state.comments = [];
            state.commentCount = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get comments by content
            .addCase(getCommentsByContent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCommentsByContent.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = action.payload;
            })
            .addCase(getCommentsByContent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create comment
            .addCase(createComment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.loading = false;
                // Add new comment to the list
                if (action.payload.parent) {
                    // Find parent and add reply
                    const addReply = (comments) => {
                        for (const comment of comments) {
                            if (comment._id === action.payload.parent) {
                                if (!comment.replies) comment.replies = [];
                                comment.replies.push(action.payload);
                                return true;
                            }
                            if (comment.replies && addReply(comment.replies)) {
                                return true;
                            }
                        }
                        return false;
                    };
                    addReply(state.comments);
                } else {
                    state.comments.push(action.payload);
                }
                state.commentCount += 1;
            })
            .addCase(createComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update comment
            .addCase(updateComment.fulfilled, (state, action) => {
                const updateCommentInList = (comments) => {
                    for (const comment of comments) {
                        if (comment._id === action.payload._id) {
                            Object.assign(comment, action.payload);
                            return true;
                        }
                        if (comment.replies && updateCommentInList(comment.replies)) {
                            return true;
                        }
                    }
                    return false;
                };
                updateCommentInList(state.comments);
            })
            // Delete comment
            .addCase(deleteComment.fulfilled, (state, action) => {
                const removeComment = (comments) => {
                    const index = comments.findIndex(c => c._id === action.payload);
                    if (index > -1) {
                        comments.splice(index, 1);
                        state.commentCount = Math.max(0, state.commentCount - 1);
                        return true;
                    }
                    for (const comment of comments) {
                        if (comment.replies && removeComment(comment.replies)) {
                            return true;
                        }
                    }
                    return false;
                };
                removeComment(state.comments);
            })
            // Toggle like
            .addCase(toggleLike.fulfilled, (state, action) => {
                const updateLike = (comments) => {
                    for (const comment of comments) {
                        if (comment._id === action.payload.commentId) {
                            comment.likes = action.payload.likes;
                            return true;
                        }
                        if (comment.replies && updateLike(comment.replies)) {
                            return true;
                        }
                    }
                    return false;
                };
                updateLike(state.comments);
            })
            // Get comment count
            .addCase(getCommentCount.fulfilled, (state, action) => {
                state.commentCount = action.payload;
            })
            // Get all comments (admin)
            .addCase(getAllComments.fulfilled, (state, action) => {
                state.allComments = action.payload.comments;
                state.pagination = action.payload.pagination;
            })
            // Moderate comment
            .addCase(moderateComment.fulfilled, (state, action) => {
                const updateComment = (comments) => {
                    for (const comment of comments) {
                        if (comment._id === action.payload._id) {
                            comment.status = action.payload.status;
                            return true;
                        }
                        if (comment.replies && updateComment(comment.replies)) {
                            return true;
                        }
                    }
                    return false;
                };
                updateComment(state.comments);
                // Also update in allComments if exists
                const index = state.allComments.findIndex(c => c._id === action.payload._id);
                if (index > -1) {
                    state.allComments[index].status = action.payload.status;
                }
            })
            // Bulk moderate
            .addCase(bulkModerateComments.fulfilled, (state, action) => {
                state.allComments = state.allComments.map(comment =>
                    action.payload.commentIds.includes(comment._id)
                        ? { ...comment, status: action.payload.status }
                        : comment
                );
            })
            // Get stats
            .addCase(getCommentStats.fulfilled, (state, action) => {
                state.stats = action.payload;
            });
    }
});

export const { clearError, clearComments } = commentSlice.actions;
export default commentSlice.reducer;

