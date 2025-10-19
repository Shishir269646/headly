"use client";
import React from 'react';

const FeaturedContentGrid = () => {


    // Sample data - replace with your actual content from API
    const featuredPost = {
        id: 1,
        title: "Save $25 on Philips Wired Headphone For A Great Sounding Over-Ear Headphone",
        slug: "save-25-on-philips-wired-headphone",
        image: "https://smartmag.theme-sphere.com/tech-blog/wp-content/uploads/sites/35/2022/11/Depositphotos_29247013_xl-2015-2-768x512.jpg",
        category: {
            name: "Gadgets",
            slug: "gadgets",
            color: "bg-blue-500"
        },
        author: {
            name: "Shane Doe",
            avatar: "https://cheerup.theme-sphere.com/wp-content/uploads/2016/05/bella-doe.jpg",
            slug: "shane-doe"
        },
        date: "Jan 12, 2020",
        excerpt: "Get an amazing deal on premium audio quality"
    };



    return (
        <section className="mb-8 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="relative group">
                    {/* Main Featured Article */}
                    <article className="relative overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 h-[600px]">
                        {/* Background Image with Overlay */}
                        <div className="absolute inset-0">
                            <img
                                src={featuredPost.image}
                                alt={featuredPost.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                        </div>

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                            <div className="space-y-4">
                                {/* Category Badge */}
                                <div className="flex items-center gap-2">
                                    <span className={`${featuredPost.category.color} text-white px-4 py-1.5 rounded-md text-sm font-normal uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer`}>
                                        {featuredPost.category.name}
                                    </span>
                                </div>

                                {/* Title */}
                                <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-semibold leading-tight hover:text-gray-200 transition-colors cursor-pointer">
                                    <a href={`/post/${featuredPost.slug}`} className="block">
                                        {featuredPost.title}
                                    </a>
                                </h2>

                                {/* Meta Information */}
                                <div className="flex items-center gap-4 text-gray-200">
                                    {/* Author */}
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={featuredPost.author.avatar}
                                            alt={featuredPost.author.name}
                                            className="w-8 h-8 rounded-full border-2 border-white/50"
                                        />
                                        <a
                                            href={`/author/${featuredPost.author.slug}`}
                                            className="text-sm font-medium hover:text-white transition-colors"
                                        >
                                            {featuredPost.author.name}
                                        </a>
                                    </div>

                                    {/* Separator */}
                                    <span className="text-gray-400">•</span>

                                    {/* Date */}
                                    <time className="text-sm">
                                        {featuredPost.date}
                                    </time>
                                </div>
                            </div>
                        </div>



                    </article>
                </div>
            </div>
        </section>
    );
};

export default FeaturedContentGrid;