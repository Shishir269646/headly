'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import axiosInstance from '@/libs/axios';

export default function ContactPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(null); // Clear error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Send contact form to backend
            const response = await axiosInstance.post('/contact', formData);
            
            if (response.data.success) {
                setIsSubmitted(true);
                // Redirect to thank you page after 2 seconds
                setTimeout(() => {
                    router.push('/contact/thank-you?type=contact');
                }, 2000);
            }
        } catch (err) {
            console.error('Contact form error:', err);
            setError(err.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const contactMethods = [
        {
            icon: Mail,
            title: 'Email Us',
            details: ['hello@headly.com', 'support@headly.com'],
            color: 'primary'
        },
        {
            icon: Phone,
            title: 'Call Us',
            details: ['+1 (555) 123-4567', 'Mon-Fri, 9AM-6PM EST'],
            color: 'secondary'
        },
        {
            icon: MapPin,
            title: 'Visit Us',
            details: ['123 Innovation Drive', 'San Francisco, CA 94107', 'United States'],
            color: 'accent'
        },
        {
            icon: Clock,
            title: 'Working Hours',
            details: ['Monday - Friday: 9AM - 6PM', 'Saturday: 10AM - 4PM', 'Sunday: Closed'],
            color: 'info'
        },
    ];

    const faqs = [
        {
            question: 'How do I submit an article?',
            answer: 'Create an account, go to the dashboard, and click "Create New Content". Follow the guided process to draft, preview, and publish your article.'
        },
        {
            question: 'What topics does Headly cover?',
            answer: 'We cover a wide range of topics including technology, business, science, culture, lifestyle, and more. Check our categories to see what we publish.'
        },
        {
            question: 'How long does it take to publish an article?',
            answer: 'It depends on the review process. Most articles are published within 24-48 hours after submission, assuming they meet our editorial standards.'
        },
        {
            question: 'Can I republish content from Headly?',
            answer: 'All content is protected by copyright. For republication or syndication rights, please contact our licensing team at licensing@headly.com.'
        },
    ];

    return (
        <div className="min-h-screen bg-base-100">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 py-20">
                <div className="container mx-auto px-4 max-w-6xl text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Get in <span className="text-primary">Touch</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-base-content/70 max-w-3xl mx-auto">
                        Have a question, suggestion, or just want to say hello? We'd love to hear from you.
                    </p>
                </div>
            </section>

            {/* Contact Methods Grid */}
            <section className="py-16 bg-base-100">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {contactMethods.map((method, index) => {
                            const Icon = method.icon;
                            return (
                                <div key={index} className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div className="card-body text-center">
                                        <Icon className={`w-8 h-8 mx-auto mb-3 text-${method.color}`} />
                                        <h3 className="font-bold text-lg mb-2">{method.title}</h3>
                                        {method.details.map((detail, idx) => (
                                            <p key={idx} className="text-sm text-base-content/70">
                                                {detail}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Main Contact Section */}
            <section className="py-16 bg-base-200">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid lg:grid-cols-5 gap-8">
                        {/* Contact Form */}
                        <div className="lg:col-span-3">
                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title text-3xl mb-6">
                                        Send Us a Message
                                    </h2>
                                    
                                    {isSubmitted ? (
                                        <div className="alert alert-success shadow-lg">
                                            <CheckCircle className="w-6 h-6" />
                                            <span>Thank you! Your message has been sent successfully.</span>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            {error && (
                                                <div className="alert alert-error shadow-lg">
                                                    <span>{error}</span>
                                                </div>
                                            )}

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-semibold">Name *</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        placeholder="John Doe"
                                                        className="input input-bordered"
                                                        required
                                                        disabled={loading}
                                                    />
                                                </div>

                                                <div className="form-control">
                                                    <label className="label">
                                                        <span className="label-text font-semibold">Email *</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        placeholder="john@example.com"
                                                        className="input input-bordered"
                                                        required
                                                        disabled={loading}
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-semibold">Subject *</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    placeholder="What is this regarding?"
                                                    className="input input-bordered"
                                                    required
                                                    disabled={loading}
                                                />
                                            </div>

                                            <div className="form-control">
                                                <label className="label">
                                                    <span className="label-text font-semibold">Message *</span>
                                                </label>
                                                <textarea
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    placeholder="Tell us more..."
                                                    className="textarea textarea-bordered h-40"
                                                    required
                                                    disabled={loading}
                                                ></textarea>
                                            </div>

                                            <div className="form-control mt-6">
                                                <button 
                                                    type="submit" 
                                                    className="btn btn-primary btn-lg w-full"
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <span className="loading loading-spinner"></span>
                                                            Sending...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Send Message
                                                            <Send className="w-5 h-5" />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Additional Info Sidebar */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="card bg-gradient-to-br from-primary/10 to-transparent shadow-lg">
                                <div className="card-body">
                                    <h3 className="card-title text-primary mb-4">Why Contact Us?</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary">✓</span>
                                            <span className="text-sm">Get help with your account</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary">✓</span>
                                            <span className="text-sm">Report content issues</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary">✓</span>
                                            <span className="text-sm">Become a contributing writer</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary">✓</span>
                                            <span className="text-sm">Partnership inquiries</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-primary">✓</span>
                                            <span className="text-sm">General feedback</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="card bg-base-100 shadow-lg">
                                <div className="card-body">
                                    <h3 className="card-title mb-4">Response Time</h3>
                                    <p className="text-sm text-base-content/70">
                                        We typically respond within 24 hours during business days. 
                                        For urgent matters, please call us directly.
                                    </p>
                                </div>
                            </div>

                            <div className="card bg-gradient-to-br from-secondary/10 to-transparent shadow-lg">
                                <div className="card-body">
                                    <h3 className="card-title text-secondary mb-4">Follow Us</h3>
                                    <div className="flex gap-3">
                                        <button className="btn btn-circle btn-primary">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                            </svg>
                                        </button>
                                        <button className="btn btn-circle btn-primary">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                            </svg>
                                        </button>
                                        <button className="btn btn-circle btn-primary">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-base-100">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                        <div className="w-20 h-1 bg-primary mx-auto"></div>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="collapse collapse-plus bg-base-200 shadow-md">
                                <input type="radio" name="faq-accordion" defaultChecked={index === 0} />
                                <div className="collapse-title text-xl font-medium">
                                    {faq.question}
                                </div>
                                <div className="collapse-content">
                                    <p className="text-base-content/70">{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
