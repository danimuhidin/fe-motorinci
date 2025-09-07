// app/setting/brand/page.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner"; // Perubahan: Impor toast dari sonner
import SimpleHeader from "@/components/SimpleHeader";
import type { Brand } from "@/types/brand";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getBrands, deleteBrand } from "@/lib/api/brand";
import { AddBrandModal } from "@/components/brand/AddBrandModal";
import { BrandActionBar } from "@/components/brand/BrandActionBar";
import { BrandDetailModal } from "@/components/brand/BrandDetailModal";
import { EditBrandModal } from "@/components/brand/EditBrandModal";
import { DeleteConfirmDialog } from "@/components/brand/DeleteConfirmDialog";

export default function SettingBrandPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk mode seleksi
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // State untuk mengontrol semua modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingBrandId, setViewingBrandId] = useState<number | null>(null);
  const [editingBrandId, setEditingBrandId] = useState<number | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Ref untuk membedakan klik dan tahan lama
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPressTriggered = useRef(false);

  // --- LOGIKA UTAMA ---

  const refreshBrands = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBrands(signal);
      setBrands(data);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Gagal memuat data.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    refreshBrands(controller.signal);
    return () => {
      controller.abort();
    };
  }, [refreshBrands]);

  // Fungsi untuk menangani seleksi
  const toggleSelection = (id: number) => {
    setSelectedIds((prevIds) => {
      // Hitung dulu array ID yang baru
      const newIds = prevIds.includes(id)
        ? prevIds.filter((prevId) => prevId !== id)
        : [...prevIds, id];

      // Cek apakah array baru tersebut kosong
      if (newIds.length === 0) {
        // Jika ya, keluar dari mode seleksi
        setSelectionMode(false);
      }

      // Kembalikan array baru untuk memperbarui state
      return newIds;
    });
  };

  // Fungsi untuk keluar dari mode seleksi
  const cancelSelectionMode = () => {
    setSelectionMode(false);
    setSelectedIds([]);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === brands.length) {
      // Kondisi "Unselect All"
      setSelectedIds([]);
      setSelectionMode(false);
    } else {
      // Kondisi "Select All"
      setSelectedIds(brands.map((brand) => brand.id));
    }
  };

  const handleDeleteSelected = async () => {
    setIsDeleting(true);
    try {
      // 1. Lakukan loop untuk setiap ID yang dipilih
      for (const id of selectedIds) {
        await deleteBrand(id); // Hapus satu per satu
      }

      // 2. Toast sukses hanya muncul jika semua berhasil (loop selesai tanpa error)
      toast.success("Sukses!", {
        description: `${selectedIds.length} brand berhasil dihapus.`,
        duration: 2000,
      });

    } catch (err: any) {
      // 3. Jika salah satu gagal, loop berhenti dan toast error muncul
      toast.error("Error!", {
        description: err.message || "Gagal menghapus salah satu brand. Proses dihentikan.",
        duration: 2000,
      });
    } finally {
      // 4. Blok ini selalu berjalan, baik sukses maupun gagal
      setIsDeleteConfirmOpen(false);
      setIsDeleting(false);
      cancelSelectionMode();
      await refreshBrands(); // Muat ulang daftar untuk menampilkan data yang tersisa
    }
  };

  // --- LOGIKA INTERAKSI (KLIK vs TAHAN LAMA) ---

  const handleMouseDown = (brandId: number) => {
    isLongPressTriggered.current = false;
    pressTimer.current = setTimeout(() => {
      isLongPressTriggered.current = true;
      setSelectionMode(true);
      toggleSelection(brandId);
    }, 750); // 750ms untuk dianggap tahan lama
  };

  const handleMouseUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  const handleClick = (brandId: number) => {
    if (isLongPressTriggered.current) return;

    if (selectionMode) {
      toggleSelection(brandId);
    } else {
      setViewingBrandId(brandId);
    }
  };

  // --- RENDER ---

  const renderContent = () => {
    if (loading) return <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-red-500" size={32} /></div>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;
    if (brands.length === 0) return <p className="text-center text-gray-400">Tidak ada data brand.</p>;

    return (
      <ul className="divide-y divide-white/20">
        {brands.map((brand) => (
          <li
            key={brand.id}
            onMouseDown={() => handleMouseDown(brand.id)}
            onMouseUp={handleMouseUp}
            onClick={() => handleClick(brand.id)}
            onTouchStart={() => handleMouseDown(brand.id)} // For mobile
            onTouchEnd={handleMouseUp} // For mobile
            className={`py-3 px-4 flex items-center gap-4 transition-colors duration-200 ${selectionMode ? 'cursor-pointer hover:bg-gray-800' : ''} ${selectedIds.includes(brand.id) ? 'bg-red-900/50' : ''}`}
          >
            {selectionMode && (
              <Checkbox
                checked={selectedIds.includes(brand.id)}
                onCheckedChange={() => toggleSelection(brand.id)}
                className="border-white"
              />
            )}
            <div>
              <h3 className="font-semibold text-lg">{brand.name}</h3>
              <p
                className="text-gray-400 text-sm mt-0 
                whitespace-nowrap overflow-hidden text-ellipsis 
                max-w-[82vw] sm:max-w-[380px]"
              >
                {brand.desc}
              </p>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      {selectionMode ? (
        <BrandActionBar
          selectedCount={selectedIds.length}
          totalCount={brands.length}
          onCancel={cancelSelectionMode}
          onSelectAll={handleSelectAll}
          onEdit={() => setEditingBrandId(selectedIds[0])}
          onDelete={() => setIsDeleteConfirmOpen(true)}
        />
      ) : (
        <SimpleHeader title="Brand" backUrl="/setting" />
      )}

      <div className="pb-24"> {/* Dihapus px-4 dan pt-4 karena sudah ada di list item */}
        <div className="mb-5">
          {renderContent()}
        </div>
      </div>

      <Button onClick={() => setIsAddModalOpen(true)} className="fixed bottom-20 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center right-4 md:right-[calc(50%-12rem)]">
        <Plus size={28} />
      </Button>

      <AddBrandModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={async () => {
          await refreshBrands();
          toast.success("Sukses!", { description: "Brand baru berhasil ditambahkan.", duration: 2000 });
        }}
      />

      <BrandDetailModal
        brandId={viewingBrandId}
        onClose={() => setViewingBrandId(null)}
      />
      <EditBrandModal
        brandId={editingBrandId}
        onClose={() => setEditingBrandId(null)}
        onSuccess={async () => {
          await refreshBrands();
          toast.success("Sukses!", { description: "Brand berhasil diperbarui." });
        }}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteSelected}
        selectedCount={selectedIds.length}
        isDeleting={isDeleting}
      />
    </>
  );
}