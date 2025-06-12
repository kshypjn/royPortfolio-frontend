"use client";

// frontend/src/app/(admin-protected)/page.js
// This will be your simplified dashboard page

import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Your Admin Panel!</h2>
      <p className="text-gray-600 text-lg mb-6">Use the links below to manage your content.</p>
      <div className="flex flex-col gap-4 items-center">
        <Link href="/admin/about" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 w-64 text-center">
          Edit About Me
        </Link>
        <Link href="/articles" className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 w-64 text-center">
          Manage Articles
        </Link>
        <Link href="/articles/new" className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 w-64 text-center">
          Add New Article
        </Link>
      </div>
    </div>
  );
} 