// ✅ hooks/useAuth.js
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout, getCurrentUser } from '@/store/slices/authSlice';
import { useEffect } from 'react';

export const useAuth = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

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
    const isEditor = user?.role === 'editor' || isAdmin;
    const isAuthor = user?.role === 'author' || isEditor;

    return {
        user,
        isAuthenticated,
        loading,
        error,
        logout: handleLogout,
        isAdmin,
        isEditor,
        isAuthor,
    };
};
