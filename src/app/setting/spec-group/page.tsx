// app/setting/specgroup/page.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import SimpleHeader from "@/components/SimpleHeader";
import type { Specgroup } from "@/types/specgroup";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getSpecgroups, deleteSpecgroup } from "@/lib/api/specgroup";
import { AddSpecgroupModal } from "@/components/specgroup/AddSpecgroupModal";
import { ActionBar } from "@/components/ActionBar";
import { SpecgroupDetailModal } from "@/components/specgroup/SpecgroupDetailModal";
import { EditSpecgroupModal } from "@/components/specgroup/EditSpecgroupModal";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

export default function SettingSpecgroupPage() {
  const [specgroups, setSpecgroups] = useState<Specgroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingSpecgroupId, setViewingSpecgroupId] = useState<number | null>(null);
  const [editingSpecgroupId, setEditingSpecgroupId] = useState<number | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPressTriggered = useRef(false);



  const refreshSpecgroups = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSpecgroups(signal);
      setSpecgroups(data);
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
    refreshSpecgroups(controller.signal);
    return () => {
      controller.abort();
    };
  }, [refreshSpecgroups]);

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
    if (selectedIds.length === specgroups.length) {
      setSelectedIds([]);
      setSelectionMode(false);
    } else {
      setSelectedIds(specgroups.map((specgroup) => specgroup.id));
    }
  };

  const handleDeleteSelected = async () => {
    setIsDeleting(true);
    try {
      for (const id of selectedIds) {
        await deleteSpecgroup(id);
      }

      toast.success("Sukses!", {
        description: `${selectedIds.length} specgroup berhasil dihapus.`,
        duration: 2000,
      });

    } catch (err: any) {
      toast.error("Error!", {
        description: err.message || "Gagal menghapus salah satu specgroup. Proses dihentikan.",
        duration: 2000,
      });
    } finally {
      setIsDeleteConfirmOpen(false);
      setIsDeleting(false);
      cancelSelectionMode();
      await refreshSpecgroups();
    }
  };



  const handleMouseDown = (specgroupId: number) => {
    isLongPressTriggered.current = false;
    pressTimer.current = setTimeout(() => {
      isLongPressTriggered.current = true;
      setSelectionMode(true);
      toggleSelection(specgroupId);
    }, 750);
  };

  const handleMouseUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  const handleClick = (specgroupId: number) => {
    if (isLongPressTriggered.current) return;

    if (selectionMode) {
      toggleSelection(specgroupId);
    } else {
      setViewingSpecgroupId(specgroupId);
    }
  };



  const renderContent = () => {
    if (loading) return <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-red-500" size={32} /></div>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;
    if (specgroups.length === 0) return <p className="text-center text-gray-400">Tidak ada data specgroup.</p>;

    return (
      <ul className="divide-y divide-white/20">
        {specgroups.map((specgroup) => (
          <li
            key={specgroup.id}
            onMouseDown={() => handleMouseDown(specgroup.id)}
            onMouseUp={handleMouseUp}
            onClick={() => handleClick(specgroup.id)}
            onTouchStart={() => handleMouseDown(specgroup.id)} // For mobile
            onTouchEnd={handleMouseUp} // For mobile
            className={`py-2 px-4 flex items-center gap-4 transition-colors duration-200 ${selectionMode ? 'cursor-pointer hover:bg-gray-800' : ''} ${selectedIds.includes(specgroup.id) ? 'bg-red-900/50' : ''}`}
          >
            {selectionMode && (
              <Checkbox
                checked={selectedIds.includes(specgroup.id)}
                onCheckedChange={() => toggleSelection(specgroup.id)}
                className="border-white"
              />
            )}
            <div>
              <h3 className="font-semibold text-sm">{specgroup.name}</h3>
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
          totalCount={specgroups.length}
          onCancel={cancelSelectionMode}
          onSelectAll={handleSelectAll}
          onEdit={() => setEditingSpecgroupId(selectedIds[0])}
          onDelete={() => setIsDeleteConfirmOpen(true)}
        />
      ) : (
        <SimpleHeader title="Specification Group" backUrl="/setting" />
      )}

      <div className="pb-24">
        <div className="mb-5">
          {renderContent()}
        </div>
      </div>

      <Button onClick={() => setIsAddModalOpen(true)} className="fixed bottom-20 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center right-4 md:right-[calc(50%-12rem)]">
        <Plus size={28} />
      </Button>

      <AddSpecgroupModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={async () => {
          await refreshSpecgroups();
          toast.success("Sukses!", { description: "Specgroup baru berhasil ditambahkan.", duration: 2000 });
        }}
      />

      <SpecgroupDetailModal
        specgroupId={viewingSpecgroupId}
        onClose={() => setViewingSpecgroupId(null)}
      />
      <EditSpecgroupModal
        specgroupId={editingSpecgroupId}
        onClose={() => setEditingSpecgroupId(null)}
        onSuccess={async () => {
          await refreshSpecgroups();
          toast.success("Sukses!", { description: "Specgroup berhasil diperbarui." });
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