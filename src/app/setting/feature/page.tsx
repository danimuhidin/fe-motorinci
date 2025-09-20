"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import SimpleHeader from "@/components/SimpleHeader";
import type { Feature } from "@/types/feature";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getFeatureItems, deleteFeatureItem } from "@/lib/api/feature";
import { AddFeatureModal } from "@/components/feature/AddFeatureModal";
import { ActionBar } from "@/components/ActionBar";
import { FeatureDetailModal } from "@/components/feature/FeatureDetailModal";
import { EditFeatureModal } from "@/components/feature/EditFeatureModal";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

export default function SettingFeaturePage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingFeatureId, setViewingFeatureId] = useState<number | null>(null);
  const [editingFeatureId, setEditingFeatureId] = useState<number | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPressTriggered = useRef(false);



  const refreshFeatures = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFeatureItems(signal);
      setFeatures(data);
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
    refreshFeatures(controller.signal);
    return () => {
      controller.abort();
    };
  }, [refreshFeatures]);

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
    if (selectedIds.length === features.length) {
      setSelectedIds([]);
      setSelectionMode(false);
    } else {
      setSelectedIds(features.map((feature) => feature.id));
    }
  };

  const handleDeleteSelected = async () => {
    setIsDeleting(true);
    try {
      for (const id of selectedIds) {
        await deleteFeatureItem(id);
      }

      toast.success("Sukses!", {
        description: `${selectedIds.length} feature berhasil dihapus.`,
        duration: 2000,
      });

    } catch (err: any) {
      toast.error("Error!", {
        description: err.message || "Gagal menghapus salah satu feature. Proses dihentikan.",
        duration: 2000,
      });
    } finally {
      setIsDeleteConfirmOpen(false);
      setIsDeleting(false);
      cancelSelectionMode();
      await refreshFeatures();
    }
  };



  const handleMouseDown = (featureId: number) => {
    isLongPressTriggered.current = false;
    pressTimer.current = setTimeout(() => {
      isLongPressTriggered.current = true;
      setSelectionMode(true);
      toggleSelection(featureId);
    }, 750);
  };

  const handleMouseUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  const handleClick = (featureId: number) => {
    if (isLongPressTriggered.current) return;

    if (selectionMode) {
      toggleSelection(featureId);
    } else {
      setViewingFeatureId(featureId);
    }
  };



  const renderContent = () => {
    if (loading) return <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-red-500" size={32} /></div>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;
    if (features.length === 0) return <p className="text-center text-gray-400">Tidak ada data feature.</p>;

    return (
      <ul className="divide-y divide-white/20">
        {features.map((feature) => (
          <li
            key={feature.id}
            onMouseDown={() => handleMouseDown(feature.id)}
            onMouseUp={handleMouseUp}
            onClick={() => handleClick(feature.id)}
            onTouchStart={() => handleMouseDown(feature.id)} // For mobile
            onTouchEnd={handleMouseUp} // For mobile
            className={`py-3 px-4 flex items-center gap-4 transition-colors duration-200 ${selectionMode ? 'cursor-pointer hover:bg-gray-800' : ''} ${selectedIds.includes(feature.id) ? 'bg-red-900/50' : ''}`}
          >
            {selectionMode && (
              <Checkbox
                checked={selectedIds.includes(feature.id)}
                onCheckedChange={() => toggleSelection(feature.id)}
                className="border-white"
              />
            )}
            <div>
              <h3 className="font-semibold text-sm">{feature.name}</h3>
              <p
                className="text-gray-400 text-xs mt-0 
                whitespace-nowrap overflow-hidden text-ellipsis 
                max-w-[82vw] sm:max-w-[380px]"
              >
                {feature.desc}
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
          totalCount={features.length}
          onCancel={cancelSelectionMode}
          onSelectAll={handleSelectAll}
          onEdit={() => setEditingFeatureId(selectedIds[0])}
          onDelete={() => setIsDeleteConfirmOpen(true)}
        />
      ) : (
        <SimpleHeader title="Feature" backUrl="/setting" />
      )}

      <div className="pb-24">
        <div className="mb-5">
          {renderContent()}
        </div>
      </div>

      <Button onClick={() => setIsAddModalOpen(true)} className="fixed bottom-20 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center right-4 md:right-[calc(50%-12rem)]">
        <Plus size={28} />
      </Button>

      <AddFeatureModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={async () => {
          await refreshFeatures();
          toast.success("Sukses!", { description: "Feature baru berhasil ditambahkan.", duration: 2000 });
        }}
      />

      <FeatureDetailModal
        featureId={viewingFeatureId}
        onClose={() => setViewingFeatureId(null)}
      />
      <EditFeatureModal
        featureId={editingFeatureId}
        onClose={() => setEditingFeatureId(null)}
        onSuccess={async () => {
          await refreshFeatures();
          toast.success("Sukses!", { description: "Feature berhasil diperbarui." });
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