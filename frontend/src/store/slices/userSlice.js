import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from "../../libs/axios";


// Async thunks
export const fetchUsers = createAsyncThunk(
    'user/fetchUsers',
    async (filters = {}, { rejectWithValue }) => {
        try {
            const safeFilters = filters && typeof filters === 'object' ? filters : {};
            const paramsStr = new URLSearchParams(safeFilters).toString();
            const path = paramsStr ? `/users?${paramsStr}` : '/users';
            const { data } = await axiosInstance.get(path);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
        }
    }
);

export const fetchUserById = createAsyncThunk(
    'user/fetchUserById',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`/users/${id}`);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
        }
    }
);

export const createUser = createAsyncThunk(
    'user/createUser',
    async (userData, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post('/users', userData);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create user');
        }
    }
);

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async ({ id, userData }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.put(`/users/${id}`, userData);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update user');
        }
    }
);

export const deleteUser = createAsyncThunk(
    'user/deleteUser',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/users/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
        }
    }
);

export const updateProfile = createAsyncThunk(
    'user/updateProfile',
    async (profileData, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.put('/users/profile/me', profileData);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
        }
    }
);

export const uploadimage = createAsyncThunk(
    'user/uploadimage',
    async (file, { rejectWithValue }) => {
        try {

            const formData = new FormData();
            formData.append('image', file);

            const { data } = await axiosInstance.put('/users/profile/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });


            return data.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message ||
                error.message ||
                'Failed to upload image';
            return rejectWithValue(errorMessage);
        }
    }
);

// Initial state
const initialState = {
    users: [],
    currentUser: null,
    pagination: {
        total: 0,
        page: 1,
        pages: 1
    },
    loading: false,
    error: null
};

// Slice
const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch User By ID
            .addCase(fetchUserById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentUser = action.payload;
                state.error = null;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.currentUser = null;
            })
            // Create User
            .addCase(createUser.fulfilled, (state, action) => {
                state.users.unshift(action.payload);
            })
            // Update User
            .addCase(updateUser.fulfilled, (state, action) => {
                const index = state.users.findIndex(u => u._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            // Delete User
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(u => u._id !== action.payload);
            })
            // Update Profile
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.currentUser = action.payload;
            })
            // Upload image
            .addCase(uploadimage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(uploadimage.fulfilled, (state, action) => {
                state.loading = false;
                if (state.currentUser) {
                    state.currentUser.image = action.payload.image;
                }
            })
            .addCase(uploadimage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;