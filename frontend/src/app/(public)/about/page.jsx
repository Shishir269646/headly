'use client';

import React from 'react';
import { Users, Target, Zap, Heart, Shield, TrendingUp } from 'lucide-react';

export default function AboutPage() {
    const stats = [
        { number: '10K+', label: 'Articles Published', icon: TrendingUp },
        { number: '50K+', label: 'Active Readers', icon: Users },
        { number: '200+', label: 'Expert Writers', icon: Target },
        { number: '5+', label: 'Years Experience', icon: Shield },
    ];

    const values = [
        {
            icon: Target,
            title: 'Mission-Driven',
            description: 'We are committed to delivering quality content that informs, educates, and inspires our global community of readers.'
        },
        {
            icon: Zap,
            title: 'Innovation',
            description: 'We leverage cutting-edge technology and creative approaches to enhance the reading and publishing experience.'
        },
        {
            icon: Heart,
            title: 'Community First',
            description: 'Our writers and readers are the heart of Headly. We prioritize their needs and feedback in everything we do.'
        },
        {
            icon: Shield,
            title: 'Integrity',
            description: 'We maintain the highest standards of journalistic integrity, fact-checking, and ethical content publishing.'
        },
    ];

    const team = [
        {
            name: 'Sarah Chen',
            role: 'CEO & Co-Founder',
            bio: 'Former editor at leading tech publications with 15+ years of experience.',
            avatar: 'SC'
        },
        {
            name: 'Michael Torres',
            role: 'CTO & Co-Founder',
            bio: 'Full-stack engineer passionate about building scalable content platforms.',
            avatar: 'MT'
        },
        {
            name: 'Emily Watson',
            role: 'Editor-in-Chief',
            bio: 'Award-winning journalist and content strategist.',
            avatar: 'EW'
        },
        {
            name: 'David Kim',
            role: 'Lead Designer',
            bio: 'UX/UI specialist focused on creating engaging digital experiences.',
            avatar: 'DK'
        },
    ];

    return (
        <div className="min-h-screen bg-base-100">
            {/* Hero Section with Stats */}
            <section className="relative bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 py-24">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            About <span className="text-primary">Headly</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-base-content/70 max-w-3xl mx-auto">
                            Empowering voices, inspiring minds, and building a community through the power of quality content.
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <div key={index} className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300">
                                    <div className="card-body items-center text-center">
                                        <div className="text-primary mb-2">
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        <div className="text-3xl font-bold">{stat.number}</div>
                                        <div className="text-sm text-base-content/70">{stat.label}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-20 bg-base-200">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">Our Story</h2>
                        <div className="w-20 h-1 bg-primary mx-auto"></div>
                    </div>
                    <div className="prose prose-lg max-w-none text-justify">
                        <p className="text-lg leading-relaxed mb-6">
                            Founded in 2019, Headly emerged from a simple belief: that everyone deserves access to
                            high-quality, thought-provoking content. What started as a small team of passionate writers
                            and technologists has grown into a thriving platform that serves millions of readers worldwide.
                        </p>
                        <p className="text-lg leading-relaxed mb-6">
                            Our journey has been marked by continuous innovation, from implementing advanced AI-powered
                            recommendations to creating immersive reading experiences. We've remained committed to our
                            core mission: democratizing access to information while maintaining the highest editorial
                            standards.
                        </p>
                        <p className="text-lg leading-relaxed">
                            Today, Headly stands as a testament to what's possible when technology meets journalism,
                            where every article is crafted with care, and where readers and writers come together to
                            shape the conversation.
                        </p>
                    </div>
                </div>
            </section>

            {/* Our Values Section */}
            <section className="py-20 bg-base-100">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
                        <div className="w-20 h-1 bg-primary mx-auto"></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <div key={index} className="card bg-base-200 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-primary">
                                    <div className="card-body">
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="p-3 rounded-lg bg-primary/10">
                                                    <Icon className="w-6 h-6 text-primary" />
                                                </div>
                                            </div>
                                            <div className="flex-grow">
                                                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                                                <p className="text-base-content/70">{value.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 bg-base-200">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Leadership Team</h2>
                        <div className="w-20 h-1 bg-primary mx-auto"></div>
                        <p className="text-lg text-base-content/70 mt-4">
                            Meet the passionate individuals leading Headly's mission
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {team.map((member, index) => (
                            <div key={index} className="card bg-base-100 shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                                <div className="relative h-64 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                    <div className="text-6xl font-bold text-white opacity-50 group-hover:opacity-75 transition-opacity">
                                        {member.avatar}
                                    </div>
                                </div>
                                <div className="card-body text-center">
                                    <h3 className="card-title justify-center text-xl">{member.name}</h3>
                                    <p className="text-primary font-semibold mb-2">{member.role}</p>
                                    <p className="text-sm text-base-content/70">{member.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-20 bg-base-100">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="card bg-gradient-to-br from-primary/10 to-transparent shadow-xl border-l-4 border-primary">
                            <div className="card-body">
                                <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
                                <p className="text-lg leading-relaxed">
                                    To create a global platform where exceptional writing meets curious minds,
                                    fostering knowledge sharing, critical thinking, and meaningful conversations
                                    that drive positive change in the world.
                                </p>
                            </div>
                        </div>
                        <div className="card bg-gradient-to-br from-secondary/10 to-transparent shadow-xl border-l-4 border-secondary">
                            <div className="card-body">
                                <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
                                <p className="text-lg leading-relaxed">
                                    To become the most trusted and engaging content platform globally, where
                                    writers thrive, readers discover, and communities grow around shared
                                    passions and ideas.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary to-secondary text-primary-content">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Join Our Growing Community
                    </h2>
                    <p className="text-xl mb-8 opacity-90">
                        Whether you're a writer looking to share your voice or a reader seeking quality content,
                        we'd love to have you as part of Headly.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="btn btn-lg bg-base-100 text-primary hover:bg-base-200 border-0">
                            Start Writing
                        </button>
                        <button className="btn btn-lg bg-base-100/10 text-base-100 border-2 border-base-100 hover:bg-base-100 hover:text-primary">
                            Explore Articles
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
