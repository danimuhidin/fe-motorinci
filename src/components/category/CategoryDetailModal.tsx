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
import type { Category } from "@/types/category";
import { getCategoryById } from "@/lib/api/category";

interface CategoryDetailModalProps {
  categoryId: number | null;
  onClose: () => void;
}

const API_PUBLIC_URL = process.env.NEXT_PUBLIC_API_PUBLIC_URL;

export function CategoryDetailModal({ categoryId, onClose }: CategoryDetailModalProps) {
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;

    const controller = new AbortController();
    const fetchCategoryDetail = async () => {
      setLoading(true);
      setError(null);
      setCategory(null);
      try {
        const data = await getCategoryById(categoryId, controller.signal);
        setCategory(data);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError("Gagal memuat detail kategori.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDetail();

    return () => {
      controller.abort();
    };
  }, [categoryId]);

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-48"><Loader2 className="animate-spin text-red-500" size={32} /></div>;
    }
    if (error) {
      return <p className="text-center text-red-500 h-48">{error}</p>;
    }
    if (!category) return null;

    return (
      <div className="space-y-4">
        <p className="text-gray-300">{category.desc || "Tidak ada deskripsi."}</p>
        
        <div className="flex gap-4 justify-around items-start">
            <div className="text-center">
                <h4 className="font-semibold mb-2">Gambar</h4>
                 <div className="relative h-24 w-36 rounded-lg overflow-hidden bg-gray-800">
                    <Image
                        src={category.image ? `${API_PUBLIC_URL}${category.image}` : '/imagenotfound.png'}
                        alt={category.name + " image"}
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
    <Dialog open={!!categoryId} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:w-auto sm:max-w-md bg-black/98 text-white border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl">{category?.name || "Memuat..."}</DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}