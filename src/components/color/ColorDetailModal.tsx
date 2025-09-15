"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import type { Color } from "@/types/color";
import { getColorById } from "@/lib/api/color";

interface ColorDetailModalProps {
  colorId: number | null;
  onClose: () => void;
}

export function ColorDetailModal({ colorId, onClose }: ColorDetailModalProps) {
  const [color, setColor] = useState<Color | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!colorId) return;

    const controller = new AbortController();
    const fetchColorDetail = async () => {
      setLoading(true);
      setError(null);
      setColor(null);
      try {
        const data = await getColorById(colorId, controller.signal);
        setColor(data);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError("Gagal memuat detail warna.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchColorDetail();

    return () => {
      controller.abort();
    };
  }, [colorId]);

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-48"><Loader2 className="animate-spin text-red-500" size={32} /></div>;
    }
    if (error) {
      return <p className="text-center text-red-500 h-48">{error}</p>;
    }
    if (!color) return null;

    return (
      <div className="space-y-4">
        <p className="text-gray-300 text-xs text-center">{color.hex || "Tidak ada deskripsi."}</p>
      </div>
    );
  };

  return (
    <Dialog open={!!colorId} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:w-auto sm:max-w-md bg-black/98 text-white border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-xl">{color?.name || "Memuat..."}</DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}