
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from "../../libs/axios";

// Async thunks
export const getAnalytics = createAsyncThunk(
    'analytics/getAnalytics',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get('/analytics');
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
