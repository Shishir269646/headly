// src/components/LogoutButton.jsx
"use client";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/store/slices/authSlice";

export default function LogoutButton() {
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = () => {
        dispatch(logout());
        router.push("/login");
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium"
        >
            Logout
        </button>
    );
}
