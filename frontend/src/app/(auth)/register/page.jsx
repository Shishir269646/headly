// ============================================
// 📄 app/(auth)/register/page.js - Registration Page
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Eye, EyeOff, Github } from 'lucide-react';
import { FaGoogle } from 'react-icons/fa';

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
                                <AlertCircle className="stroke-current shrink-0 h-6 w-6" />
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
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
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
                                        <span className="label-text-alt text-error">{validationErrors.password}</span>
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
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40 hover:text-base-content"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
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
                                    <span className="label-text ml-2">I agree to the{' '}
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
                                <FaGoogle className="w-5 h-5" />
                            </button>
                            <button
                                type="button"
                                className="btn btn-outline"
                            >
                                <Github className="w-5 h-5" />
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
