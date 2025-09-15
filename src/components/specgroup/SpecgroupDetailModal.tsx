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
import type { Specgroup } from "@/types/specgroup";
import { getSpecgroupById } from "@/lib/api/specgroup";

interface SpecgroupDetailModalProps {
  specgroupId: number | null;
  onClose: () => void;
}

export function SpecgroupDetailModal({ specgroupId, onClose }: SpecgroupDetailModalProps) {
  const [specgroup, setSpecgroup] = useState<Specgroup | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!specgroupId) return;

    const controller = new AbortController();
    const fetchSpecgroupDetail = async () => {
      setLoading(true);
      setError(null);
      setSpecgroup(null);
      try {
        const data = await getSpecgroupById(specgroupId, controller.signal);
        setSpecgroup(data);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError("Gagal memuat detail spesifikasi.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSpecgroupDetail();

    return () => {
      controller.abort();
    };
  }, [specgroupId]);

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-48"><Loader2 className="animate-spin text-red-500" size={32} /></div>;
    }
    if (error) {
      return <p className="text-center text-red-500 h-48">{error}</p>;
    }
    if (!specgroup) return null;

    return (
      <div className="space-y-4">
      </div>
    );
  };

  return (
    <Dialog open={!!specgroupId} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:w-auto sm:max-w-md bg-black/98 text-white border border-white/20">
        <DialogHeader>
          <DialogTitle className="text-xl">{specgroup?.name || "Memuat..."}</DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}