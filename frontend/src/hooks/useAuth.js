"use client";

// ✅ hooks/useAuth.js
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout, getCurrentUser } from '@/store/slices/authSlice'; // Removed loadUserFromStorage
import { useEffect } from 'react'; // Removed useRef

export const useAuth = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);
    // Removed isMounted useRef

    useEffect(() => {
        // Attempt to fetch current user on mount to verify authentication status
        // This will implicitly use the HTTP-only cookie sent by the browser
        dispatch(getCurrentUser());
    }, [dispatch]);

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

    return {
        user,
        isAuthenticated,
        loading,
        error,
        logout: handleLogout,
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
