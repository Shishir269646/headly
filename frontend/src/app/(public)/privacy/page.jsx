'use client';

import React from 'react';
import { Shield, Eye, Lock, Mail, Cookie, FileText } from 'lucide-react';

export default function PrivacyPage() {
    const sections = [
        {
            icon: Eye,
            title: 'Information We Collect',
            content: 'We collect information that you provide directly to us, such as when you create an account, post content, or contact us. This may include your name, email address, and content you create.'
        },
        {
            icon: Lock,
            title: 'How We Use Your Information',
            content: 'We use the information we collect to provide, maintain, and improve our services, process transactions, send you updates, and respond to your inquiries.'
        },
        {
            icon: Mail,
            title: 'Information Sharing',
            content: 'We do not sell, trade, or rent your personal information to third parties. We may share information with service providers who assist us in operating our platform, subject to strict confidentiality agreements.'
        },
        {
            icon: Cookie,
            title: 'Cookies and Tracking',
            content: 'We use cookies and similar technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.'
        },
        {
            icon: Shield,
            title: 'Data Security',
            content: 'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
        },
        {
            icon: FileText,
            title: 'Your Rights',
            content: 'You have the right to access, update, or delete your personal information at any time. You can also opt-out of certain communications from us.'
        }
    ];

    return (
        <div className="min-h-screen bg-base-100">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 py-16">
                <div className="container mx-auto px-4 max-w-6xl text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-content mb-6">
                        <Shield className="w-10 h-10" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Privacy Policy
                    </h1>
                    <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
                        How we collect, use, and protect your information
                    </p>
                    <p className="text-sm text-base-content/60 mt-4">
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </section>

            {/* Privacy Content */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Introduction */}
                    <div className="card bg-base-200 shadow-lg mb-12">
                        <div className="card-body">
                            <h2 className="text-3xl font-bold mb-4">Our Commitment to Your Privacy</h2>
                            <p className="text-lg leading-relaxed text-base-content/80">
                                At Headly, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
                            </p>
                        </div>
                    </div>

                    {/* Privacy Sections */}
                    {sections.map((section, index) => {
                        const Icon = section.icon;
                        return (
                            <div key={index} className="mb-8">
                                <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
                                    <div className="card-body">
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-lg bg-primary/10">
                                                <Icon className="w-8 h-8 text-primary" />
                                            </div>
                                            <div className="flex-grow">
                                                <h2 className="card-title text-2xl mb-3">
                                                    {section.title}
                                                </h2>
                                                <p className="text-base-content/80 leading-relaxed">
                                                    {section.content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Contact Information */}
                    <div className="card bg-gradient-to-br from-secondary/10 to-transparent shadow-xl mt-12">
                        <div className="card-body">
                            <h3 className="text-2xl font-bold mb-4">Contact Us About Privacy</h3>
                            <p className="text-base-content/70 mb-6">
                                If you have questions or concerns about this Privacy Policy or our data practices, please contact us.
                            </p>
                            <div className="space-y-2">
                                <p><strong>Email:</strong> privacy@headly.com</p>
                                <p><strong>Address:</strong> 123 Innovation Drive, San Francisco, CA 94107</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

