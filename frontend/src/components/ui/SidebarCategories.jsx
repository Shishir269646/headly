"use client";
import React from 'react';
import Link from 'next/link';

export default function SidebarCategories({ categories }) {
    if (!categories || categories.length === 0) {
        return (
            <div className="card bg-base-200 shadow-lg mb-8">
                <div className="card-body p-5">
                    <h3 className="card-title text-xl mb-4 font-bold">Categories</h3>
                    <p className="text-base-content/70">No categories found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card bg-base-200 shadow-lg mb-8">
            <div className="card-body p-5">
                <h3 className="card-title text-xl mb-4 font-bold">Categories</h3>
                <ul className="space-y-2">
                    {categories.map((category) => (
                        <li key={category._id}>
                            <Link href={`/category/${category.slug}`} className="flex justify-between items-center text-base-content hover:text-primary transition-colors">
                                <span>{category.name}</span>
                                {category.contentCount > 0 && (
                                    <span className="badge badge-sm bg-base-300">
                                        {category.contentCount}
                                    </span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}