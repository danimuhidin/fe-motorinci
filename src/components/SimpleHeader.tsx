"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  title: string;
  backUrl?: string;
  className?: string;
}

export default function Header({ title, backUrl, className }: HeaderProps) {
  return (
    <header className={`relative flex items-center justify-between py-2 px-3 border-b border-white/30 h-12 bg-black/98 ${className}`}>
      {backUrl && (
        <Link href={backUrl} className="flex items-center space-x-2">
          <ChevronLeft className="h-6 w-6 text-white" />
        </Link>
      )}

      <h1 className="flex-1 text-left text-xl font-semibold pl-2 truncate">{title}</h1>
    </header>
  );
}