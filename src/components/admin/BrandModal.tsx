'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { NewBrandData } from '@/lib/api/brands';

interface BrandModalContentProps {
  onSave: (data: NewBrandData) => Promise<void>;
  closeDialog: () => void; // Fungsi untuk menutup dialog dari parent
}

export default function BrandModalContent({ onSave, closeDialog }: BrandModalContentProps) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [icon, setIcon] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave({ name, desc, icon, image });
      // Setelah berhasil, panggil fungsi untuk menutup dialog
      closeDialog(); 
    } catch (error) {
      console.error("Gagal menyimpan dari dalam modal:", error);
      // Jika gagal, jangan tutup dialog
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Tambah Brand Baru</DialogTitle>
        <DialogDescription>
          Isi detail brand di bawah ini. Klik simpan jika sudah selesai.
        </DialogDescription>
      </DialogHeader>

      {/* Form Input */}
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">Nama</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="desc" className="text-right">Deskripsi</Label>
          <Textarea id="desc" value={desc} onChange={(e) => setDesc(e.target.value)} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="icon" className="text-right">Ikon</Label>
          <Input id="icon" placeholder="/icons/brand.svg" value={icon} onChange={(e) => setIcon(e.target.value)} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="image" className="text-right">Gambar</Label>
          <Input id="image" placeholder="/images/brand.jpg" value={image} onChange={(e) => setImage(e.target.value)} className="col-span-3" />
        </div>
      </div>

      <DialogFooter>
        {/* Tombol Cancel sekarang ditangani oleh 'DialogClose' atau 'onClose' dari parent */}
        {/* Tombol Save memanggil handler kita */}
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}