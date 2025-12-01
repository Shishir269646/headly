'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Eye, EyeOff, Info } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    // Clear error on unmount
    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await dispatch(login(formData));

        if (result.type === 'auth/login/fulfilled') {

            if (rememberMe) {
                localStorage.setItem('rememberedEmail', formData.email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            router.push('/dashboard');
        }
    };

    // Load remembered email
    useEffect(() => {
        const rememberedEmail = localStorage.getItem('rememberedEmail');
        if (rememberedEmail) {
            setFormData({ ...formData, email: rememberedEmail });
            setRememberMe(true);
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Logo & Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-primary-content text-2xl font-bold">H</span>
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-base-content">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-base-content/70">
                        Sign in to your Headly CMS account
                    </p>
                </div>

                {/* Login Form */}
                <div className="card bg-base-100 shadow-2xl">
                    <div className="card-body p-8">
                        {/* Error Message */}
                        {error && (
                            <div className="alert alert-error mb-4">
                                <AlertCircle className="stroke-current shrink-0 h-6 w-6" />
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email Field */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Email Address</span>
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="input input-bordered w-full"
                                    placeholder="you@example.com"
                                />
                            </div>

                            {/* Password Field */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Password</span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="input input-bordered w-full pr-12"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40 hover:text-base-content"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="label cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="checkbox checkbox-primary"
                                    />
                                    <span className="label-text ml-2">Remember me</span>
                                </label>

                                <div className="text-sm">
                                    <a href="#" className="link link-primary link-hover">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full"
                            >
                                {loading ? (
                                    <>
                                        <span className="loading loading-spinner"></span>
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="divider">Or</div>

                        {/* Social Login Buttons */}
                        <div className="space-y-2">
                            <a href="http://localhost:4000/api/auth/google" className="btn btn-outline w-full">
                                Continue with Google
                            </a>
                            <a href="http://localhost:4000/api/auth/github" className="btn btn-outline w-full">
                                Continue with GitHub
                            </a>
                            <a href="http://localhost:4000/api/auth/linkedin" className="btn btn-outline w-full">
                                Continue with LinkedIn
                            </a>
                        </div>

                        {/* Sign Up Link */}
                        <div className="text-center mt-4">
                            <p className="text-sm text-base-content/70">
                                Don't have an account?{' '}
                                <Link href="/register" className="link link-primary font-medium">
                                    Sign up for free
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Demo Credentials */}
                <div className="alert bg-info/10 border-info/20">
                    <Info className="stroke-current shrink-0 w-6 h-6" />
                    <div>
                        <p className="font-medium text-sm">Demo Credentials</p>
                        <p className="text-xs">
                            Email: mjshishirf@gmail.com<br />
                            Password: Admin@123
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
