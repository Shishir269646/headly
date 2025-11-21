
import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        // Verify secret
        const secret = request.headers.get('x-revalidate-secret');
        console.log('Received revalidation request. Secret present:', !!secret);

        if (secret !== process.env.REVALIDATE_SECRET) {
            console.warn('Revalidation failed: Invalid secret provided.');
            return NextResponse.json(
                { error: 'Invalid secret' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { slug, action } = body;

        if (!slug) {
            console.warn('Revalidation failed: Slug is required.');
            return NextResponse.json(
                { error: 'Slug is required' },
                { status: 400 }
            );
        }

        // Revalidate specific content page
        await revalidatePath(`/content/${slug}`);

        // Also revalidate content list page
        await revalidatePath('/all-content');

        console.log(`✅ Revalidated paths: /content/${slug} and /all-content (Action: ${action})`);

        return NextResponse.json({
            revalidated: true,
            message: `Successfully revalidated /content/${slug} and /all-content`,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Revalidation error:', error);
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
