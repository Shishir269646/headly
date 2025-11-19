"use client";

import React, { useEffect } from "react";
import { useContent } from "@/hooks/useContent";
import Link from "next/link";

const AllContentPage = () => {
  const { contents, loading, error, getContents } = useContent();

  useEffect(() => {
    getContents({ page: 1, limit: 100 }); // Fetch all content
  }, [getContents]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">All Content</h1>

      {loading && (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {error && (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error: {error.message || "Failed to fetch content."}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contents.map((content) => (
            <div key={content._id} className="card bg-base-100 shadow-xl">
              <figure>
                <img
                  src={content.featuredImage ? content.featuredImage.url : "https://via.placeholder.com/400x225"}
                  alt={content.title}
                  className="h-48 w-full object-cover"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{content.title}</h2>
                <p>
                  {content.excerpt
                    ? content.excerpt
                    : `${content.body.substring(0, 100)}...`}
                </p>
                <div className="card-actions justify-end">
                  <Link href={`/content/${content.slug}`} className="btn btn-primary">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllContentPage;
