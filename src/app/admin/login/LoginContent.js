'use client';

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  if (error === 'AccessDenied') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-600">
        <div className="text-white text-center p-8">
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-lg">You are not allowed to access the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Admin Login</h1>
        <div className="mt-2 text-center">
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google logo"
              className="w-5 h-5 mr-2"
            />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}