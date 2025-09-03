// app/client-layout.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import React from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{
                    duration: 0.1,
                    ease: "easeOut",
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}