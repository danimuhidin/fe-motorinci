// components/home/SearchModal.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Search as SearchIcon } from "lucide-react";
import { searchMotors } from "@/lib/api/motor";
import type { Motor } from "@/types/motor";
import { useDebounce } from "@/types/useDebounce";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Motor[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Debounce search

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedSearchTerm) {
        setSearchResults([]);
        return;
      }
      setLoading(true);
      try {
        const data = await searchMotors(debouncedSearchTerm);
        setSearchResults(data);
      } catch (error) {
        console.error("Gagal mencari motor:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [debouncedSearchTerm]);

  const handleSelectMotor = (motorId: number) => {
    router.push(`/motor/${motorId}`); // Arahkan ke halaman detail motor
    onClose();
    setSearchTerm(""); // Reset search term
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-white/20 text-white p-0">
        <DialogHeader className="p-4 border-b border-white/10">
          <DialogTitle>Cari Motor</DialogTitle>
          <DialogDescription className="text-gray-400">
            Ketik nama brand atau model motor yang Anda cari.
          </DialogDescription>
        </DialogHeader>
        <div className="relative p-4">
          <SearchIcon className="absolute left-7 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Cari motor..."
            className="pl-10 pr-4 bg-zinc-800 border-white/10 focus:ring-red-500 focus:ring-offset-0 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {loading && (
            <Loader2 className="animate-spin absolute right-7 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
          )}
        </div>
        <div className="max-h-[300px] overflow-y-auto px-4 pb-4">
          {searchResults.length > 0 ? (
            <ul className="space-y-2">
              {searchResults.map((motor) => (
                <li
                  key={motor.id}
                  className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg cursor-pointer transition-colors"
                  onClick={() => handleSelectMotor(motor.id)}
                >
                  <p className="font-medium">{motor.brand.name} {motor.name}</p>
                  <p className="text-sm text-gray-400">{motor.year_model}</p>
                </li>
              ))}
            </ul>
          ) : (
            debouncedSearchTerm && !loading && (
              <p className="text-center text-gray-500 mt-4">Tidak ada motor ditemukan.</p>
            )
          )}
          {!debouncedSearchTerm && !loading && (
            <p className="text-center text-gray-500 mt-4">Mulai ketik untuk mencari.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}