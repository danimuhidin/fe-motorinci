// components/search/GlobalSearch.tsx
"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { SearchModal } from "@/components/home/SearchModal"; // Kita gunakan lagi modal yang sudah ada

export function GlobalSearch() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  return (
    <div className="relative">
      <div 
        className="absolute top-1 right-1 z-20 cursor-pointer p-2 rounded-full hover:bg-white/10 transition-colors"
        onClick={() => setIsSearchModalOpen(true)}
      >
        <Search className="h-6 w-6 text-white" />
      </div>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </div>
  );
}