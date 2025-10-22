
// ============================================
// ✅ FIXED: src/app/api/revalidate/route.js
// ============================================

import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        // Verify secret
        const secret = request.headers.get('x-revalidate-secret');

        if (secret !== process.env.REVALIDATE_SECRET) {
            return NextResponse.json(
                { error: 'Invalid secret' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { slug, action } = body;

        if (!slug) {
            return NextResponse.json(
                { error: 'Slug is required' },
                { status: 400 }
            );
        }

        // Revalidate specific blog post
        await revalidatePath(`/blog/${slug}`);

        // Also revalidate blog list page
        await revalidatePath('/blog');

        console.log(`✅ Revalidated: /blog/${slug} (${action})`);

        return NextResponse.json({
            revalidated: true,
            message: `Successfully revalidated /blog/${slug}`,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Revalidation error:', error);
        return NextResponse.json(
            {
                error: 'Error revalidating',
                details: error.message
            },
            { status: 500 }
        );
    }
}

// Health check endpoint
export async function GET() {
    return NextResponse.json({
        status: 'OK',
        message: 'Revalidation endpoint is working',
        timestamp: new Date().toISOString()
    });
}
