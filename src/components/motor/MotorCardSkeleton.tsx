// components/motor/MotorCardSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function MotorCardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden bg-zinc-900">
      {/* Skeleton untuk Gambar */}
      <Skeleton className="aspect-video w-full" />
      
      {/* Skeleton untuk Footer */}
      <div className="p-3 space-y-2">
        <Skeleton className="h-5 w-4/5" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}