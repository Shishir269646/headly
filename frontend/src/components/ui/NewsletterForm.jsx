'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, CheckCircle } from 'lucide-react';
import axiosInstance from '@/libs/axios';


export default function NewsletterForm({ source = 'sidebar' }) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post('/newsletter/subscribe', {
                email,
                metadata: { source }
            });

            if (response.data.success) {
                setIsSubscribed(true);
                setTimeout(() => {
                    router.push('/contact/thank-you?type=newsletter');
                }, 3000);
            }
        } catch (err) {
            console.error(`Newsletter subscription error from ${source}:`, err);
            setError(err.response?.data?.message || 'Failed to subscribe. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (isSubscribed) {
        return (
            <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="flex justify-center mb-4">
                    <div className="rounded-full bg-green-500 p-3">
                        <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h3 className="font-bold mb-2">Subscribed!</h3>
                <p className="text-sm text-base-content/80">
                    Thanks for joining! Check your inbox to confirm.
                </p>
            </div>
        );
    }

    return (
        <div className="p-1 border-t border-base-300">
            <h3 className="font-bold text-lg mb-4">Subscribe to our Newsletter</h3>
            <p className="text-sm text-base-content/70 mb-4">
                Get the latest articles and updates delivered to your inbox.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="alert alert-error text-xs p-2">
                        <span>{error}</span>
                    </div>
                )}
                <div className="form-control">
                    <label className="label sr-only">
                        <span className="label-text">Email Address</span>
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError(null);
                        }}
                        placeholder="your.email@example.com"
                        className="input input-bordered w-full"
                        required
                        disabled={loading}
                    />
                </div>
                <div className="form-control">
                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner"></span>
                                Subscribing...
                            </>
                        ) : (
                            <>
                                <Mail className="w-4 h-4" />
                                Subscribe
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
