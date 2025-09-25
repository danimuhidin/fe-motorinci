// app/client-layout.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { LoginModal } from "@/components/LoginModal"; 

export default function ClientLayout({
  children,
  requireAuth,
}: {
  children: React.ReactNode;
  requireAuth: boolean;
}) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(!requireAuth);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!requireAuth) {
      setIsLoading(false);
      return;
    }

    const sessionIsAuthenticated = sessionStorage.getItem("is_authenticated");
    if (sessionIsAuthenticated === "true") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setIsLoading(false);
  }, [requireAuth]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };
  
  if (isLoading && requireAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Memuat...</p>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <LoginModal onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ scale: 0.95, opacity: 0 }} // Sedikit modifikasi untuk animasi lebih halus
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.1, // Sedikit diperlambat agar terasa
          ease: "easeOut",
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}