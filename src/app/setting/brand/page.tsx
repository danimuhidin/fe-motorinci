// app/setting/brand/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Loader2 } from "lucide-react";
import SimpleHeader from "@/components/SimpleHeader";
import type { Brand } from "@/types/brand";
import { Button } from "@/components/ui/button";
import { AddBrandModal } from "@/components/brand/AddBrandModal";
import { getBrands } from "@/lib/api/brand";

export default function SettingBrandPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const refreshBrands = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBrands(signal);
      setBrands(data);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Gagal memuat data.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    refreshBrands(controller.signal);
    return () => {
      controller.abort();
    };
  }, [refreshBrands]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin text-red-500" size={32} />
        </div>
      );
    }
    if (error) {
      return <p className="text-center text-red-500">Error: {error}</p>;
    }
    if (brands.length === 0) {
      return <p className="text-center text-gray-400">Tidak ada data brand.</p>;
    }
    return (
      <ul className="divide-y divide-white/20">
        {brands.map((brand) => (
          <li key={brand.id} className="py-4">
            <h3 className="font-semibold text-lg">{brand.name}</h3>
            <p className="text-gray-400 text-sm mt-1">{brand.desc}</p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <SimpleHeader title="Brand" backUrl="/setting" /> 
      <div className="pt-4 pb-24 px-4">
        <div className="mb-5">
          {renderContent()}
        </div>
      </div>
      
      <Button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-20 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center right-4 md:right-[calc(50%-12rem)]"
      >
        <Plus size={28} />
      </Button>
      
      <AddBrandModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={refreshBrands}
      />
    </>
  );
}