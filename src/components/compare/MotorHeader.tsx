// components/compare/MotorHeader.tsx
"use client";

import type { Motor } from "@/types/motor";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const API_PUBLIC_URL = process.env.NEXT_PUBLIC_API_PUBLIC_URL;

interface MotorHeaderProps {
  motor?: Motor | null;
  loading: boolean;
}

export function MotorHeader({ motor, loading }: MotorHeaderProps) {
  if (loading) {
    return <div className="flex justify-center items-center h-48 rounded-lg bg-zinc-900"><Loader2 className="animate-spin text-red-500" size={32} /></div>;
  }
  if (!motor) {
    return <div className="flex justify-center items-center h-48 rounded-lg bg-zinc-900 p-4 text-center">Data tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-4 mb-2">
      <div className="text-center p-2 rounded-lg bg-zinc-900">
        <h2 className="text-sm font-bold">{motor.brand.name} {motor.name}</h2>
        <p className="text-gray-400 text-xs">{motor.year_model}</p>
      </div>
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
    </div>
  );
}