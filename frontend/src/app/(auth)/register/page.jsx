// ============================================
// 📄 app/(auth)/register/page.js - Registration Page
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

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

    // Calculate password strength
    useEffect(() => {
        if (!formData.password) {
            setPasswordStrength(0);
            return;
        }

        let strength = 0;
        if (formData.password.length >= 8) strength += 25;
        if (formData.password.length >= 12) strength += 25;
        if (/[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password)) strength += 25;
        if (/\d/.test(formData.password)) strength += 15;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) strength += 10;

        setPasswordStrength(Math.min(strength, 100));
    }, [formData.password]);

    const getPasswordStrengthColor = () => {
        if (passwordStrength < 40) return 'badge-error';
        if (passwordStrength < 70) return 'badge-warning';
        return 'badge-success';
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength < 40) return 'Weak';
        if (passwordStrength < 70) return 'Medium';
        return 'Strong';
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) {
            errors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }

        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters';
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (!agreedToTerms) {
            errors.terms = 'You must agree to the terms and conditions';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        // Clear validation error for this field
        if (validationErrors[e.target.name]) {
            setValidationErrors({
                ...validationErrors,
                [e.target.name]: null
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const { confirmPassword, ...registerData } = formData;

        const result = await dispatch(register(registerData));

        if (result.type === 'auth/register/fulfilled') {
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-md w-full space-y-8">
                {/* Logo & Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-secondary rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-secondary-content text-2xl font-bold">H</span>
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-base-content">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-base-content/70">
                        Join Headly CMS and start managing content
                    </p>
                </div>

                {/* Registration Form */}
                <div className="card bg-base-100 shadow-2xl">
                    <div className="card-body p-8">
                        {/* Error Message */}
                        {error && (
                            <div className="alert alert-error mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name Field */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Full Name</span>
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`input input-bordered w-full ${validationErrors.name ? 'input-error' : ''}`}
                                    placeholder="John Doe"
                                />
                                {validationErrors.name && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{validationErrors.name}</span>
                                    </label>
                                )}
                            </div>

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
                                    className={`input input-bordered w-full ${validationErrors.email ? 'input-error' : ''}`}
                                    placeholder="you@example.com"
                                />
                                {validationErrors.email && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{validationErrors.email}</span>
                                    </label>
                                )}
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
                                        autoComplete="new-password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`input input-bordered w-full pr-12 ${validationErrors.password ? 'input-error' : ''}`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40 hover:text-base-content"
                                    >
                                        {showPassword ? (
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A buy 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 制服24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>

                                {/* Password Strength Indicator */}
                                {formData.password && (
                                    <div className="mt-2">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-base-content/60">Password strength:</span>
                                            <span className={`badge badge-sm ${getPasswordStrengthColor()}`}>
                                                {getPasswordStrengthText()}
                                            </span>
                                        </div>
                                        <progress 
                                            className={`progress ${passwordStrength < 40 ? 'progress-error' : passwordStrength < 70 ? 'progress-warning' : 'progress-success'}`} 
                                            value={passwordStrength} 
                                            max="100"
                                        ></progress>
                                    </div>
                                )}

                                {validationErrors.password && (
                                    <label className="label">
                                        <span className="label简体alt text-error">{validationErrors.password}</span>
                                    </label>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-semibold">Confirm Password</span>
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        autoComplete="new-password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`input input-bordered w-full pr-12 ${validationErrors.confirmPassword ? 'input-error' : ''}`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content pembelajaran 40 hover:text-base-content"
                                    >
                                        {showConfirmPassword ? (
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                               نی<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0  Krataz.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        ) : (
                                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </全服svg>
                                        )}
                                    </button>
                                </div>
                                {validationErrors.confirmPassword && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{validationErrors.confirmPassword}</span>
                                    </label>
                                )}
                            </div>

                            {/* Terms & Conditions */}
                            <div className="form-control">
                                <label className="label cursor-pointer justify-start">
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => {
                                            setAgreedToTerms(e.target.checked);
                                            if (validationErrors.terms) {
                                                setValidationErrors({ ...validationErrors, terms: null });
                                            }
                                        }}
                                        className="checkbox checkbox-secondary"
                                    />
                                    <span className="label万股 ml-2">I agree to the{' '}
                                        <a href="#" className="link link-secondary link-hover">
                                            Terms and Conditions
                                        </a>{' '}
                                        and{' '}
                                        <a href="#" className="link link-secondary link-hover">
                                            Privacy Policy
                                        </a>
                                    </span>
                                </label>
                                {validationErrors.terms && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">{validationErrors.terms}</span>
                                    </label>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-secondary w-full"
                            >
                                {loading ? (
                                    <>
                                        <span className="loading loading-spinner"></span>
                                        Creating account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="divider">Or</div>

                        {/* Social Login Options */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className="btn btn-outline"
                            >
                                <svg className="w-5 h-5" viewBox="0  translate 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 plumer.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 revert0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 126239 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801 salary 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sign In Link */}
                <p className="text-center text-sm text-base-content/70">
                    Already have an account?{' '}
                    <Link href="/login" className="link link-secondary font-medium link-hover">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
