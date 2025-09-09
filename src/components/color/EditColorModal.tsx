"use client";

import { useState, useEffect } from "react";
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
import { getColorById, updateColor } from "@/lib/api/color";
import type { Color } from "@/types/color";

interface EditColorModalProps {
  colorId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditColorModal({ colorId, onClose, onSuccess }: EditColorModalProps) {
  const [name, setName] = useState("");
  const [hex, setHex] = useState("");

  const [initialColor, setInitialColor] = useState<Color | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!colorId) return;

    const fetchColor = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getColorById(colorId);
        setInitialColor(data);
        setName(data.name);
        setHex(data.hex || "");
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data warna.");
      } finally {
        setLoading(false);
      }
    };
    fetchColor();
  }, [colorId]);

  const handleUpdate = async () => {
    if (!name) {
      setError("Nama wajib diisi.");
      return;
    }
    if (!colorId) return;

    setIsSaving(true);
    setError(null);

    try {
      await updateColor(colorId, {
        name,
        hex,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Gagal memperbarui warna.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={!!colorId} onOpenChange={handleClose}>
      <DialogContent className="
        w-[95vw] sm:w-auto sm:max-w-md bg-black/98 text-white border border-white/20 
        flex flex-col max-h-[90vh] 
        top-[5%] translate-y-0 sm:top-1/2 sm:-translate-y-1/2 rounded-lg"
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Edit Color: {initialColor?.name || "..."}</DialogTitle>
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
                  <Label htmlFor="hex-edit" className="text-right">Kode Warna</Label>
                  <Input id="hex-edit" value={hex} onChange={(e) => setHex(e.target.value)} className="col-span-3 bg-gray-800" />
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