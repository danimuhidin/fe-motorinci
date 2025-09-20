"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getFeatureItemById, updateFeatureItem } from "@/lib/api/feature";
import type { Feature } from "@/types/feature";

interface EditFeatureModalProps {
  featureId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

const API_PUBLIC_URL = process.env.NEXT_PUBLIC_API_PUBLIC_URL;

export function EditFeatureModal({ featureId, onClose, onSuccess }: EditFeatureModalProps) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [newIcon, setNewIcon] = useState<File | undefined>();

  const [initialFeature, setInitialFeature] = useState<Feature | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!featureId) return;

    const fetchFeature = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getFeatureItemById(featureId);
        setInitialFeature(data);
        setName(data.name);
        setDesc(data.desc || "");
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data fitur.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeature();
  }, [featureId]);

  const handleUpdate = async () => {
    if (!name) {
      setError("Nama wajib diisi.");
      return;
    }
    if (!featureId) return;

    setIsSaving(true);
    setError(null);

    try {
      await updateFeatureItem(featureId, {
        name,
        desc,
        icon: newIcon,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Gagal memperbarui fitur.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setNewIcon(undefined);
    onClose();
  };

  return (
    <Dialog open={!!featureId} onOpenChange={handleClose}>
      <DialogContent className="
        w-[95vw] sm:w-auto sm:max-w-md bg-black/98 text-white border border-white/20 
        flex flex-col max-h-[90vh] 
        top-[5%] translate-y-0 sm:top-1/2 sm:-translate-y-1/2 rounded-lg"
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Edit Fitur: {initialFeature?.name || "..."}</DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-red-500" /></div>
        ) : (
          <>
            <div className="flex-grow overflow-y-auto -mr-6 pr-6">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name-edit" className="text-right">Nama</Label>
                  <Input id="name-edit" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3 bg-gray-800" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="desc-edit" className="text-right">Deskripsi</Label>
                  <Input id="desc-edit" value={desc} onChange={(e) => setDesc(e.target.value)} className="col-span-3 bg-gray-800" />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="icon-edit" className="text-right pt-2">Ikon Baru</Label>
                  <div className="col-span-3">
                    <div className="w-16 h-16 relative bg-gray-700 rounded-md mb-2">
                      <Image src={initialFeature?.icon ? `${API_PUBLIC_URL}${initialFeature.icon}` : '/imagenotfound.png'} alt="Current Icon" fill style={{ objectFit: 'contain' }} />
                    </div>
                    <Input id="icon-edit" type="file" onChange={(e) => setNewIcon(e.target.files?.[0])} className="file:text-white bg-gray-800" accept="image/*" />
                  </div>
                </div>
              </div>
            </div>
            {error && <p className="text-sm text-red-500 text-center flex-shrink-0">{error}</p>}
            <DialogFooter className="flex-shrink-0">
              <Button type="button" onClick={handleUpdate} disabled={isSaving} className="bg-red-600 hover:bg-red-700 w-full">{isSaving ? <Loader2 className="animate-spin" /> : "Simpan Perubahan"}</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}