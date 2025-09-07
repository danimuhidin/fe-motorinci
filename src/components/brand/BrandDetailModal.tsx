// components/brand/BrandDetailModal.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import type { Brand } from "@/types/brand";
import { getBrandById } from "@/lib/api/brand";

interface BrandDetailModalProps {
  brandId: number | null;
  onClose: () => void;
}

const API_PUBLIC_URL = process.env.NEXT_PUBLIC_API_PUBLIC_URL;

export function BrandDetailModal({ brandId, onClose }: BrandDetailModalProps) {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Hanya jalankan jika ada brandId yang valid
    if (!brandId) return;

    const controller = new AbortController();
    const fetchBrandDetail = async () => {
      setLoading(true);
      setError(null);
      setBrand(null);
      try {
        const data = await getBrandById(brandId, controller.signal);
        setBrand(data);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError("Gagal memuat detail brand.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBrandDetail();

    return () => {
      controller.abort();
    };
  }, [brandId]); // Efek ini akan berjalan setiap kali brandId berubah

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-48"><Loader2 className="animate-spin text-red-500" size={32} /></div>;
    }
    if (error) {
      return <p className="text-center text-red-500 h-48">{error}</p>;
    }
    if (!brand) return null;

    return (
      <div className="space-y-4">
        <p className="text-gray-300">{brand.desc || "Tidak ada deskripsi."}</p>
        
        <div className="flex gap-4 justify-around items-start">
            {/* Tampilan Ikon */}
            <div className="text-center">
                <h4 className="font-semibold mb-2">Ikon</h4>
                <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-gray-800">
                    <Image
                        src={brand.icon ? `${API_PUBLIC_URL}${brand.icon}` : '/imagenotfound.png'}
                        alt={brand.name + " icon"}
                        fill
                        style={{ objectFit: 'contain' }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
            </div>

            {/* Tampilan Gambar */}
            <div className="text-center">
                <h4 className="font-semibold mb-2">Gambar</h4>
                 <div className="relative h-24 w-36 rounded-lg overflow-hidden bg-gray-800">
                    <Image
                        src={brand.image ? `${API_PUBLIC_URL}${brand.image}` : '/imagenotfound.png'}
                        alt={brand.name + " image"}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
            </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={!!brandId} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:w-auto sm:max-w-md bg-black/98 text-white border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl">{brand?.name || "Memuat..."}</DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}