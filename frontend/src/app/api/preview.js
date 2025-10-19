import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const slug = searchParams.get("slug");

    if (secret !== process.env.REVALIDATE_SECRET) {
        return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    if (!slug) {
        return NextResponse.json({ message: "Missing slug" }, { status: 400 });
    }

    const response = NextResponse.redirect(`/content/${slug}`);
    response.cookies.set("__next_preview_data", "true", { path: "/" });
    return response;
}
