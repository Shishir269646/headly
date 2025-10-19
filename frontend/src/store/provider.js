'use client';

import { Provider } from 'react-redux';
import { store } from './index';
import { useEffect } from 'react';
import { loadUserFromStorage } from './slices/authSlice';

export function ReduxProvider({ children }) {
    useEffect(() => {
        // Load user from localStorage on app mount
        store.dispatch(loadUserFromStorage());
    }, []);

    return <Provider store={store}>{children}</Provider>;
}