// components/brand/AddBrandModal.tsx
"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBrand } from "@/lib/api/brand";

interface AddBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void; // Fungsi untuk refresh data di halaman utama
}

export function AddBrandModal({ isOpen, onClose, onSuccess }: AddBrandModalProps) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [icon, setIcon] = useState<File | undefined>();
  const [image, setImage] = useState<File | undefined>();
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setDesc("");
    setIcon(undefined);
    setImage(undefined);
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
      await createBrand({ name, desc, icon, image });
      resetForm();
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan brand. Coba lagi.");
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
      <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Tambah Brand Baru</DialogTitle>
          <DialogDescription>
            Isi detail untuk brand baru. Klik simpan jika sudah selesai.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Nama</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3 bg-gray-800 border-gray-600 focus:ring-red-500" placeholder="Contoh: Honda"/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Deskripsi</Label>
            <Input id="description" value={desc} onChange={(e) => setDesc(e.target.value)} className="col-span-3 bg-gray-800 border-gray-600 focus:ring-red-500" placeholder="Produsen motor terkemuka..."/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="icon" className="text-right">Ikon</Label>
            <Input id="icon" type="file" onChange={(e) => setIcon(e.target.files?.[0])} className="col-span-3 file:text-white bg-gray-800 border-gray-600" accept="image/*"/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">Gambar</Label>
            <Input id="image" type="file" onChange={(e) => setImage(e.target.files?.[0])} className="col-span-3 file:text-white bg-gray-800 border-gray-600" accept="image/*"/>
          </div>
        </div>
        
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <DialogFooter>
          <Button 
            type="button" 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-red-600 hover:bg-red-700 w-24"
          >
            {isSaving ? <Loader2 className="animate-spin" /> : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}