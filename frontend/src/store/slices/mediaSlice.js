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
export const fetchMedia = createAsyncThunk(
    'media/fetchMedia',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams(filters).toString();
            const { data } = await api.get(`/media?${params}`);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch media');
        }
    }
);

export const uploadMedia = createAsyncThunk(
    'media/uploadMedia',
    async ({ file, metadata }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            if (metadata) {
                Object.keys(metadata).forEach(key => {
                    formData.append(key, metadata[key]);
                });
            }

            const { data } = await api.post('/media/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to upload media');
        }
    }
);

export const uploadMultipleMedia = createAsyncThunk(
    'media/uploadMultipleMedia',
    async (files, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('files', file);
            });

            const { data } = await api.post('/media/upload-multiple', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to upload media');
        }
    }
);

export const updateMedia = createAsyncThunk(
    'media/updateMedia',
    async ({ id, metadata }, { rejectWithValue }) => {
        try {
            const { data } = await api.put(`/media/${id}`, metadata);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update media');
        }
    }
);

export const deleteMedia = createAsyncThunk(
    'media/deleteMedia',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/media/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete media');
        }
    }
);

// Initial state
const initialState = {
    media: [],
    pagination: {
        total: 0,
        page: 1,
        pages: 1
    },
    uploading: false,
    loading: false,
    error: null
};

// Slice
const mediaSlice = createSlice({
    name: 'media',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Media
            .addCase(fetchMedia.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMedia.fulfilled, (state, action) => {
                state.loading = false;
                state.media = action.payload.media;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchMedia.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Upload Media
            .addCase(uploadMedia.pending, (state) => {
                state.uploading = true;
                state.error = null;
            })
            .addCase(uploadMedia.fulfilled, (state, action) => {
                state.uploading = false;
                state.media.unshift(action.payload);
            })
            .addCase(uploadMedia.rejected, (state, action) => {
                state.uploading = false;
                state.error = action.payload;
            })
            // Upload Multiple Media
            .addCase(uploadMultipleMedia.pending, (state) => {
                state.uploading = true;
                state.error = null;
            })
            .addCase(uploadMultipleMedia.fulfilled, (state, action) => {
                state.uploading = false;
                state.media = [...action.payload, ...state.media];
            })
            .addCase(uploadMultipleMedia.rejected, (state, action) => {
                state.uploading = false;
                state.error = action.payload;
            })
            // Update Media
            .addCase(updateMedia.fulfilled, (state, action) => {
                const index = state.media.findIndex(m => m._id === action.payload._id);
                if (index !== -1) {
                    state.media[index] = action.payload;
                }
            })
            // Delete Media
            .addCase(deleteMedia.fulfilled, (state, action) => {
                state.media = state.media.filter(m => m._id !== action.payload);
            });
    }
});

export const { clearError } = mediaSlice.actions;
export default mediaSlice.reducer;