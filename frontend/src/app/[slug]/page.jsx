// /app/content/[slug]/page.jsx
"use client";
import ContentRenderer from "@/components/content/ContentRenderer";
import { notFound } from "next/navigation";
import SEO from "@/components/seo/SEO";

// 🧩 Dynamic ISR configuration
export const revalidate = 60; // প্রতি ১ মিনিট পর পেজ revalidate হবে

// 🔹 Backend API Base URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// 🧠 Dynamic metadata for SEO
export async function generateMetadata({ params }) {
    const res = await fetch(`${API_BASE}/api/content/${params.slug}`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) return { title: "Content Not Found | Headly" };

    const content = await res.json();
    const data = content.data || {};

    return {
        title: data?.title || "Headly Content",
        description: data?.meta?.description || "Explore detailed content on Headly.",
        openGraph: {
            title: data?.title,
            description: data?.meta?.description,
            images: [
                data?.meta?.image ||
                "https://your-default-image-url.com/default-og-image.jpg",
            ],
        },
    };
}

// 🔹 Fetch individual content
async function getContent(slug) {
    const res = await fetch(`${API_BASE}/api/content/slug/${slug}`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) return null;

    const content = await res.json();
    return content.data;
}

// 🧩 Page Component
export default async function ContentPage({ params }) {
    const content = await getContent(params.slug);

    if (!content) return notFound();

    const isPublished = content.status === "published";
    const publishedDate = new Date(content.publishAt).toLocaleDateString();

    return (
        <>
            {/* 🧠 SEO Component */}
            <SEO
                title={content.meta?.title || content.title}
                description={content.meta?.description}
                image={content.meta?.image}
                slug={content.slug}
            />

            <section className="max-w-4xl mx-auto px-4 py-10">
                <h1 className="text-4xl font-bold mb-4">{content.title}</h1>

                <div className="flex items-center justify-between mb-6 text-sm text-gray-500">
                    <span>By {content.author?.name || "Unknown"}</span>
                    {isPublished && <span>Published on {publishedDate}</span>}
                </div>

                {/* 🧾 Content Renderer */}
                <article className="prose dark:prose-invert max-w-none">
                    {content.bodyHtml ? (
                        // যদি backend থেকে HTML render করা থাকে
                        <div
                            dangerouslySetInnerHTML={{ __html: content.bodyHtml }}
                        />
                    ) : (
                        // না থাকলে frontend renderer দিয়ে JSON → React nodes
                        <ContentRenderer content={content.body} />
                    )}
                </article>
            </section>
        </>
    );
}
