"use client";

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();

    // When the theme from next-themes changes, also update the data-theme attribute for DaisyUI
    useEffect(() => {
        if (theme) {
            document.documentElement.setAttribute('data-theme', theme);
        }
    }, [theme]);

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true);
        // On mount, ensure data-theme is set
        const currentTheme = localStorage.getItem("theme") || "light";
        document.documentElement.setAttribute('data-theme', currentTheme);
    }, []);

    if (!mounted) {
        // Render a placeholder or null on the server to avoid hydration mismatch
        return (
            <div className="w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-300 animate-pulse" />
        );
    }

    const handleToggle = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        // The useEffect above will handle setting the data-theme attribute
    };

    return (
        <button
            onClick={handleToggle}
            className="btn btn-ghost btn-circle"
            aria-label="Toggle Dark Mode"
        >
            {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
            ) : (
                <Moon className="w-5 h-5" />
            )}
        </button>
    );
}
