"use client";

// frontend/src/app/(admin-protected)/page.js
// This will be your simplified dashboard page

export default function AdminDashboardPage() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Your Admin Panel!</h2>
      <p className="text-gray-600 text-lg">Use the navigation to manage your articles.</p>
      <p className="text-gray-500 text-sm mt-2">
        Go to &quot;Manage Articles&quot; in the sidebar to view and manage your content.
      </p>
    </div>
  );
} 