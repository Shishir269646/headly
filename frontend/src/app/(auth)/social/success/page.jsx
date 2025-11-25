// ============================================
// 📄 app/(auth)/social/success/page.js - Social Login Success Page
// ============================================

'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/store/slices/authSlice';

export default function SocialSuccessPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        // Dispatch getCurrentUser to fetch user data and update authentication status
        dispatch(getCurrentUser());
    }, [dispatch]);

    useEffect(() => {
        if (!loading) {
            if (isAuthenticated) {
                // Successfully authenticated, redirect to dashboard
                router.push('/dashboard');
            } else if (error) {
                // Authentication failed or user not found, redirect to login with an error
                router.push('/login?error=Social login failed');
            } else {
                // If not authenticated and no error, means getCurrentUser didn't return a user
                // This might happen if cookies are not set correctly or token is invalid
                router.push('/login?error=Authentication required');
            }
        }
    }, [isAuthenticated, loading, error, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="text-center p-8 bg-base-100 shadow-xl rounded-lg">
                <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                <h2 className="text-2xl font-semibold text-base-content">
                    Authenticating you...
                </h2>
                <p className="text-base-content/70 mt-2">Please wait while we log you in.</p>
            </div>
        </div>
    );
}
