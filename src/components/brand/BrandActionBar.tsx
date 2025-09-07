// components/brand/BrandActionBar.tsx
"use client";

import { X, Trash2, FilePenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface BrandActionBarProps {
  selectedCount: number;
  totalCount: number;
  onCancel: () => void;
  onSelectAll: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function BrandActionBar({
  selectedCount,
  totalCount,
  onCancel,
  onSelectAll,
  onEdit,
  onDelete,
}: BrandActionBarProps) {

  const isEditDisabled = selectedCount !== 1;
  const isDeleteDisabled = selectedCount === 0;

  return (
    <div className="sticky top-0 z-10 flex h-12 items-center justify-between bg-zinc-900 px-4 py-2 border-b border-white/20 animate-fade-in">
      {/* Sisi Kiri: Batal, Pilih Semua, dan Jumlah */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Checkbox
            id="selectAll"
            checked={selectedCount > 0 && selectedCount === totalCount}
            // indeterminate={selectedCount > 0 && selectedCount < totalCount}
            onCheckedChange={onSelectAll}
            className="border-white"
          />
          <label htmlFor="selectAll" className="text-lg font-semibold">
            {selectedCount} dipilih
          </label>
        </div>
      </div>

      {/* Sisi Kanan: Aksi Edit dan Hapus */}
      <div className="flex items-center gap-2">
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={onEdit}
            disabled={isEditDisabled}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FilePenLine className="h-5 w-5" />
        </Button>
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={onDelete}
            disabled={isDeleteDisabled}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Trash2 className="h-5 w-5 text-red-500" />
        </Button>
      </div>
    </div>
  );
}