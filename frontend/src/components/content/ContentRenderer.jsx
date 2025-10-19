"use client";

import React from "react";
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import RichText from "./RichText";

/**
 * Converts Tiptap JSON content into HTML or React nodes
 */
export default function ContentRenderer({ content }) {
    if (!content) return null;

    // Convert Tiptap JSON → HTML
    const html = generateHTML(content, [StarterKit]);

    return (
        <div className="prose dark:prose-invert max-w-none">
            <RichText html={html} />
        </div>
    );
}
