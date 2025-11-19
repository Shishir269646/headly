import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ReduxProvider } from "@/store/provider";
import { ThemeScript } from "./theme-script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Headly",
  description: "Headly Project - Powered by Next.js",
};

export default function RootLayout({ children }) {


  // Detect system theme on SSR
  const prefersDark =
    typeof window === "undefined"
      ? false
      : window.matchMedia("(prefers-color-scheme: dark)").matches;

  const initialThemeClass = prefersDark ? "dark" : "";



  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <main>
          <Providers>
            <ReduxProvider>{children}</ReduxProvider>
          </Providers>
        </main>
      </body>
    </html>

  );
}
