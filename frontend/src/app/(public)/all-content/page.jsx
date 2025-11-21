"use client";

import React, { useEffect } from "react";
import { useContent } from "@/hooks/useContent";
import Link from "next/link";
import { XCircle } from "lucide-react";

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
          <XCircle className="stroke-current shrink-0 h-6 w-6" />
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
                  <Link href={`/${content.slug}`} className="btn btn-primary">
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
