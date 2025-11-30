"use client";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import LogoutButton from "../ui/LogoutButton";

import { useAuth } from '@/hooks/useAuth';

export default function Header() {
    const { isAuthenticated, isRoleViewer } = useAuth();
    return (
        <div className="navbar shadow-md bg-base-300">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li><Link href="/">Home</Link></li>
                        <li><Link href="/about">About</Link></li>
                        <li><Link href="/archive">Archive</Link></li>
                        <li><Link href="/all-content">All Content</Link></li>
                        <li><Link href="/popular-content">Popular</Link></li>
                        <li><Link href="/trending-content">Trending</Link></li>
                        <li><Link href="/newsletter">Newsletter</Link></li>
                        <li><Link href="/contact">Contact</Link></li>
                        {isAuthenticated && isRoleViewer && (
                            <li><Link href="/profile">Profile</Link></li>
                        )}
                        <LogoutButton/>
                    </ul>
                </div>
                <Link href="/" className="btn btn-ghost text-xl">Headly</Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/about">About</Link></li>
                    <li><Link href="/archive">Archive</Link></li>
                        <li><Link href="/all-content">All Content</Link></li>
                        <li><Link href="/popular-content">Popular</Link></li>
                        <li><Link href="/trending-content">Trending</Link></li>
                    <li><Link href="/newsletter">Newsletter</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                    {isAuthenticated && isRoleViewer && (
                        <li><Link href="/profile">Profile</Link></li>
                    )}
                    <LogoutButton/>
                </ul>
            </div>
            <div className="navbar-end gap-2">
                
                <ThemeToggle />
            </div>
        </div>
    );
}
