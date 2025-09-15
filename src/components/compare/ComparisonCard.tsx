// components/compare/ComparisonCard.tsx
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ComparisonCardProps {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
}

export function ComparisonCard({ title, children, loading }: ComparisonCardProps) {
  return (
    <div className="rounded-lg border border-white/20 bg-zinc-900/50">
      <h3 className="text-sm font-semibold p-2 border-b border-white/20 text-center">
        {title}
      </h3>
      {loading ? (
        <div className="p-3 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
        </div>
      ) : (
        <div className="grid grid-cols-2 divide-x divide-white/20">
            {children}
        </div>
      )}
    </div>
  );
}