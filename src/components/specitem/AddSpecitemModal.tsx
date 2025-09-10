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
  DialogDescription,
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
import { createSpecitem } from "@/lib/api/specitem";

interface AddSpecitemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  specGroups: { id: number; name: string; }[];
}

export function AddSpecitemModal({ isOpen, onClose, onSuccess, specGroups }: AddSpecitemModalProps) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [specification_group_id, setSpecificationGroupId] = useState<number | null>(null);
  const specification_group = specGroups.find(g => g.id === specification_group_id) || { id: 0, name: '' };
  const [unit, setUnit] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setDesc("");
    setUnit("");
    setSpecificationGroupId(specGroups.length > 0 ? specGroups[0].id : null);
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
      await createSpecitem({ name, desc, unit, specification_group_id, specification_group });
      resetForm();
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan spesifikasi. Coba lagi.");
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
          <DialogTitle>Tambah Spesifikasi Item Baru</DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>

        <div className="flex-grow overflow-y-auto -mr-6 pr-6">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="specification_group_id" className="text-right">Group</Label>
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nama</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3 bg-gray-800 border-gray-600 focus:ring-red-500" placeholder="Input Spesifikasi Item" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Deskripsi</Label>
              <Input id="description" value={desc} onChange={(e) => setDesc(e.target.value)} className="col-span-3 bg-gray-800 border-gray-600 focus:ring-red-500" placeholder="Input Desc" />
            </div>
            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit" className="text-right">Unit</Label>
              <Input id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} className="col-span-3 bg-gray-800 border-gray-600 focus:ring-red-500" placeholder="Input Unit" />
            </div> */}
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