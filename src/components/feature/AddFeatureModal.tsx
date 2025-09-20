"use client";

import { useState } from "react";
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
import { createFeatureItem } from "@/lib/api/feature";

interface AddFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddFeatureModal({ isOpen, onClose, onSuccess }: AddFeatureModalProps) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [icon, setIcon] = useState<File | undefined>();

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setDesc("");
    setIcon(undefined);
    setError(null);
  };

  const handleSave = async () => {
    if (!name) {
      setError("Nama wajib diisi.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await createFeatureItem({ name, desc, icon });
      resetForm();
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan fitur. Coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    if (isSaving) return;
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="
        w-[95vw] sm:w-auto sm:max-w-md bg-black/98 text-white border border-white/20 
        flex flex-col max-h-[90vh] 
        top-[5%] translate-y-0 sm:top-1/2 sm:-translate-y-1/2 rounded-lg"
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Tambah Fitur Baru</DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto -mr-6 pr-6">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nama</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3 bg-gray-800 border-gray-600 focus:ring-red-500" placeholder="Input Fitur" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Deskripsi</Label>
              <Input id="description" value={desc} onChange={(e) => setDesc(e.target.value)} className="col-span-3 bg-gray-800 border-gray-600 focus:ring-red-500" placeholder="Input Desc" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-right">Ikon</Label>
              <Input id="icon" type="file" onChange={(e) => setIcon(e.target.files?.[0])} className="col-span-3 file:text-white bg-gray-800 border-gray-600" accept="image/*" />
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-500 text-center flex-shrink-0">{error}</p>}

        <DialogFooter className="flex-shrink-0">
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="bg-red-600 hover:bg-red-700 w-full"
          >
            {isSaving ? <Loader2 className="animate-spin" /> : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}