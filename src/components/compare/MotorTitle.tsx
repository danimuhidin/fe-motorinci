// components/compare/MotorTitle.tsx
"use client";

import type { Motor } from "@/types/motor";
import { Skeleton } from "@/components/ui/skeleton";

interface MotorTitleProps {
    motor?: Motor | null;
    loading: boolean;
}

export function MotorTitle({ motor, loading }: MotorTitleProps) {
    if (loading) {
        return (
            <div className="p-2">
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto mt-2" />
            </div>
        );
    }
    if (!motor) {
        return <div className="text-center p-2 rounded-lg bg-zinc-900 sticky top-16 z-10">...</div>;
    }

    return (
        <div className="text-center p-2 rounded-lg bg-zinc-900 sticky top-16 z-10">
            <h2 className="text-base font-bold">{motor.brand.name} {motor.name}</h2>
            <p className="text-gray-400 text-sm">{motor.year_model}</p>
        </div>
    );
}