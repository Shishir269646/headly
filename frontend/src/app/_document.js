
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en" data-theme="light">
            <Head>

                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />

                {/* Favicon */}
                <link rel="icon" href="/favicon.ico" />

                {/* Meta SEO */}
                <meta name="description" content="Headly Project - Powered by Next.js and DaisyUI CMS" />
                <meta name="keywords" content="Next.js, DaisyUI, CMS, Headly, Blog, Content Platform" />
                <meta name="author" content="Manjirul Islam Shishir" />

                {/* Theme & Color */}
                <meta name="theme-color" content="#ffffff" />
                <meta name="color-scheme" content="light dark" />

                {/* Open Graph Tags */}
                <meta property="og:title" content="Headly Project" />
                <meta property="og:description" content="AI-powered Content Platform built with Next.js & DaisyUI" />
                <meta property="og:image" content="/og-image.jpg" />
                <meta property="og:url" content="https://your-domain.com" />
                <meta property="og:type" content="website" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Headly Project" />
                <meta name="twitter:description" content="Next.js + DaisyUI CMS with Tiptap Editor" />
                <meta name="twitter:image" content="/og-image.jpg" />


            </Head>

            <body className="font-sans bg-base-100 text-base-content min-h-screen flex flex-col antialiased">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
