// app/layout.tsx

import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { BottomNavbar } from "@/components/BottomNavbar";
import ClientLayout from "./client-layout";

// Konfigurasi Font
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Katalog Motor Keren",
  description: "Dibuat dengan Next.js dan cinta",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className={cn(
          "min-h-screen font-sans antialiased bg-black/98 text-white",
          fontSans.variable
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <main className="w-full max-w-md mx-auto flex-1 sm:border sm:shadow-lg sm:rounded-lg overflow-hidden sm:shadow-white/10 sm:border-white/10">
            <ClientLayout>
              {children}
            </ClientLayout>
            <BottomNavbar />
          </main>
        </div>
      </body>
    </html>
  );
}