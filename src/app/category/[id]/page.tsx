// app/category/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import SimpleHeader from "@/components/SimpleHeader";
import { getCategoryById } from "@/lib/api/category";
import type { Category } from "@/types/category";
import { Loader2 } from "lucide-react";
import { MotorCard } from "@/components/motor/MotorCard";
import { use } from 'react';
import Image from "next/image";

const API_PUBLIC_URL = process.env.NEXT_PUBLIC_API_PUBLIC_URL;

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const categoryId = Number(id);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const data = await getCategoryById(categoryId);
        setCategory(data);
      } catch (err: any) {
        console.error("Gagal memuat data kategori:", err);
        setError("Gagal memuat data kategori.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryData();
  }, [categoryId]);

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

  if (error || !category) {
    return (
      <>
        <SimpleHeader title="Error" backUrl="/" />
        <div className="p-4 text-center text-red-500">{error || "Kategori tidak ditemukan."}</div>
      </>
    );
  }

  return (
    <>
      <SimpleHeader title="Kategori" backUrl="/" />
      
      {/* Hero Section */}
      <div className="relative bg-zinc-900 p-8 text-center border-b border-white/10 min-h-[200px] flex flex-col justify-center items-center">
        {/* Gambar Latar Belakang (jika ada) */}
        {category.image && (
          <Image
            src={`${API_PUBLIC_URL}${category.image}`}
            alt={category.name}
            fill
            priority
            className="object-cover brightness-50" // object-cover seperti background-size: cover
          />
        )}
        
        {/* Konten Teks dengan z-index agar di atas gambar */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold">{category.name}</h1>
          {category.desc && <p className="text-gray-300 mt-2 max-w-2xl mx-auto">{category.desc}</p>}
        </div>
      </div>

      {/* Daftar Motor */}
      <div className="p-4 sm:p-6">
        {category.motors && category.motors.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {category.motors.map((motor) => (
              <MotorCard key={motor.id} motor={motor} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-8">Tidak ada motor di kategori ini.</p>
        )}
      </div>
    </>
  );
}