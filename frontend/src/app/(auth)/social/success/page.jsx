"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaCheckCircle } from 'react-icons/fa';

export default function SocialAuthSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <FaCheckCircle className="h-12 w-12 text-success" />
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