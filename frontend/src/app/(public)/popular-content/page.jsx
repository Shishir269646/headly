"use client";

import React, { useEffect } from "react";
import { useContent } from "@/hooks/useContent";
import { useCategories } from "@/hooks/useCategories";
import Link from "next/link";
import { XCircle } from "lucide-react";
import ArticleCard from '@/components/ui/ArticleCard';
import Loader from "@/components/common/Loader";

const PopularContentPage = () => {
  const { popular, loading, error, getPopular } = useContent();
  const { categories } = useCategories();

  useEffect(() => {
    getPopular();
  }, [getPopular]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Popular Content</h1>

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
          {popular.length === 0 && (
            <div role="alert" className="alert alert-info max-w-lg mx-auto">
              <XCircle className="stroke-current shrink-0 h-6 w-6" />
              <span>No popular content found.</span>
            </div>
          )}

          {popular.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popular.map((content) => (
                <ArticleCard key={content._id} post={content} allCategories={categories} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PopularContentPage;
