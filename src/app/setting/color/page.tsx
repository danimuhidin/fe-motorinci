"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import SimpleHeader from "@/components/SimpleHeader";
import type { Color } from "@/types/color";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getColors, deleteColor } from "@/lib/api/color";
import { AddColorModal } from "@/components/color/AddColorModal";
import { ActionBar } from "@/components/ActionBar";
import { ColorDetailModal } from "@/components/color/ColorDetailModal";
import { EditColorModal } from "@/components/color/EditColorModal";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

export default function SettingColorPage() {
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingColorId, setViewingColorId] = useState<number | null>(null);
  const [editingColorId, setEditingColorId] = useState<number | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPressTriggered = useRef(false);



  const refreshColors = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getColors(signal);
      setColors(data);
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
    refreshColors(controller.signal);
    return () => {
      controller.abort();
    };
  }, [refreshColors]);

  const toggleSelection = (id: number) => {
    setSelectedIds((prevIds) => {
      const newIds = prevIds.includes(id)
        ? prevIds.filter((prevId) => prevId !== id)
        : [...prevIds, id];

      if (newIds.length === 0) {
        setSelectionMode(false);
      }

      return newIds;
    });
  };

  const cancelSelectionMode = () => {
    setSelectionMode(false);
    setSelectedIds([]);
  };

  const handleSelectAll = () => {
    if (selectedIds.length === colors.length) {
      setSelectedIds([]);
      setSelectionMode(false);
    } else {
      setSelectedIds(colors.map((color) => color.id));
    }
  };

  const handleDeleteSelected = async () => {
    setIsDeleting(true);
    try {
      for (const id of selectedIds) {
        await deleteColor(id);
      }

      toast.success("Sukses!", {
        description: `${selectedIds.length} color berhasil dihapus.`,
        duration: 2000,
      });

    } catch (err: any) {
      toast.error("Error!", {
        description: err.message || "Gagal menghapus salah satu color. Proses dihentikan.",
        duration: 2000,
      });
    } finally {
      setIsDeleteConfirmOpen(false);
      setIsDeleting(false);
      cancelSelectionMode();
      await refreshColors();
    }
  };



  const handleMouseDown = (colorId: number) => {
    isLongPressTriggered.current = false;
    pressTimer.current = setTimeout(() => {
      isLongPressTriggered.current = true;
      setSelectionMode(true);
      toggleSelection(colorId);
    }, 750);
  };

  const handleMouseUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  const handleClick = (colorId: number) => {
    if (isLongPressTriggered.current) return;

    if (selectionMode) {
      toggleSelection(colorId);
    } else {
      setViewingColorId(colorId);
    }
  };



  const renderContent = () => {
    if (loading) return <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-red-500" size={32} /></div>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;
    if (colors.length === 0) return <p className="text-center text-gray-400">Tidak ada data color.</p>;

    return (
      <ul className="divide-y divide-white/20">
        {colors.map((color) => (
          <li
            key={color.id}
            onMouseDown={() => handleMouseDown(color.id)}
            onMouseUp={handleMouseUp}
            onClick={() => handleClick(color.id)}
            onTouchStart={() => handleMouseDown(color.id)} // For mobile
            onTouchEnd={handleMouseUp} // For mobile
            className={`py-2 px-4 flex items-center gap-4 transition-colors duration-200 ${selectionMode ? 'cursor-pointer hover:bg-gray-800' : ''} ${selectedIds.includes(color.id) ? 'bg-red-900/50' : ''}`}
          >
            {selectionMode && (
              <Checkbox
                checked={selectedIds.includes(color.id)}
                onCheckedChange={() => toggleSelection(color.id)}
                className="border-white"
              />
            )}
            <div>
              <h3 className="font-semibold text-sm">{color.name}</h3>
              <p
                className="text-gray-400 text-xs mt-0 
                whitespace-nowrap overflow-hidden text-ellipsis 
                max-w-[82vw] sm:max-w-[380px]"
              >
                {color.hex}
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
        <ActionBar
          selectedCount={selectedIds.length}
          totalCount={colors.length}
          onCancel={cancelSelectionMode}
          onSelectAll={handleSelectAll}
          onEdit={() => setEditingColorId(selectedIds[0])}
          onDelete={() => setIsDeleteConfirmOpen(true)}
        />
      ) : (
        <SimpleHeader title="Color" backUrl="/setting" />
      )}

      <div className="pb-24">
        <div className="mb-5">
          {renderContent()}
        </div>
      </div>

      <Button onClick={() => setIsAddModalOpen(true)} className="fixed bottom-20 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center right-4 md:right-[calc(50%-12rem)]">
        <Plus size={28} />
      </Button>

      <AddColorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={async () => {
          await refreshColors();
          toast.success("Sukses!", { description: "Color baru berhasil ditambahkan.", duration: 2000 });
        }}
      />

      <ColorDetailModal
        colorId={viewingColorId}
        onClose={() => setViewingColorId(null)}
      />
      <EditColorModal
        colorId={editingColorId}
        onClose={() => setEditingColorId(null)}
        onSuccess={async () => {
          await refreshColors();
          toast.success("Sukses!", { description: "Color berhasil diperbarui." });
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