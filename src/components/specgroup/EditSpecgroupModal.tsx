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
import { getSpecgroupById, updateSpecgroup } from "@/lib/api/specgroup";
import type { Specgroup } from "@/types/specgroup";

interface EditSpecgroupModalProps {
  specgroupId: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditSpecgroupModal({ specgroupId, onClose, onSuccess }: EditSpecgroupModalProps) {
  const [name, setName] = useState("");

  const [initialSpecgroup, setInitialSpecgroup] = useState<Specgroup | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!specgroupId) return;

    const fetchSpecgroup = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSpecgroupById(specgroupId);
        setInitialSpecgroup(data);
        setName(data.name);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data specgroup.");
      } finally {
        setLoading(false);
      }
    };
    fetchSpecgroup();
  }, [specgroupId]);

  const handleUpdate = async () => {
    if (!name) {
      setError("Nama wajib diisi.");
      return;
    }
    if (!specgroupId) return;

    setIsSaving(true);
    setError(null);

    try {
      await updateSpecgroup(specgroupId, {
        name,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Gagal memperbarui specgroup.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={!!specgroupId} onOpenChange={handleClose}>
      <DialogContent className="
        w-[95vw] sm:w-auto sm:max-w-md bg-black/98 text-white border border-white/20 
        flex flex-col max-h-[90vh] 
        top-[5%] translate-y-0 sm:top-1/2 sm:-translate-y-1/2 rounded-lg"
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Edit Specgroup: {initialSpecgroup?.name || "..."}</DialogTitle>
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