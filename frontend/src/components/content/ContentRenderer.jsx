'use client';

import React from "react";

/**
 * Renders HTML content directly.
 */
export default function ContentRenderer({ content }) {
    if (!content) return null;

    return (
        <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
        />
    );
}
