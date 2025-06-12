"use client";

import { signOut } from "next-auth/react";

export default function DashboardActions() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="mt-4 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 w-64 text-center"
    >
      Logout
    </button>
  );
} 