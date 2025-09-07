// components/BottomNavbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Calculator,
  GitCompareArrows,
  Newspaper,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

type MenuItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const menuItems: MenuItem[] = [
  { href: "/compare", label: "Compare", icon: GitCompareArrows },
  { href: "/calculator", label: "Calculator", icon: Calculator },
  { href: "/", label: "Home", icon: Home },
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/setting", label: "Setting", icon: Settings },
];

export function BottomNavbar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-16">
      <nav
        className="relative mx-auto h-full max-w-md border-t border-white/30 bg-black text-white"
      >
        <div className="mx-auto flex h-full items-center justify-around">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;

            if (item.label === "Home") {
              return (
                <div key={item.href} className="relative -mt-6">
                  <Link
                    href={item.href}
                    className={cn(
                      "relative flex h-16 w-16 flex-col items-center border border-white/30 justify-center gap-1 rounded-full bg-black text-gray-300 shadow-lg transition-transform duration-200 active:bg-black/90",
                      isActive ? "scale-110 text-white border-2 border-red-700 bg-red-700" : "scale-100"
                    )}
                  >
                    <item.icon className="h-7 w-7" />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-full w-full flex-col items-center justify-center gap-1 transition-colors duration-200 text-gray-300 active:bg-gray-500",
                  isActive ? "text-red-700" : "hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className={cn("text-xs", isActive && "font-bold")}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      
    </div>
  );
}