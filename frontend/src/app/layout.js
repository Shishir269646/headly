
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
//import Header from "@/components/common/Header";
//import Footer from "@/components/common/Footer";
import { ReduxProvider } from "@/store/provider";
//import { AuthProvider } from "@/context/AuthContext";

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
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        suppressHydrationWarning
      >




        {/* Main Page Content */}
        <main>

          <ReduxProvider>

            {children}

          </ReduxProvider>
        </main>




      </body>
    </html>
  );
}