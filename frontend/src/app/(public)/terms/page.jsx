'use client';

import React from 'react';
import { Scale, FileText, AlertCircle, Shield } from 'lucide-react';

export default function TermsPage() {
    const sections = [
        {
            title: 'Acceptance of Terms',
            content: 'By accessing and using Headly, you accept and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our service.'
        },
        {
            title: 'Description of Service',
            content: 'Headly is a content management platform that provides users with tools to create, publish, and manage content. We reserve the right to modify, suspend, or discontinue any aspect of the service at any time without notice.'
        },
        {
            title: 'User Accounts',
            content: 'To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.'
        },
        {
            title: 'Content Ownership and Rights',
            content: 'You retain ownership of the content you create and submit. By posting content, you grant Headly a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute your content on the platform.'
        },
        {
            title: 'Prohibited Content',
            content: 'You agree not to post content that is illegal, offensive, defamatory, violates intellectual property rights, or infringes on the rights of others. We reserve the right to remove any content that violates these terms.'
        },
        {
            title: 'Privacy',
            content: 'Your use of Headly is also governed by our Privacy Policy. Please review it to understand how we collect and use your information.'
        },
        {
            title: 'Limitation of Liability',
            content: 'Headly shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the service.'
        },
        {
            title: 'Modifications to Terms',
            content: 'We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the platform.'
        }
    ];

    return (
        <div className="min-h-screen bg-base-100">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 py-16">
                <div className="container mx-auto px-4 max-w-6xl text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary text-primary-content mb-6">
                        <Scale className="w-10 h-10" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Terms of Service
                    </h1>
                    <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
                        Please read these terms carefully before using our platform
                    </p>
                    <p className="text-sm text-base-content/60 mt-4">
                        Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
            </section>

            {/* Terms Content */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Important Notice */}
                    <div className="alert alert-warning shadow-lg mb-12">
                        <AlertCircle className="w-6 h-6" />
                        <div>
                            <h3 className="font-bold">Important Notice</h3>
                            <div className="text-sm">
                                By using Headly, you agree to these terms. Please read them carefully.
                            </div>
                        </div>
                    </div>

                    {/* Terms Sections */}
                    {sections.map((section, index) => (
                        <div key={index} className="mb-8">
                            <div className="card bg-base-200 shadow-lg">
                                <div className="card-body">
                                    <h2 className="card-title text-2xl mb-4">
                                        {index + 1}. {section.title}
                                    </h2>
                                    <p className="text-base-content/80 leading-relaxed">
                                        {section.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Contact Section */}
                    <div className="card bg-gradient-to-br from-primary/10 to-transparent shadow-xl mt-12">
                        <div className="card-body">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-lg bg-primary text-primary-content">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Questions About Terms?</h3>
                                    <p className="text-base-content/70 mb-4">
                                        If you have any questions regarding these Terms of Service, please contact us.
                                    </p>
                                    <button className="btn btn-primary">
                                        Contact Us
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

