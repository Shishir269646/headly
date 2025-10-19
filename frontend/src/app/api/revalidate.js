// ✅ File: /pages/api/revalidate.js
// /app/api/revalidate/route.js
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { path, secretToken } = await request.json();

        // ✅ Secret validation
        if (secretToken !== process.env.REVALIDATE_SECRET) {
            return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
        }

        if (!path) {
            return NextResponse.json({ message: "Missing path" }, { status: 400 });
        }

        // ✅ Trigger on-demand revalidation
        try {
            await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate?path=${path}`, {
                method: "GET",
            });
        } catch (err) {
            console.error("Revalidation fetch error:", err);
        }

        return NextResponse.json({
            revalidated: true,
            path,
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        console.error("Revalidate error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}


/* যখন তুমি Next.js-এ কোনো পেজ statically generate কর (যেমন ব্লগ পোস্ট, প্রোডাক্ট ডিটেইলস 
ইত্যাদি),
তখন Next.js সেই পেজটি build-এর সময় একবারই তৈরি করে।
কিন্তু যদি তুমি CMS (যেমন Sanity, Strapi, বা তোমার নিজের Dashboard) থেকে content আপডেট করো,
 সেই পেজের ডেটা তো বদলে গেছে — কিন্তু static পেজ এখনও পুরোনো data দেখাচ্ছে।
 */