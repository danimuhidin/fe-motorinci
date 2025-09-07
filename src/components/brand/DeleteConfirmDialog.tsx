// components/brand/DeleteConfirmDialog.tsx
"use client";

import { Loader2 } from "lucide-react";
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

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedCount: number;
  isDeleting: boolean;
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  isDeleting,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="w-[95vw] sm:w-auto sm:max-w-md bg-black/98 text-white border border-white/20">
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            Anda akan menghapus {selectedCount} brand yang dipilih. Aksi ini
            tidak dapat dibatalkan dan data akan hilang secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting} className="flex-1 sm:flex-none bg-white text-black hover:bg-gray-200">Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 flex-1 sm:flex-none sm:w-36"
          >
            {isDeleting ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Ya, Hapus Permanen"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}