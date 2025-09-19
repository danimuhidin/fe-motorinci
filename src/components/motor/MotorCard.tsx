// components/motor/MotorCard.tsx
import type { Motor } from "@/types/motor";
import Image from "next/image";
import Link from "next/link";

const API_PUBLIC_URL = process.env.NEXT_PUBLIC_API_PUBLIC_URL;

interface MotorCardProps {
  motor: Motor;
}

export function MotorCard({ motor }: MotorCardProps) {
  // Ambil gambar pertama dari array, atau null jika tidak ada
  const mainImage = motor.images && motor.images.length > 0 ? motor.images[0].image_url : null;

  return (
    <Link href={`/motor/${motor.id}`}>
      <div className="rounded-lg overflow-hidden bg-zinc-900 border border-transparent hover:border-red-500 transition-all duration-300 group">
        {/* Card Body: Gambar */}
        <div className="relative aspect-video w-full bg-zinc-800">
          <Image
            src={mainImage ? `${API_PUBLIC_URL}${mainImage}` : "/imagenotfound.png"}
            alt={motor.name}
            fill
            sizes="(max-width: 640px) 50vw, 33vw"
            style={{ objectFit: mainImage ? "cover" : "contain" }}
            className="transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        {/* Card Footer: Detail */}
        <div className="p-2">
          <h3 className="font-bold text-sm truncate">{motor.brand.name} {motor.name}</h3>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>{motor.year_model}</span>
            <span>{motor.engine_cc} cc</span>
          </div>
        </div>
      </div>
    </Link>
  );
}