'use client';

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function LoginContent() {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  const supabase = createClientComponentClient();

  useEffect(() => {
    setError(null);
    const authError = searchParams.get('error');
    if (authError === 'AccessDenied') {
      setError("Your account is not authorized to access the admin panel.");
    } else if (authError) {
      setError("Login failed. Please check your credentials.");
    }
    const resetSuccess = searchParams.get('resetSuccess');
    if (resetSuccess === 'true') {
      setMessage("Password reset successfully. Please log in with your new password.");
    }
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Admin Login</h1>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {message && <p className="text-green-600 text-sm mb-4 text-center">{message}</p>}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google logo"
              className="w-5 h-5 mr-2"
            />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
} 