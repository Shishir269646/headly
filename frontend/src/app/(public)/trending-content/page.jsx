"use client";

import React, { useEffect } from "react";
import { useContent } from "@/hooks/useContent";
import { useCategories } from "@/hooks/useCategories";
import Link from "next/link";
import { XCircle } from "lucide-react";
import ArticleCard from '@/components/ui/ArticleCard';

const TrendingContentPage = () => {
  const { trending, loading, error, getTrending } = useContent();
  const { categories } = useCategories();

  useEffect(() => {
    getTrending();
  }, [getTrending]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Trending Content</h1>

      <hr className="mb-8" />

      {loading && (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {error && (
        <div role="alert" className="alert alert-error">
          <XCircle className="stroke-current shrink-0 h-6 w-6" />
          <span>Error: {error}</span>
        </div>
      )}

      {!loading && !error && (
        <>
          {trending.length === 0 && (
            <div role="alert" className="alert alert-info max-w-lg mx-auto">
              <XCircle className="stroke-current shrink-0 h-6 w-6" />
              <span>No trending content found.</span>
            </div>
          )}

          {trending.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trending.map((content) => (
                <ArticleCard key={content._id} post={content} allCategories={categories} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TrendingContentPage;
