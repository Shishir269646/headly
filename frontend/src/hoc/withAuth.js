"use client";

// frontend/src/hoc/withAuth.js
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = (WrappedComponent, allowedRoles) => {
    const AuthComponent = (props) => {
        const { user, isAuthenticated, loading } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (loading) return; // Still fetching auth status

            if (!isAuthenticated) { // Not authenticated at all
                router.replace('/login');
                return;
            }

            // At this point, isAuthenticated is TRUE and loading is FALSE.
            // Now, we MUST wait for the 'user' object to be present to check roles.
            if (!user) {
                // If authenticated but user object isn't here yet, we do nothing and wait for 'user' to update
                // The main render condition will keep showing the spinner.
                return;
            }

            // User is authenticated, not loading, and user object is available. Now check roles.
            if (allowedRoles && !allowedRoles.includes(user.role)) {
                router.replace('/dashboard/not-authorized');
            }
        }, [user, isAuthenticated, loading, router, allowedRoles]);

        if (loading || !isAuthenticated || (isAuthenticated && !user) || (allowedRoles && user && !allowedRoles.includes(user.role))) {
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
