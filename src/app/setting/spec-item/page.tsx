"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import SimpleHeader from "@/components/SimpleHeader";
import type { Specitem } from "@/types/specitem";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getSpecitems, deleteSpecitem } from "@/lib/api/specitem";
import { AddSpecitemModal } from "@/components/specitem/AddSpecitemModal";
import { ActionBar } from "@/components/ActionBar";
import { SpecitemDetailModal } from "@/components/specitem/SpecitemDetailModal";
import { EditSpecitemModal } from "@/components/specitem/EditSpecitemModal";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

export default function SettingSpecitemPage() {
  const [specitems, setSpecitems] = useState<Specitem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingSpecitemId, setViewingSpecitemId] = useState<number | null>(null);
  const [editingSpecitemId, setEditingSpecitemId] = useState<number | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPressTriggered = useRef(false);



  const refreshSpecitems = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSpecitems(signal);
      setSpecitems(data);
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
    refreshSpecitems(controller.signal);
    return () => {
      controller.abort();
    };
  }, [refreshSpecitems]);

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
    if (selectedIds.length === specitems.length) {
      setSelectedIds([]);
      setSelectionMode(false);
    } else {
      setSelectedIds(specitems.map((specitem) => specitem.id));
    }
  };

  const handleDeleteSelected = async () => {
    setIsDeleting(true);
    try {
      for (const id of selectedIds) {
        await deleteSpecitem(id);
      }

      toast.success("Sukses!", {
        description: `${selectedIds.length} specitem berhasil dihapus.`,
        duration: 2000,
      });

    } catch (err: any) {
      toast.error("Error!", {
        description: err.message || "Gagal menghapus salah satu specitem. Proses dihentikan.",
        duration: 2000,
      });
    } finally {
      setIsDeleteConfirmOpen(false);
      setIsDeleting(false);
      cancelSelectionMode();
      await refreshSpecitems();
    }
  };



  const handleMouseDown = (specitemId: number) => {
    isLongPressTriggered.current = false;
    pressTimer.current = setTimeout(() => {
      isLongPressTriggered.current = true;
      setSelectionMode(true);
      toggleSelection(specitemId);
    }, 750);
  };

  const handleMouseUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  const handleClick = (specitemId: number) => {
    if (isLongPressTriggered.current) return;

    if (selectionMode) {
      toggleSelection(specitemId);
    } else {
      setViewingSpecitemId(specitemId);
    }
  };



  const renderContent = () => {
    if (loading) return <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-red-500" size={32} /></div>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;
    if (specitems.length === 0) return <p className="text-center text-gray-400">Tidak ada data specitem.</p>;

    return (
      <ul className="divide-y divide-white/20">
        {specitems.map((specitem) => (
          <li
            key={specitem.id}
            onMouseDown={() => handleMouseDown(specitem.id)}
            onMouseUp={handleMouseUp}
            onClick={() => handleClick(specitem.id)}
            onTouchStart={() => handleMouseDown(specitem.id)} // For mobile
            onTouchEnd={handleMouseUp} // For mobile
            className={`py-3 px-4 flex items-center gap-4 transition-colors duration-200 ${selectionMode ? 'cursor-pointer hover:bg-gray-800' : ''} ${selectedIds.includes(specitem.id) ? 'bg-red-900/50' : ''}`}
          >
            {selectionMode && (
              <Checkbox
                checked={selectedIds.includes(specitem.id)}
                onCheckedChange={() => toggleSelection(specitem.id)}
                className="border-white"
              />
            )}
            <div>
              <h3 className="font-semibold text-lg">{specitem.name}</h3>
              <p
                className="text-gray-400 text-sm mt-0 
                whitespace-nowrap overflow-hidden text-ellipsis 
                max-w-[82vw] sm:max-w-[380px]"
              >
                {specitem.desc}
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
          totalCount={specitems.length}
          onCancel={cancelSelectionMode}
          onSelectAll={handleSelectAll}
          onEdit={() => setEditingSpecitemId(selectedIds[0])}
          onDelete={() => setIsDeleteConfirmOpen(true)}
        />
      ) : (
        <SimpleHeader title="Specification Item" backUrl="/setting" />
      )}

      <div className="pb-24">
        <div className="mb-5">
          {renderContent()}
        </div>
      </div>

      <Button onClick={() => setIsAddModalOpen(true)} className="fixed bottom-20 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center right-4 md:right-[calc(50%-12rem)]">
        <Plus size={28} />
      </Button>

      <AddSpecitemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={async () => {
          await refreshSpecitems();
          toast.success("Sukses!", { description: "Specitem baru berhasil ditambahkan.", duration: 2000 });
        }}
      />

      <SpecitemDetailModal
        specitemId={viewingSpecitemId}
        onClose={() => setViewingSpecitemId(null)}
      />
      <EditSpecitemModal
        specitemId={editingSpecitemId}
        onClose={() => setEditingSpecitemId(null)}
        onSuccess={async () => {
          await refreshSpecitems();
          toast.success("Sukses!", { description: "Specitem berhasil diperbarui." });
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