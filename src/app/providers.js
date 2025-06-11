"use client"; // This component must be a Client Component

import { SessionProvider } from "next-auth/react";

// This component wraps your application to provide session context
export function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
} 