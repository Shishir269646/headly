"use client";

import Link from "next/link";

/**
 * Displays a short preview card of a content item.
 * Used in home or content listing pages.
 */
export default function ContentCard({ content }) {
    return (
        <div className="rounded-2xl border dark:border-gray-700 hover:shadow-lg transition p-5 bg-white dark:bg-gray-900">
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                <Link href={`/content/${content.slug}`}>{content.title}</Link>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-3">
                {content.meta?.description?.slice(0, 120) || "No description available."}
            </p>
            <Link
                href={`/content/${content.slug}`}
                className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
                Read More →
            </Link>
        </div>
    );
}


/* 
import SEO from "@/seo/SEO";
import ContentRenderer from "@/components/content/ContentRenderer";

export default function ContentPage({ content }) {
  return (
    <>
      <SEO
        title={content.title}
        description={content.meta?.description}
        keywords={content.meta?.keywords}
        slug={`/content/${content.slug}`}
        image={content.media?.[0]?.url || "/default-og-image.jpg"}
      />

      <main className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">{content.title}</h1>
        <ContentRenderer content={content.body} />
      </main>
    </>
  );
}
 */