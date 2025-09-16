// components/compare/MotorCarousel.tsx
"use client";

import type { Motor } from "@/types/motor";
import Image from "next/image";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

const API_PUBLIC_URL = process.env.NEXT_PUBLIC_API_PUBLIC_URL;

interface MotorCarouselProps {
    motor?: Motor | null;
    loading: boolean;
}

export function MotorCarousel({ motor, loading }: MotorCarouselProps) {
    if (loading) {
        return <Skeleton className="aspect-video w-full rounded-lg" />;
    }
    if (!motor) {
        return <div className="aspect-video w-full rounded-lg bg-zinc-800 flex items-center justify-center p-4 text-center">Data tidak ditemukan.</div>;
    }

    return (
        <Carousel className="w-full">
            <CarouselContent>
                {motor.images && motor.images.length > 0 ? (
                    motor.images.map((img) => (
                        <CarouselItem key={img.id}>
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-800">
                                <Image src={`${API_PUBLIC_URL}${img.image_url}`} alt={img.caption || motor.name} fill style={{ objectFit: "cover" }} />
                            </div>
                        </CarouselItem>
                    ))
                ) : (
                    <CarouselItem>
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-zinc-800 flex items-center justify-center p-4">
                            <Image src="/imagenotfound.png" alt="Gambar tidak tersedia" width={100} height={100} style={{ objectFit: "contain" }} />
                        </div>
                    </CarouselItem>
                )}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-black/50 border-white/20 hover:bg-black/80" />
            <CarouselNext className="right-2 bg-black/50 border-white/20 hover:bg-black/80" />
        </Carousel>
    );
}