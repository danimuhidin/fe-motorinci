// app/brand/[id]/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useInView } from 'react-intersection-observer';
import SimpleHeader from "@/components/SimpleHeader";
import Image from "next/image";
import { getMotorsByBrand } from "@/lib/api/brand"; // Perbarui import
import type { BrandMotor } from "@/types/motor";
import type { Motor } from "@/types/motor";
import { Loader2 } from "lucide-react";
import { MotorCard } from "@/components/motor/MotorCard";
import { MotorCardSkeleton } from "@/components/motor/MotorCardSkeleton"; // Impor skeleton card
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { Skeleton } from "@/components/ui/skeleton"; // Impor skeleton

const API_PUBLIC_URL = process.env.NEXT_PUBLIC_API_PUBLIC_URL;

export default function BrandDetailPage() {
  const params = useParams();
  const brandId = Number(params.id);

  const [brand, setBrand] = useState<BrandMotor | null>(null);
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
        const [initialMotorData] = await Promise.all([
          getMotorsByBrand(brandId, 1)
        ]);

        setBrand(initialMotorData.brand);
        setMotors(initialMotorData.data.data);
        setCurrentPage(initialMotorData.data.current_page);
        setHasNextPage(initialMotorData.data.current_page < initialMotorData.data.last_page);
      } catch (err) {
        console.error("Gagal memuat data awal:", err);
      } finally {
        setLoading(false);
      }
    };
    if (brandId) fetchInitialData();
  }, [brandId]);
  
  const handleLoadMore = useCallback(async () => {
    if (!hasNextPage || loadingMore) return;

    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const newMotorData = await getMotorsByBrand(brandId, nextPage);
      setMotors(prevMotors => [...prevMotors, ...newMotorData.data.data]);
      setCurrentPage(newMotorData.data.current_page);
      setHasNextPage(newMotorData.data.current_page < newMotorData.data.last_page);
    } catch (error) {
      console.error("Gagal memuat lebih banyak:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [brandId, currentPage, hasNextPage, loadingMore]);

  useEffect(() => {
    if (inView && !loading) {
      handleLoadMore();
    }
  }, [inView, loading, handleLoadMore]);

  if (!loading && !brand) { // Tampilkan error hanya jika loading selesai dan brand tidak ada
    return (
      <>
        <SimpleHeader title="Error" backUrl="/" />
        <div className="p-4 text-center text-red-500">Brand tidak ditemukan.</div>
      </>
    );
  }

  return (
    <div className="relative">
      <GlobalSearch />
      <SimpleHeader title={loading ? "Memuat..." : "Brand"} backUrl="/" />

      <div className="relative bg-zinc-900 p-8 text-center border-b border-white/10 min-h-[200px] flex flex-col justify-center items-center">
        {loading ? (
            <div className="relative z-10 w-full">
                <Skeleton className="h-10 w-3/4 max-w-sm mx-auto" />
                <Skeleton className="h-4 w-1/2 max-w-xs mx-auto mt-4" />
            </div>
        ) : brand?.image && (
            <Image src={`${API_PUBLIC_URL}${brand.image}`} alt={brand.name} fill priority className="object-cover brightness-50" />
        )}
        {!loading && brand && (
            <div className="relative z-10">
                <h1 className="text-4xl font-bold">{brand.name}</h1>
                {brand.desc && <p className="text-gray-300 mt-2 max-w-2xl mx-auto text-xs">{brand.desc}</p>}
            </div>
        )}
      </div>

      <div className="p-4 sm:p-6 mb-16">
        <div className="grid grid-cols-2 gap-4">
          {loading ? (
            Array(8).fill(0).map((_, index) => <MotorCardSkeleton key={index} />)
          ) : (
            motors.map((motor) => (
              <MotorCard key={motor.id} motor={motor} />
            ))
          )}
        </div>

        <div ref={ref} className="flex justify-center py-6">
          {loadingMore && hasNextPage && <Loader2 className="animate-spin text-red-500" />}
        </div>
      </div>
    </div>
  );
}