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
import type { Specitem } from "@/types/specitem";
import { getSpecitemById } from "@/lib/api/specitem";

interface SpecitemDetailModalProps {
  specitemId: number | null;
  onClose: () => void;
}

export function SpecitemDetailModal({ specitemId, onClose }: SpecitemDetailModalProps) {
  const [specitem, setSpecitem] = useState<Specitem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!specitemId) return;

    const controller = new AbortController();
    const fetchSpecitemDetail = async () => {
      setLoading(true);
      setError(null);
      setSpecitem(null);
      try {
        const data = await getSpecitemById(specitemId, controller.signal);
        setSpecitem(data);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError("Gagal memuat detail spesifikasi.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSpecitemDetail();

    return () => {
      controller.abort();
    };
  }, [specitemId]);

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-48"><Loader2 className="animate-spin text-red-500" size={32} /></div>;
    }
    if (error) {
      return <p className="text-center text-red-500 h-48">{error}</p>;
    }
    if (!specitem) return null;

    return (
      <div className="space-y-4">
        <p className="text-gray-300">{specitem.desc || "Tidak ada deskripsi."}</p>
        <p className="text-sm text-gray-400">Unit: {specitem.unit || "N/A"}</p>
        <p className="text-sm text-gray-400">ID Grup Spesifikasi: {specitem.specification_group_id !== null ? specitem.specification_group_id : "N/A"}</p>
      </div>
    );
  };

  return (
    <Dialog open={!!specitemId} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:w-auto sm:max-w-md bg-black/98 text-white border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl">{specitem?.name || "Memuat..."}</DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}