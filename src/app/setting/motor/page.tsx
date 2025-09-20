// app/setting/motor/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import SimpleHeader from "@/components/SimpleHeader";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { searchMotors } from "@/lib/api/motor";
import type { Motor } from "@/types/motor";

export default function SearchMotorPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Motor[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchMotors = async () => {
      if (!debouncedSearchTerm) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const data = await searchMotors(debouncedSearchTerm);
        setResults(data);
      } catch (error) {
        console.error("Gagal mencari motor:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMotors();
  }, [debouncedSearchTerm]);

  return (
    <>
      <SimpleHeader title="Manajemen Motor" backUrl="/setting" />
      <div className="p-4 sm:p-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Ketik untuk mencari motor..."
            className="pl-10 bg-zinc-800 border-white/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="mt-4 space-y-2">
          {loading && (
            <div className="flex justify-center p-4">
              <Loader2 className="animate-spin text-red-500" />
            </div>
          )}
          {!loading && debouncedSearchTerm && results.length === 0 && (
            <p className="text-center text-gray-500">Motor tidak ditemukan.</p>
          )}
          {!loading && results.length > 0 && (
            <ul className="divide-y divide-white/20">
              {results.map((motor) => (
                <li key={motor.id}>
                  <Link href={`/setting/motor/${motor.id}`} className="block p-3 hover:bg-zinc-800 rounded-lg">
                    <p className="font-semibold">{motor.brand.name} {motor.name}</p>
                    <p className="text-sm text-gray-400">{motor.year_model}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}