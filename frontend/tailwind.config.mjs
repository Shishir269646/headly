import daisyui from "daisyui";
import typography from "@tailwindcss/typography";

const config = {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [
        daisyui,
        typography, // correct usage
    ],
    daisyui: {
        themes: ["light", "dark", "synthwave", "cupcake"],
        darkTheme: "dark",
        base: true,
        styled: true,
        utils: true,
    },
};

export default config;
