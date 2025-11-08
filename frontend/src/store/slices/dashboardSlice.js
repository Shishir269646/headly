import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../libs/axios';

// Async thunk
export const fetchDashboardStats = createAsyncThunk(
    'dashboard/fetchDashboardStats',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get('/dashboard/stats');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard statistics');
        }
    }
);

// Initial state
const initialState = {
    stats: {
        totalContents: 0,
        publishedContents: 0,
        draftContents: 0,
        scheduledContents: 0,
        totalMedia: 0,
        totalComments: 0,
        pendingComments: 0
    },
    recentContents: [],
    loading: false,
    error: null
};

// Slice
const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload.stats;
                state.recentContents = action.payload.recentContents;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;

