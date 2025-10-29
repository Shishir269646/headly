import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import contentReducer from './slices/contentSlice';
import mediaReducer from './slices/mediaSlice';
import userReducer from './slices/userSlice';
import analyticsReducer from './slices/analyticsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        content: contentReducer,
        media: mediaReducer,
        user: userReducer,
        analytics: analyticsReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        })
});

export default store;