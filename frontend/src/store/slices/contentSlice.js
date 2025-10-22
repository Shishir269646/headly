import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api');

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Async thunks
export const fetchContents = createAsyncThunk(
    'content/fetchContents',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams(filters).toString();
            const { data } = await api.get(`/contents?${params}`);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch contents');
        }
    }
);

export const fetchContentById = createAsyncThunk(
    'content/fetchContentById',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/contents/${id}`);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch content');
        }
    }
);

export const fetchContentBySlug = createAsyncThunk(
    'content/fetchContentBySlug',
    async (slug, { rejectWithValue }) => {
        try {
            const { data } = await api.get(`/contents/slug/${slug}`);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch content');
        }
    }
);

export const createContent = createAsyncThunk(
    'content/createContent',
    async (contentData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/contents', contentData);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create content');
        }
    }
);

export const updateContent = createAsyncThunk(
    'content/updateContent',
    async ({ id, contentData }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/contents/${id}`, contentData);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update content');
        }
    }
);

export const deleteContent = createAsyncThunk(
    'content/deleteContent',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/contents/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete content');
        }
    }
);

export const publishContent = createAsyncThunk(
    'content/publishContent',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/contents/${id}/publish`);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to publish content');
        }
    }
);

export const scheduleContent = createAsyncThunk(
    'content/scheduleContent',
    async ({ id, publishAt }, { rejectWithValue }) => {
        try {
            const { data } = await api.post(`/contents/${id}/schedule`, { publishAt });
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to schedule content');
        }
    }
);

// Initial state
const initialState = {
    contents: [],
    currentContent: null,
    pagination: {
        total: 0,
        page: 1,
        pages: 1
    },
    loading: false,
    error: null
};

// Slice
const contentSlice = createSlice({
    name: 'content',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentContent: (state) => {
            state.currentContent = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Contents
            .addCase(fetchContents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContents.fulfilled, (state, action) => {
                state.loading = false;
                state.contents = action.payload.contents;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchContents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Content By ID
            .addCase(fetchContentById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContentById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentContent = action.payload;
            })
            .addCase(fetchContentById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch Content By Slug
            .addCase(fetchContentBySlug.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchContentBySlug.fulfilled, (state, action) => {
                state.loading = false;
                state.currentContent = action.payload;
            })
            .addCase(fetchContentBySlug.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create Content
            .addCase(createContent.fulfilled, (state, action) => {
                state.contents.unshift(action.payload);
            })
            // Update Content
            .addCase(updateContent.fulfilled, (state, action) => {
                const index = state.contents.findIndex(c => c._id === action.payload._id);
                if (index !== -1) {
                    state.contents[index] = action.payload;
                }
                if (state.currentContent?._id === action.payload._id) {
                    state.currentContent = action.payload;
                }
            })
            // Delete Content
            .addCase(deleteContent.fulfilled, (state, action) => {
                state.contents = state.contents.filter(c => c._id !== action.payload);
            })
            // Publish Content
            .addCase(publishContent.fulfilled, (state, action) => {
                const index = state.contents.findIndex(c => c._id === action.payload._id);
                if (index !== -1) {
                    state.contents[index] = action.payload;
                }
            })
            // Schedule Content
            .addCase(scheduleContent.fulfilled, (state, action) => {
                const index = state.contents.findIndex(c => c._id === action.payload._id);
                if (index !== -1) {
                    state.contents[index] = action.payload;
                }
            });
    }
});

export const { clearError, clearCurrentContent } = contentSlice.actions;
export default contentSlice.reducer;