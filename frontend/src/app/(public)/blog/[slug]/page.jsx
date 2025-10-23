// app/(public)/blog/[slug]/page.js


export const revalidate = 60; // ISR: 60 seconds

export async function generateMetadata({ params }) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contents/slug/${params.slug}`
    );
    const data = await res.json();
    const post = data.data;

    return {
        title: post.seo?.metaTitle || post.title,
        description: post.seo?.metaDescription || post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [post.featuredImage?.url]
        }
    };
}

export default async function BlogPostPage({ params }) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contents/slug/${params.slug}`,
        { next: { revalidate: 60 } }
    );
    const data = await res.json();
    const post = data.data;

    return (
        <article>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
            <div dangerouslySetInnerHTML={{ __html: post.body }} />
        </article>
    );
}

