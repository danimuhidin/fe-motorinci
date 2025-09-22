// app/category/[id]/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useInView } from 'react-intersection-observer';
import SimpleHeader from "@/components/SimpleHeader";
import Image from "next/image";
import { getCategoryById, getMotorsByCategory } from "@/lib/api/category";
import type { Category } from "@/types/category";
import type { Motor } from "@/types/motor";
import { Loader2 } from "lucide-react";
import { MotorCard } from "@/components/motor/MotorCard";
import { GlobalSearch } from "@/components/search/GlobalSearch";

const API_PUBLIC_URL = process.env.NEXT_PUBLIC_API_PUBLIC_URL;

export default function CategoryDetailPage() {
  const params = useParams();
  const categoryId = Number(params.id);

  const [category, setCategory] = useState<Category | null>(null);
  const [motors, setMotors] = useState<Motor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [categoryData, initialMotorData] = await Promise.all([
            getCategoryById(categoryId),
            getMotorsByCategory(categoryId, 1)
        ]);
        
        setCategory(categoryData);
        setMotors(initialMotorData.data);
        setCurrentPage(initialMotorData.current_page);
        setHasNextPage(initialMotorData.current_page < initialMotorData.last_page);
      } catch (err) {
        console.error("Gagal memuat data awal:", err);
      } finally {
        setLoading(false);
      }
    };
    if (categoryId) fetchInitialData();
  }, [categoryId]);
  
  const handleLoadMore = useCallback(async () => {
    if (!hasNextPage || loadingMore) return;

    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const newMotorData = await getMotorsByCategory(categoryId, nextPage);
      setMotors(prevMotors => [...prevMotors, ...newMotorData.data]);
      setCurrentPage(newMotorData.current_page);
      setHasNextPage(newMotorData.current_page < newMotorData.last_page);
    } catch (error) {
        console.error("Gagal memuat lebih banyak:", error);
    } finally {
        setLoadingMore(false);
    }
  }, [categoryId, currentPage, hasNextPage, loadingMore]);

  useEffect(() => {
    if (inView && !loading) {
      handleLoadMore();
    }
  }, [inView, loading, handleLoadMore]);

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

  if (!category) {
    return (
      <>
        <SimpleHeader title="Error" backUrl="/" />
        <div className="p-4 text-center text-red-500">Kategori tidak ditemukan.</div>
      </>
    );
  }

  return (
    <>
    <GlobalSearch />
      <SimpleHeader title="Kategori" backUrl="/" />
      
      <div className="relative bg-zinc-900 p-8 text-center border-b border-white/10 min-h-[200px] flex flex-col justify-center items-center">
        {category.image && ( <Image src={`${API_PUBLIC_URL}${category.image}`} alt={category.name} fill priority className="object-cover brightness-50" /> )}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold">{category.name}</h1>
          {category.desc && <p className="text-gray-300 mt-2 max-w-2xl mx-auto text-xs">{category.desc}</p>}
        </div>
      </div>

      <div className="p-4 sm:p-6 mb-15">
        {motors.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {motors.map((motor) => (
              <MotorCard key={motor.id} motor={motor} />
            ))}
          </div>
        ) : (
           <p className="text-center text-gray-500 mt-8">Tidak ada motor di kategori ini.</p>
        )}
        
        <div ref={ref} className="flex justify-center py-6">
          {hasNextPage && <Loader2 className="animate-spin text-red-500 mb-20" />}
        </div>
      </div>
    </>
  );
}