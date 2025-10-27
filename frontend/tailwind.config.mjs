// tailwind.config.mjs
import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [daisyui],
    daisyui: {
        themes: ["light", "dark", "synthwave", "cupcake"],
        darkTheme: "dark",
        base: true,
        styled: true,
        utils: true,
    },
};

export default config;
