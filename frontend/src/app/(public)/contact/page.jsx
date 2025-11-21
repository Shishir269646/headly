'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Twitter, Instagram, Linkedin } from 'lucide-react';
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
                                            <Twitter width="20" height="20" />
                                        </button>
                                        <button className="btn btn-circle btn-primary">
                                            <Instagram width="20" height="20" />
                                        </button>
                                        <button className="btn btn-circle btn-primary">
                                            <Linkedin width="20" height="20" />
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
