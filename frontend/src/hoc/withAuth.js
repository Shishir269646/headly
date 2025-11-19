// frontend/src/hoc/withAuth.js
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = (WrappedComponent, allowedRoles) => {
    const AuthComponent = (props) => {
        const { user, isAuthenticated, loading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (loading) return;

            if (!isAuthenticated) {
                router.replace('/login');
                return;
            }

            if (allowedRoles && !allowedRoles.includes(user?.role)) {
                router.replace('/dashboard/not-authorized');
            }
        }, [user, isAuthenticated, loading, router]);

        if (loading || !isAuthenticated || (allowedRoles && !allowedRoles.includes(user?.role))) {
            return (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            );
        }

        return <WrappedComponent {...props} />;
    };

    AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return AuthComponent;
};

export default withAuth;
