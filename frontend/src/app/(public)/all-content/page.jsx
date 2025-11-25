"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useContent } from "@/hooks/useContent";
import Link from "next/link";
import { XCircle } from "lucide-react";
import Image from "next/image";
// Import the new search bar component
import ContentSearchBar from "@/components/ui/ContentSearchBar"; // Adjust path as needed

const AllContentPage = () => {
  const { contents, loading, error, getContents } = useContent();
  // State for the search query remains here, as this component handles the data filtering
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch all content when the component mounts
    getContents({ page: 1, limit: 100 });
  }, [getContents]);

  // Filter the contents based on the search term
  const filteredContents = useMemo(() => {
    if (!searchTerm) {
      return contents;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return contents.filter(
      (content) =>
        content.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        (content.excerpt
          ? content.excerpt.toLowerCase().includes(lowerCaseSearchTerm)
          : content.body.toLowerCase().substring(0, 100).includes(lowerCaseSearchTerm)
        )
    );
  }, [contents, searchTerm]);


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">All Content</h1>

      {/* RENDER THE COMPONENT HERE */}
      <ContentSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <hr className="mb-8" />

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
        <>
          {/* Display message if no content matches the search */}
          {filteredContents.length === 0 && contents.length > 0 && (
            <div role="alert" className="alert alert-info max-w-lg mx-auto">
              <XCircle className="stroke-current shrink-0 h-6 w-6" />
              <span>No content found matching your search term: **"{searchTerm}"**</span>
            </div>
          )}

          {/* Use filteredContents for rendering */}
          {filteredContents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredContents.map((content) => (
                <div key={content._id} className="card bg-base-200 shadow-xl">
                  <figure>
                    <Image
                      src={content.featuredImage ? content.featuredImage.url : "https://via.placeholder.com/400x225"}
                      alt={content.title}
                      width={400}
                      height={225}
                      loading="lazy"
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
        </>
      )}
    </div>
  );
};

export default AllContentPage;