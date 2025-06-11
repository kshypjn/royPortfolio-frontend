// frontend/src/app/(admin-protected)/layout.js
"use client"; // This layout needs to be a Client Component to use useSession and useRouter

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation"; // Use next/navigation for App Router
import { useEffect } from "react";
import Link from "next/link"; // For navigation links

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Get the allowed emails from our environment variable and convert them to a lowercase array
  const allowedEmails = process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS
    ? process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS.split(',').map(email => email.trim().toLowerCase())
    : [];

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/admin/login");
    } else {
      const userEmail = session.user?.email?.toLowerCase();
      if (!allowedEmails.includes(userEmail)) {
        signOut({ callbackUrl: "/admin/login?error=AccessDenied" });
      }
    }
  }, [session, status, router, allowedEmails]);

  if (status === "loading" || !session) {
    // You can render a loading spinner or a simple message here while auth status is determined
    // Or if not authenticated, the useEffect above will redirect
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading admin panel...</p>
      </div>
    );
  }

  // If authenticated, render the admin layout with sidebar
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col">
        <div className="text-2xl font-bold mb-8">Admin Panel</div>
        <nav className="flex-grow">
          <ul>
            <li className="mb-4">
              <Link href="/dashboard" className="block text-gray-300 hover:text-white">
                Dashboard Home
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/articles" className="block text-gray-300 hover:text-white">
                Manage Articles
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/admin/about" className="block text-gray-300 hover:text-white">
              Edit About Me Page
              </Link>
            </li>
            {/* Add more admin links here as needed */}
            {/* Example: Users, Settings, etc. */}
          </ul>
        </nav>
        <div className="mt-auto">
          <p className="text-sm text-gray-400 mb-2">Logged in as: {session.user?.email}</p>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children} {/* This is where your /dashboard/page.js content will be rendered */}
      </main>
    </div>
  );
}