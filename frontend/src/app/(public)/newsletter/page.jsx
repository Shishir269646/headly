'use client';

import React from 'react';
import { Mail, Bell, TrendingUp, Users } from 'lucide-react';
import NewsletterForm from '@/components/ui/NewsletterForm';

export default function NewsletterPage() {
    const benefits = [
        {
            icon: Bell,
            title: 'Weekly Updates',
            description: 'Get the latest articles delivered to your inbox'
        },
        {
            icon: TrendingUp,
            title: 'Trending Topics',
            description: 'Stay ahead with the most popular content'
        },
        {
            icon: Users,
            title: 'Exclusive Content',
            description: 'Access subscriber-only articles and insights'
        }
    ];

    return (
        <div className="min-h-screen bg-base-100">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary via-secondary to-accent text-primary-content py-20">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6">
                        <Mail className="w-10 h-10" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Stay Connected
                    </h1>
                    <p className="text-xl opacity-90 max-w-2xl mx-auto">
                        Subscribe to our newsletter and never miss out on the latest articles, insights, and exclusive content.
                    </p>
                </div>
            </section>

            {/* Subscription Form */}
            <section className="py-16 -mt-12">
                <div className="container mx-auto px-4 max-w-2xl">
                    <div className="card bg-base-100 shadow-2xl">
                        <div className="card-body py-12 px-6">
                            <h2 className="text-3xl font-bold text-center mb-4">
                                Join Our Newsletter
                            </h2>
                            <p className="text-center text-base-content/70 mb-8">
                                Get weekly updates delivered straight to your inbox
                            </p>
                            <NewsletterForm source="newsletter-page" />
                            <p className="text-xs text-center text-base-content/60 mt-4">
                                By subscribing, you agree to our Privacy Policy and consent to receive emails from Headly.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 bg-base-200">
                <div className="container mx-auto px-4 max-w-6xl">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        What You'll Get
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {benefits.map((benefit, index) => {
                            const Icon = benefit.icon;
                            return (
                                <div key={index} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
                                    <div className="card-body text-center">
                                        <div className="p-4 rounded-lg bg-primary/10 w-fit mx-auto mb-4">
                                            <Icon className="w-8 h-8 text-primary" />
                                        </div>
                                        <h3 className="card-title justify-center mb-2">{benefit.title}</h3>
                                        <p className="text-base-content/70">{benefit.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-4">
                        {[
                            {
                                q: 'How often will I receive emails?',
                                a: 'We send a weekly newsletter every Monday with the latest articles and curated content.'
                            },
                            {
                                q: 'Can I unsubscribe anytime?',
                                a: 'Yes, you can unsubscribe at any time by clicking the unsubscribe link in any email we send.'
                            },
                            {
                                q: 'What information do you collect?',
                                a: 'We only collect your email address to send you the newsletter. See our Privacy Policy for more details.'
                            }
                        ].map((item, index) => (
                            <div key={index} className="collapse collapse-plus bg-base-200 shadow-md">
                                <input type="radio" name="newsletter-faq" defaultChecked={index === 0} />
                                <div className="collapse-title text-xl font-medium">
                                    {item.q}
                                </div>
                                <div className="collapse-content">
                                    <p className="text-base-content/70">{item.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
