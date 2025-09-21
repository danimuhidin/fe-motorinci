// app/setting/motor/[id]/colors/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Palette, Plus, Trash2 } from "lucide-react";
import SimpleHeader from "@/components/SimpleHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { getColors, addMotorColor, removeMotorColor } from "@/lib/api/color";
import type { MotorColor } from "@/types/motor";
import type { Color } from "@/types/color";

const API_PUBLIC_URL = process.env.NEXT_PUBLIC_API_PUBLIC_URL;

export default function ColorSettingsPage() {
    const params = useParams();
    const motorId = Number(params.id);

    const [currentColors, setCurrentColors] = useState<MotorColor[]>([]);
    const [allColors, setAllColors] = useState<Color[]>([]);

    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // State untuk form tambah
    const [selectedColorId, setSelectedColorId] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [colorToDelete, setColorToDelete] = useState<MotorColor | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [motorData, colorsData] = await Promise.all([
                    getMotorById(motorId),
                    getColors(),
                ]);
                console.log(motorData);
                setCurrentColors(motorData.available_colors || []);
                setAllColors(colorsData || []);
            } catch (error) {
                console.error(error);
                toast.error("Gagal memuat data warna.");
            } finally {
                setLoading(false);
            }
        };
        if (motorId) fetchData();
    }, [motorId]);

    useEffect(() => {
        if (!selectedFile) {
            setPreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(selectedFile);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    const availableColorsToAdd = allColors.filter(
        (color) => !currentColors.some((cc) => cc.color.id === color.id)
    );

    const handleAddColor = async () => {
        if (!selectedColorId) {
            toast.error("Silakan pilih warna terlebih dahulu.");
            return;
        };
        setIsAdding(true);
        try {
            const newColor = await addMotorColor(motorId, Number(selectedColorId), selectedFile || undefined);
            setCurrentColors(prev => [...prev, newColor]);
            toast.success(`Warna "${newColor.color.name}" berhasil ditambahkan.`);
            setSelectedColorId("");
            setSelectedFile(null);
        } catch (error: any) {
            toast.error("Gagal menambah warna.", { description: error.message });
        } finally {
            setIsAdding(false);
        }
    };

    const confirmDeleteColor = async () => {
        if (!colorToDelete) return;
        setDeletingId(colorToDelete.id);
        try {
            await removeMotorColor(colorToDelete.id);
            setCurrentColors(prev => prev.filter(c => c.id !== colorToDelete.id));
            toast.success(`Warna "${colorToDelete.color.name}" berhasil dihapus.`);
        } catch (error: any) {
            toast.error("Gagal menghapus warna.", { description: error.message });
        } finally {
            setDeletingId(null);
            setColorToDelete(null); // Tutup dialog setelah selesai
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-red-500" size={40} /></div>;

    return (
        <>
            <SimpleHeader title="Manajemen Warna" backUrl={`/setting/motor/${motorId}`} />
            <div className="p-4 sm:p-6 space-y-8">
                {/* Form Tambah Warna */}
                <div className="p-4 rounded-lg border border-white/20 bg-zinc-900/50 space-y-3">
                    <h2 className="text-lg font-semibold flex items-center gap-2"><Palette /> Tambah Warna Baru</h2>
                    <Select value={selectedColorId} onValueChange={setSelectedColorId}>
                        <SelectTrigger className="w-full bg-zinc-800"><SelectValue placeholder="Pilih warna dari daftar..." /></SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-white/20 text-white">
                            {availableColorsToAdd.map(color => <SelectItem key={color.id} value={String(color.id)}>{color.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                    <Input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} className="file:text-white bg-zinc-800" />
                    {preview && <Image src={preview} alt="Preview" width={100} height={100} className="rounded-lg object-cover aspect-video" />}
                    <Button onClick={handleAddColor} disabled={!selectedColorId || isAdding} className="w-full bg-red-600 hover:bg-red-700">
                        {isAdding ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus className="h-4 w-4 mr-2" />} Tambahkan
                    </Button>
                </div>

                {/* Daftar Warna Saat Ini */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">Warna Saat Ini ({currentColors.length})</h2>
                    <div className="space-y-3">
                        {currentColors.map(availableColor => (
                            <div key={availableColor.id} className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="h-8 w-8 rounded-full border-2 border-white/20" style={{ backgroundColor: availableColor.color.hex }} />
                                    <div className="relative h-10 w-16 rounded-md bg-zinc-800 overflow-hidden">
                                        <Image src={availableColor.image ? `${API_PUBLIC_URL}${availableColor.image}` : '/imagenotfound.png'} alt={availableColor.color.name} fill className="object-cover" />
                                    </div>
                                    <span>{availableColor.color.name}</span>
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => setColorToDelete(availableColor)} disabled={deletingId === availableColor.id}>
                                    {deletingId === availableColor.id ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 className="h-4 w-4 text-red-500" />}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <AlertDialog open={!!colorToDelete} onOpenChange={() => setColorToDelete(null)}>
                <AlertDialogContent className="w-[95vw] sm:w-full sm:max-w-md bg-black/98 text-white border border-white/20">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Hapus Warna</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus warna **{colorToDelete?.color.name}** dari motor ini?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-row justify-end gap-x-2 pt-2">
                        <AlertDialogCancel disabled={!!deletingId} className="bg-zinc-800 hover:bg-zinc-700">Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeleteColor} disabled={!!deletingId} className="bg-red-600 hover:bg-red-700">
                            {deletingId ? <Loader2 className="animate-spin h-4 w-4" /> : 'Ya, Hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}