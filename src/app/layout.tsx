// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import "@/lib/scheduler";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "The Globe’s Heritage by Chef Alex",
  description: "CRM system for campaigns, contacts, and reports",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
