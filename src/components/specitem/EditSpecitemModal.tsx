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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSpecitemById, updateSpecitem } from "@/lib/api/specitem";
import type { Specitem } from "@/types/specitem";

interface EditSpecitemModalProps {
  specitemId: number | null;
  onClose: () => void;
  onSuccess: () => void;
  specGroups: { id: number; name: string; }[];
}

export function EditSpecitemModal({ specitemId, onClose, onSuccess, specGroups }: EditSpecitemModalProps) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [unit, setUnit] = useState("");
  const [specification_group_id, setSpecificationGroupId] = useState<number | null>(null);
  const specification_group = specGroups.find(g => g.id === specification_group_id) || { id: 0, name: '' };

  const [initialSpecitem, setInitialSpecitem] = useState<Specitem | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!specitemId) return;

    const fetchSpecitem = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSpecitemById(specitemId);
        setInitialSpecitem(data);
        setName(data.name);
        setDesc(data.desc || "");
        setUnit(data.unit);
        setSpecificationGroupId(data.specification_group_id);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat data spesifikasi.");
      } finally {
        setLoading(false);
      }
    };
    fetchSpecitem();
  }, [specitemId]);

  const handleUpdate = async () => {
    if (!name) {
      setError("Nama wajib diisi.");
      return;
    }
    if (!specitemId) return;

    setIsSaving(true);
    setError(null);

    try {
      await updateSpecitem(specitemId, {
        name,
        desc,
        unit,
        specification_group_id,
        specification_group
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Gagal memperbarui spesifikasi.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={!!specitemId} onOpenChange={handleClose}>
      <DialogContent className="
        w-[95vw] sm:w-auto sm:max-w-md bg-black/98 text-white border border-white/20 
        flex flex-col max-h-[90vh] 
        top-[5%] translate-y-0 sm:top-1/2 sm:-translate-y-1/2 rounded-lg"
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Edit Spesifikasi: {initialSpecitem?.name || "..."}</DialogTitle>
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="specification_group_id-edit" className="text-right">Group ID</Label>
                  <Select
                    value={specification_group_id ? String(specification_group_id) : ""}
                    onValueChange={(value) => setSpecificationGroupId(value ? Number(value) : null)}
                  >
                    <SelectTrigger className="col-span-3 w-full bg-gray-800 border-gray-600 focus:ring-red-500">
                      <SelectValue placeholder="Pilih grup spesifikasi" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 text-white border-gray-600">
                      {specGroups.map((group) => (
                        <SelectItem
                          key={group.id}
                          value={String(group.id)}
                          className="focus:bg-gray-700 focus:text-white"
                        >
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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