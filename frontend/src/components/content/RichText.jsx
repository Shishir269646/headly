"use client";

import React from "react";

/**
 * Simple wrapper for rendering HTML safely
 * Handles dark/light mode styles automatically
 */
export default function RichText({ html }) {
    return (
        <div
            className="richtext leading-relaxed text-gray-800 dark:text-gray-100"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
