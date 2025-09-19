// app/brand/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import SimpleHeader from "@/components/SimpleHeader";
import { getBrandById } from "@/lib/api/brand";
import type { Brand } from "@/types/brand";
import { Loader2 } from "lucide-react";
import { MotorCard } from "@/components/motor/MotorCard";
import Image from "next/image";
import { InfoBanner } from "@/components/ui/info-banner";

const API_PUBLIC_URL = process.env.NEXT_PUBLIC_API_PUBLIC_URL;

export default function BrandDetailPage() {
  const params = useParams();
  const brandId = Number(params.id);

  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!brandId) return;
    const fetchBrandData = async () => {
      try {
        setLoading(true);
        const data = await getBrandById(brandId);
        setBrand(data);
      } catch (err: any) {
        console.error("Gagal memuat data brand:", err);
        setError("Gagal memuat data brand.");
      } finally {
        setLoading(false);
      }
    };
    fetchBrandData();
  }, [brandId]);

  if (loading) {
    return (
      <>
        <SimpleHeader title="Memuat..." backUrl="/" />
        <div className="flex justify-center items-center h-[80vh]">
          <Loader2 className="animate-spin text-red-500" size={40} />
        </div>
      </>
    );
  }

  if (error || !brand) {
    return (
      <>
        <SimpleHeader title="Error" backUrl="/" />
        <div className="p-4 text-center text-red-500">{error || "Brand tidak ditemukan."}</div>
      </>
    );
  }

  return (
    <>
      <SimpleHeader title="Brand" backUrl="/" />
      
      {/* Hero Section */}
      <div className="relative bg-zinc-900 p-8 text-center border-b border-white/10 min-h-[200px] flex flex-col justify-center items-center">
        {/* Gambar Latar Belakang (jika ada) */}
        {brand.image && (
          <Image
            src={`${API_PUBLIC_URL}${brand.image}`}
            alt={brand.name}
            fill
            priority
            className="object-cover brightness-50"
          />
        )}
        
        {/* Konten Teks dengan z-index agar di atas gambar */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold">{brand.name}</h1>
          {brand.desc && <p className="text-gray-300 mt-1 max-w-2xl mx-auto text-xs">{brand.desc}</p>}
        </div>
      </div>

      {/* Daftar Motor */}
      <div className="p-4 sm:p-6">
        {brand.motors && brand.motors.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {brand.motors.map((motor) => (
              <MotorCard key={motor.id} motor={motor} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8">Belum ada motor di brand ini.</p>
        )}
      </div>
      <InfoBanner/>
    </>
  );
}