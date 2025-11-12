"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/providers/auth-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}

// کامپوننت برای Context Provider ها مثل NextAuth SessionProvider, ThemeProvider