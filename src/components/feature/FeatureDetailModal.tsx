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
import type { Feature } from "@/types/feature";
import { getFeatureItemById } from "@/lib/api/feature";

interface FeatureDetailModalProps {
  featureId: number | null;
  onClose: () => void;
}

const API_PUBLIC_URL = process.env.NEXT_PUBLIC_API_PUBLIC_URL;

export function FeatureDetailModal({ featureId, onClose }: FeatureDetailModalProps) {
  const [feature, setFeature] = useState<Feature | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!featureId) return;

    const controller = new AbortController();
    const fetchFeatureDetail = async () => {
      setLoading(true);
      setError(null);
      setFeature(null);
      try {
        const data = await getFeatureItemById(featureId, controller.signal);
        setFeature(data);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError("Gagal memuat detail fitur.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeatureDetail();

    return () => {
      controller.abort();
    };
  }, [featureId]);

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-48"><Loader2 className="animate-spin text-red-500" size={32} /></div>;
    }
    if (error) {
      return <p className="text-center text-red-500 h-48">{error}</p>;
    }
    if (!feature) return null;

    return (
      <div className="space-y-4">
        <p className="text-gray-300 text-xs text-center">{feature.desc || "Tidak ada deskripsi."}</p>

        <div className="flex gap-4 justify-around items-start">
            <div className="text-center">
                <h4 className="font-semibold mb-2">Ikon</h4>
                <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-gray-800">
                    <Image
                        src={feature.icon ? `${API_PUBLIC_URL}${feature.icon}` : '/imagenotfound.png'}
                        alt={feature.name + " icon"}
                        fill
                        style={{ objectFit: 'contain' }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
            </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={!!featureId} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:w-auto sm:max-w-md bg-black/98 text-white border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-xl">{feature?.name || "Memuat..."}</DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}