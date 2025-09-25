// app/layout.tsx

import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { BottomNavbar } from "@/components/BottomNavbar";
import ClientLayout from "./client-layout";
import { Toaster } from "sonner";

// Konfigurasi Font
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Motorinci | Katalog Motor",
  description: "Aplikasi katalog motor untuk pencinta otomotif",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requireAuth = process.env.NEXT_ADMINISTRATOR_OR_NOT === 'true'
  return (
    <html lang="id">
      <body
        className={cn(
          "min-h-screen font-sans antialiased bg-black/98 text-white",
          fontSans.variable
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <main className="w-full max-w-md mx-auto flex-1 sm:border sm:shadow-lg sm:rounded-lg sm:shadow-white/10 sm:border-white/10">
            <ClientLayout requireAuth={requireAuth}>
              {children}
            </ClientLayout>
            <BottomNavbar />
          </main>
        </div>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}