
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/store/slices/authSlice';

export const useAuth = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

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
        getContentBySlug,
        create,
        update,
        remove,
        publish,
        schedule,
        clearError: clear
    };
};
