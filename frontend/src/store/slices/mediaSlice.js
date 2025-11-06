import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from "../../libs/axios";


// Async thunks
export const fetchMedia = createAsyncThunk(
    'media/fetchMedia',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams(filters).toString();
            const { data } = await axiosInstance.get(`/media?${params}`);
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
                    if (metadata[key] !== undefined && metadata[key] !== null) {
                        formData.append(key, metadata[key]);
                    }
                });
            }

            const { data } = await axiosInstance.post('/media/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });


            return data.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.message ||
                'Failed to upload media';
            return rejectWithValue(errorMessage);
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

            const { data } = await axiosInstance.post('/media/upload-multiple', formData, {
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
            const { data } = await axiosInstance.put(`/media/${id}`, metadata);
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
            await axiosInstance.delete(`/media/${id}`);
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