
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api');

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Async thunks
export const getAnalytics = createAsyncThunk(
    'analytics/getAnalytics',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/analytics');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
        }
    }
);

// Initial state
const initialState = {
    data: null,
    loading: false,
    error: null
};

// Slice
const analyticsSlice = createSlice({
    name: 'analytics',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAnalytics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(getAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
