"use client";


import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout, getCurrentUser } from '@/store/slices/authSlice';
import { useEffect } from 'react';

export const useAuth = (options = {}) => {
    const { autoFetch = true } = options;
    const dispatch = useDispatch();
    const router = useRouter();
    const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

    // Only auto-fetch current user when explicitly desired (e.g. dashboard/profile),
    // so public pages can use auth state without forcing a redirect flow.
    useEffect(() => {
        if (autoFetch) {
            dispatch(getCurrentUser());
        }
    }, [autoFetch, dispatch]);

    const handleLogout = async () => {
        await dispatch(logout());
        router.push('/login');
    };

    const isAdmin = user?.role === 'admin';
    const isEditorOrAbove = ['admin', 'editor'].includes(user?.role);
    const isAuthorOrAbove = ['admin', 'editor', 'author'].includes(user?.role);

    // Exact role checks
    const isRoleAdmin = user?.role === 'admin';
    const isRoleEditor = user?.role === 'editor';
    const isRoleAuthor = user?.role === 'author';
    const isRoleViewer = user?.role === 'viewer';

    const fetchUser = () => {
        dispatch(getCurrentUser());
    };

    return {
        user,
        isAuthenticated,
        loading,
        error,
        logout: handleLogout,
        fetchUser,
        isAdmin,
        isEditorOrAbove,
        isAuthorOrAbove,
        // Exact roles
        isRoleAdmin,
        isRoleEditor,
        isRoleAuthor,
        isRoleViewer,
    };
};
