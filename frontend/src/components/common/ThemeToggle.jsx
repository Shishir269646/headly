"use client";

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
    const [mounted, setMounted] = useState(false);
    const { theme, setTheme } = useTheme();


    useEffect(() => {
        if (theme) {
            document.documentElement.setAttribute('data-theme', theme);
        }
    }, [theme]);



    useEffect(() => {
        setMounted(true);

        const currentTheme = localStorage.getItem("theme") || "light";
        document.documentElement.setAttribute('data-theme', currentTheme);
    }, []);

    if (!mounted) {
        return (
            <div className="w-12 h-6 rounded-full bg-gray-200 dark:bg-gray-300 animate-pulse" />
        );
    }

    const handleToggle = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);

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
