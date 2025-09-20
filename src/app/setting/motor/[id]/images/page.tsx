// app/setting/motor/[id]/images/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Trash2, Upload } from "lucide-react";
import SimpleHeader from "@/components/SimpleHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getMotorById } from "@/lib/api/motor";
import { uploadMotorImage, deleteMotorImage } from "@/lib/api/motor";
import type { MotorImage } from "@/types/motor";

const API_PUBLIC_URL = process.env.NEXT_PUBLIC_API_PUBLIC_URL;

export default function ImageSettingsPage() {
  const params = useParams();
  const motorId = Number(params.id);

  const [images, setImages] = useState<MotorImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Perubahan state untuk hapus
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [imageToDelete, setImageToDelete] = useState<MotorImage | null>(null);

  
  const refreshImages = async () => {
    try {
      const data = await getMotorById(motorId);
      setImages(data.images || []);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat daftar gambar.");
    }
  };

  useEffect(() => {
    if (!motorId) return;
    setLoading(true);
    refreshImages().finally(() => setLoading(false));
  }, [motorId]);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    // Cleanup
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);
    try {
      const newImage = await uploadMotorImage(motorId, formData);
      setImages(prev => [...prev, newImage]);
      toast.success("Gambar berhasil diunggah.");
      setSelectedFile(null);
    } catch (error: any) {
      toast.error("Gagal mengunggah gambar.", { description: error.message });
    } finally {
      setUploading(false);
    }
  };


  // Fungsi yang dipanggil saat tombol hapus di dialog dikonfirmasi
  const confirmDelete = async () => {
    if (!imageToDelete) return;

    setDeletingId(imageToDelete.id);
    try {
      await deleteMotorImage(imageToDelete.id);
      setImages(prev => prev.filter(img => img.id !== imageToDelete.id));
      toast.success("Gambar berhasil dihapus.");
    } catch (error: any) {
      toast.error("Gagal menghapus gambar.", { description: error.message });
    } finally {
      setDeletingId(null);
      setImageToDelete(null); // Tutup dialog
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-red-500" size={40} /></div>;

  return (
    <>
      <SimpleHeader title="Manajemen Gambar" backUrl={`/setting/motor/${motorId}`} />
      <div className="p-4 sm:p-6 space-y-8">
        {/* Form Upload (tidak berubah) */}
        <div className="p-4 rounded-lg border border-white/20 bg-zinc-900/50 space-y-4">
          <h2 className="text-lg font-semibold">Unggah Gambar Baru</h2>
          <Input type="file" accept="image/*" onChange={handleFileChange} className="file:text-white bg-zinc-800" />
          {preview && <Image src={preview} alt="Preview" width={150} height={150} className="rounded-lg object-cover aspect-video" />}
          <Button onClick={handleUpload} disabled={!selectedFile || uploading} className="w-full bg-red-600 hover:bg-red-700">
            {uploading ? <Loader2 className="animate-spin" /> : <><Upload className="mr-2 h-4 w-4" /> Unggah</>}
          </Button>
        </div>

        {/* Galeri Gambar */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Galeri Saat Ini ({images.length})</h2>
          {images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map(image => (
                <div key={image.id} className="relative group aspect-video">
                  <Image src={`${API_PUBLIC_URL}${image.image}`} alt="Gambar Motor" fill sizes="(max-width: 640px) 50vw, 33vw" className="rounded-lg object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {/* Perubahan: onClick sekarang membuka dialog, bukan langsung hapus */}
                    <Button variant="destructive" size="icon" onClick={() => setImageToDelete(image)} disabled={deletingId === image.id}>
                      {deletingId === image.id ? <Loader2 className="animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Belum ada gambar di galeri.</p>
          )}
        </div>
      </div>

      {/* Dialog Konfirmasi Hapus */}
      <AlertDialog open={!!imageToDelete} onOpenChange={() => setImageToDelete(null)}>
        <AlertDialogContent className="w-[95vw] sm:w-full sm:max-w-md bg-black/98 text-white border border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus Gambar</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus gambar ini? Aksi ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {/* Tambahkan preview gambar yang akan dihapus untuk UX yang lebih baik */}
          {imageToDelete && (
            <div className="relative w-full aspect-video rounded-md overflow-hidden my-4 bg-zinc-800">
              <Image src={`${API_PUBLIC_URL}${imageToDelete.image}`} alt="Preview Gambar" fill className="object-cover" />
            </div>
          )}
          <AlertDialogFooter className="flex-row justify-end gap-x-2 pt-2">
            <AlertDialogCancel disabled={!!deletingId} className="bg-zinc-700 hover:bg-zinc-800">
              Batal
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={!!deletingId} className="bg-red-600 hover:bg-red-700">
              {deletingId ? <Loader2 className="animate-spin h-4 w-4" /> : 'Ya, Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}