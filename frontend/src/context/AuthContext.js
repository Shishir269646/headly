// src/context/AuthContext.js
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import api from "@/libs/axios"; // তোমার api wrapper
import Router from "next/router";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // initial loading (check token)
    const [token, setToken] = useState(null); // optionally keep token in state

    // load token/user from localStorage on mount (client-side)
    useEffect(() => {
        const stored = typeof window !== "undefined" ? localStorage.getItem("auth") : null;
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setToken(parsed.token);
                setUser(parsed.user);
            } catch (err) {
                localStorage.removeItem("auth");
            }
        }
        setIsLoading(false);
    }, []);

    // keep localStorage in sync when token/user changes
    useEffect(() => {
        if (token && user) {
            localStorage.setItem("auth", JSON.stringify({ token, user }));
        } else {
            localStorage.removeItem("auth");
        }
    }, [token, user]);

    // attach token to api wrapper default header
    useEffect(() => {
        if (token) {
            api.defaults = api.defaults || {};
            // if using axios instance exported as default object with methods, adjust:
            // apiInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
            // For our earlier api.js wrapper, we'll set a helper:
            localStorage.setItem("token", token); // for api.js interceptor example
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    // login function
    async function login(email, password) {
        setIsLoading(true);
        try {
            // call your backend auth endpoint
            const res = await api.post("/auth/login", { email, password });
            // expected res shape: { data: { token, user } } or whatever your api returns
            const payload = res.data || res; // adjust depending on api.js
            const accessToken = payload.token || payload?.data?.token;
            const userObj = payload.user || payload?.data?.user;
            if (!accessToken || !userObj) {
                throw new Error("Invalid login response from server");
            }

            setToken(accessToken);
            setUser(userObj);

            // optional: redirect to dashboard
            Router.replace("/dashboard");
            return { success: true };
        } catch (err) {
            console.error("Login error:", err);
            return { success: false, message: err.message || "Login failed" };
        } finally {
            setIsLoading(false);
        }
    }

    // logout function
    async function logout() {
        // optional: call backend to invalidate refresh token
        try {
            await api.post("/auth/logout"); // if implemented
        } catch (err) {
            // ignore
        }
        setToken(null);
        setUser(null);
        localStorage.removeItem("auth");
        localStorage.removeItem("token");
        Router.replace("/login");
    }

    // helper: check role
    function hasRole(role) {
        if (!user) return false;
        return user.role === role || (Array.isArray(user.roles) && user.roles.includes(role));
    }

    // fetch fresh user from server (optional)
    async function refreshUser() {
        try {
            const res = await api.get("/auth/me");
            const userObj = res.data || res;
            setUser(userObj);
            return userObj;
        } catch (err) {
            console.error("refreshUser failed", err);
            logout();
            return null;
        }
    }

    const value = {
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasRole,
        refreshUser,
        setUser,
        setToken,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// custom hook
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return ctx;
};
