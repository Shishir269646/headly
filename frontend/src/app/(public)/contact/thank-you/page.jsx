'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Home, Mail, ArrowLeft } from 'lucide-react';

export default function ThankYouPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [countdown, setCountdown] = useState(5);
    
    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    router.push('/');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [router]);

    const formType = searchParams.get('type') || 'contact';

    return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center py-12 px-4">
            <div className="max-w-2xl w-full">
                <div className="card bg-base-200 shadow-2xl">
                    <div className="card-body text-center py-12 px-6">
                        {/* Success Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="rounded-full bg-green-500 p-4">
                                <CheckCircle className="w-16 h-16 text-white" />
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl font-bold mb-4">
                            Thank You! 🙏
                        </h1>

                        {/* Message */}
                        <p className="text-lg text-base-content/70 mb-6">
                            {formType === 'contact' 
                                ? "Your message has been sent successfully. We'll get back to you within 24 hours!"
                                : formType === 'newsletter'
                                ? "You've been subscribed to our newsletter. Check your inbox for a confirmation email!"
                                : "Your submission was received successfully!"}
                        </p>

                        {/* Email Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="p-4 rounded-lg bg-primary/10">
                                <Mail className="w-12 h-12 text-primary" />
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="alert alert-info shadow-lg mb-6 text-left">
                            <div>
                                <h3 className="font-bold">What's Next?</h3>
                                <div className="text-sm mt-2 space-y-1">
                                    <p>• You'll receive a confirmation email shortly</p>
                                    <p>• Our team typically responds within 24 hours</p>
                                    <p>• Check your spam folder if you don't see it</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap justify-center gap-4">
                            <button
                                onClick={() => router.push('/contact')}
                                className="btn btn-outline btn-primary"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                Send Another Message
                            </button>
                            <button
                                onClick={() => router.push('/')}
                                className="btn btn-primary"
                            >
                                <Home className="w-5 h-5" />
                                Back to Home
                            </button>
                        </div>

                        {/* Auto-redirect Notice */}
                        <div className="mt-8 text-sm text-base-content/60">
                            Redirecting to homepage in <span className="font-bold text-primary">{countdown}</span> seconds...
                        </div>
                    </div>
                </div>

                {/* Additional Resources */}
                <div className="mt-8 text-center">
                    <p className="text-base-content/70 mb-4">While you wait, explore:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        <button onClick={() => router.push('/about')} className="btn btn-sm btn-ghost">
                            About Us
                        </button>
                        <button onClick={() => router.push('/')} className="btn btn-sm btn-ghost">
                            Latest Articles
                        </button>
                        <button onClick={() => router.push('/newsletter')} className="btn btn-sm btn-ghost">
                            Newsletter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

