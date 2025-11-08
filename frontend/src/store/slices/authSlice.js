import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from "../../libs/axios";

// Async thunks
export const register = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post('/auth/register', userData);
            // Store tokens if provided
            if (data.data.token) {
                localStorage.setItem('accessToken', data.data.token);
            }
            if (data.data.refreshToken) {
                localStorage.setItem('refreshToken', data.data.refreshToken);
            }
            // Store user data (without tokens)
            const { token, refreshToken, ...userWithoutTokens } = data.data;
            localStorage.setItem('user', JSON.stringify(userWithoutTokens.user || userWithoutTokens));
            return userWithoutTokens.user || userWithoutTokens;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post('/auth/login', credentials);
            // Store tokens in localStorage
            if (data.data.token) {
                localStorage.setItem('accessToken', data.data.token);
            }
            if (data.data.refreshToken) {
                localStorage.setItem('refreshToken', data.data.refreshToken);
            }
            // Store user data (without tokens)
            const { token, refreshToken, ...userWithoutTokens } = data.data;
            localStorage.setItem('user', JSON.stringify(userWithoutTokens));
            return userWithoutTokens;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.post('/auth/logout');
            // Clear all auth-related data
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        } catch (error) {
            // Clear tokens even if logout request fails
            localStorage.removeItem('user');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);

export const getCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get('/auth/me');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
        }
    }
);

export const changePassword = createAsyncThunk(
    'auth/changePassword',
    async (passwords, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.put('/auth/change-password', passwords);
            return data.message;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Password change failed');
        }
    }
);

export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { rejectWithValue }) => {
        try {
            // Get refresh token from localStorage
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                throw new Error('Refresh token not found');
            }
            
            // Call refresh endpoint with refresh token
            const { data } = await axiosInstance.post('/auth/refresh-token', {
                refreshToken
            });
            
            // Store new tokens
            if (data.data.token) {
                localStorage.setItem('accessToken', data.data.token);
            }
            if (data.data.refreshToken) {
                localStorage.setItem('refreshToken', data.data.refreshToken);
            }
            
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Token refresh failed');
        }
    }
);

// Initial state
const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
};

// Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        loadUserFromStorage: (state) => {
            const userStr = localStorage.getItem('user');
            const token = localStorage.getItem('accessToken');
            // Only set as authenticated if we have both user data and token
            // If only user data exists (from old sessions), we'll verify via getCurrentUser
            if (userStr && token) {
                state.user = JSON.parse(userStr);
                state.isAuthenticated = true;
            } else if (userStr) {
                // User data exists but no token - verify with backend
                state.user = JSON.parse(userStr);
                state.isAuthenticated = false; // Will be set to true if getCurrentUser succeeds
            }
        },
        // New action to set isAuthenticated based on backend response (e.g., from a session check)
        setAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload; // action.payload is now just user data
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            })
            .addCase(logout.rejected, (state) => {
                // Even if logout fails, clear the state
                state.user = null;
                state.isAuthenticated = false;
            })
            // Get Current User
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true; // If we successfully get a user, they are authenticated
            })
            .addCase(getCurrentUser.rejected, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            })
            // Refresh Token - no direct state update for token as it's in cookie
            .addCase(refreshToken.fulfilled, (state) => {
                // Token is refreshed via cookie, no direct state update needed for token
                state.isAuthenticated = true; // Assume if refresh is successful, user is authenticated
            })
            .addCase(refreshToken.rejected, (state) => {
                state.isAuthenticated = false;
                state.user = null;
            });
    }
});

export const { clearError, loadUserFromStorage, setAuthenticated, setUser } = authSlice.actions;
export default authSlice.reducer;