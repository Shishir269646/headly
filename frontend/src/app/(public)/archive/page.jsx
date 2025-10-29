'use client';

import React, { useState } from 'react';
import { Calendar, Clock, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function ArchivePage() {
    const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));
    const [selectedMonth, setSelectedMonth] = useState(null);

    // Mock archive data - replace with actual API data
    const archiveData = {
        '2024': {
            totalArticles: 45,
            months: {
                January: 8,
                February: 7,
                March: 6,
                April: 5,
                May: 7,
                June: 4,
                July: 8
            }
        },
        '2023': {
            totalArticles: 120,
            months: {
                January: 12,
                February: 10,
                March: 11,
                April: 9,
                May: 10,
                June: 8,
                July: 9,
                August: 11,
                September: 10,
                October: 10,
                November: 9,
                December: 11
            }
        },
        '2022': {
            totalArticles: 95,
            months: {
                January: 5,
                February: 8,
                March: 9,
                April: 7,
                May: 6,
                June: 8,
                July: 10,
                August: 8,
                September: 9,
                October: 7,
                November: 8,
                December: 10
            }
        }
    };

    const years = Object.keys(archiveData).reverse();
    const months = selectedYear && archiveData[selectedYear] 
        ? Object.keys(archiveData[selectedYear].months) 
        : [];

    return (
        <div className="min-h-screen bg-base-100">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 py-16">
                <div className="container mx-auto px-4 max-w-6xl text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Content <span className="text-primary">Archive</span>
                    </h1>
                    <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
                        Browse all our content organized by date. Dive into our history of articles and posts.
                    </p>
                </div>
            </section>

            {/* Archive Content */}
            <section className="py-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Year Selector */}
                    <div className="card bg-base-200 shadow-lg mb-8">
                        <div className="card-body">
                            <h2 className="card-title mb-4">
                                <Calendar className="w-6 h-6" />
                                Select Year
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {years.map((year) => (
                                    <button
                                        key={year}
                                        onClick={() => {
                                            setSelectedYear(year);
                                            setSelectedMonth(null);
                                        }}
                                        className={`btn ${
                                            selectedYear === year
                                                ? 'btn-primary'
                                                : 'btn-outline'
                                        }`}
                                    >
                                        {year}
                                        <span className="ml-2 badge badge-sm">
                                            {archiveData[year]?.totalArticles || 0}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Monthly Breakdown */}
                    {selectedYear && archiveData[selectedYear] && (
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-3xl font-bold">
                                        {selectedYear}
                                    </h2>
                                    <div className="stat bg-base-200 rounded-lg px-4 py-2">
                                        <div className="stat-value text-2xl text-primary">
                                            {archiveData[selectedYear]?.totalArticles || 0}
                                        </div>
                                        <div className="stat-title text-sm">Total Articles</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {months.map((month) => (
                                        <Link
                                            key={month}
                                            href={`/archive/${selectedYear}/${month}`}
                                            className="card bg-base-200 hover:bg-base-300 transition-colors cursor-pointer"
                                        >
                                            <div className="card-body items-center text-center py-4">
                                                <Clock className="w-8 h-8 text-primary mb-2" />
                                                <h3 className="font-bold">{month}</h3>
                                                <p className="text-2xl font-bold text-primary">
                                                    {archiveData[selectedYear]?.months?.[month] || 0}
                                                </p>
                                                <p className="text-sm text-base-content/70">
                                                    articles
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick Stats */}
                    <div className="grid md:grid-cols-3 gap-6 mt-8">
                        <div className="card bg-gradient-to-br from-primary/10 to-transparent shadow-lg">
                            <div className="card-body">
                                <TrendingUp className="w-8 h-8 text-primary mb-2" />
                                <div className="stat-desc">Total Articles</div>
                                <div className="text-3xl font-bold">
                                    {Object.values(archiveData).reduce((sum, year) => sum + year.totalArticles, 0)}
                                </div>
                            </div>
                        </div>

                        <div className="card bg-gradient-to-br from-secondary/10 to-transparent shadow-lg">
                            <div className="card-body">
                                <Calendar className="w-8 h-8 text-secondary mb-2" />
                                <div className="stat-desc">Years Active</div>
                                <div className="text-3xl font-bold">{years.length}</div>
                            </div>
                        </div>

                        <div className="card bg-gradient-to-br from-accent/10 to-transparent shadow-lg">
                            <div className="card-body">
                                <Clock className="w-8 h-8 text-accent mb-2" />
                                <div className="stat-desc">Average per Month</div>
                                <div className="text-3xl font-bold">
                                    {Math.round(
                                        Object.values(archiveData).reduce((sum, year) => sum + year.totalArticles, 0) /
                                        (years.length * 12)
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

