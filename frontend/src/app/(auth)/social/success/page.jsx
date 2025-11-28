"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SocialAuthSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Optionally redirect after a few seconds or based on some condition
    // For now, let's just keep it as a success page with a link.
    // You might want to get user info from query params or local storage here
    // and store it in your auth context/store.
    // Example: const token = new URLSearchParams(window.location.search).get('token');
    // if (token) {
    //   localStorage.setItem('jwtToken', token);
    //   // Update auth state in your store
    // }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-12 w-12 text-success"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="card-title text-success mt-4">Authentication Successful!</h2>
          <p className="text-sm text-base-content-secondary">
            You have successfully logged in. You will be redirected shortly or click the button below.
          </p>
          <div className="card-actions justify-end mt-6">
            <Link href="/" className="btn btn-primary">
              Go to Home Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}