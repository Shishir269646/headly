"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useContent } from "@/hooks/useContent";
import { useUser } from "@/hooks/useUser";
import { useCategories } from "@/hooks/useCategories";
import { XCircle } from "lucide-react";
import ArticleCard from '@/components/ui/ArticleCard';
import ContentSearchBar from "@/components/ui/ContentSearchBar";
import Loader from "@/components/common/Loader";

const AllContentPage = () => {
  const { contents, loading, error, getContents } = useContent();
  // Do not auto-fetch admin-only user list on public all-content listing
  const { users } = useUser(null, { autoFetch: false });
  const { categories } = useCategories();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAuthorId, setSelectedAuthorId] = useState("");
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("");

  useEffect(() => {
    // Prepare filters object
    const filters = { page: 1, limit: 100 };
    if (searchTerm) {
      filters.search = searchTerm;
    }
    if (selectedAuthorId) {
      filters.author = selectedAuthorId;
    }
    if (selectedCategorySlug) {
      filters.category = selectedCategorySlug;
    }

    getContents(filters);
  }, [getContents, searchTerm, selectedAuthorId, selectedCategorySlug]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">All Content</h1>

      <ContentSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Filter controls */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        {/* Author Filter */}
        <select
          className="select select-bordered w-full max-w-xs"
          value={selectedAuthorId}
          onChange={(e) => setSelectedAuthorId(e.target.value)}
        >
          <option value="">All Authors</option>
          {users.map((author) => (
            <option key={author._id} value={author._id}>
              {author.name}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          className="select select-bordered w-full max-w-xs"
          value={selectedCategorySlug}
          onChange={(e) => setSelectedCategorySlug(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <hr className="mb-8" />

      {loading && (
        <Loader />
      )}

      {error && (
        <div role="alert" className="alert alert-error">
          <XCircle className="stroke-current shrink-0 h-6 w-6" />
          <span>Error: {error}</span>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Display message if no content matches the search */}
          {contents.length === 0 && (
            <div role="alert" className="alert alert-info max-w-lg mx-auto">
              <XCircle className="stroke-current shrink-0 h-6 w-6" />
              <span>No content found matching your criteria.</span>
            </div>
          )}

          {/* Use contents for rendering (already filtered by backend) */}
          {contents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {contents.map((content) => (
                <ArticleCard key={content._id} post={content} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllContentPage;