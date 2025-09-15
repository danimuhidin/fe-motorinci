"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import SimpleHeader from "@/components/SimpleHeader";
import type { Category } from "@/types/category";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getCategories, deleteCategory } from "@/lib/api/category";
import { AddCategoryModal } from "@/components/category/AddCategoryModal";
import { ActionBar } from "@/components/ActionBar";
import { CategoryDetailModal } from "@/components/category/CategoryDetailModal";
import { EditCategoryModal } from "@/components/category/EditCategoryModal";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

export default function SettingCategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingCategoryId, setViewingCategoryId] = useState<number | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPressTriggered = useRef(false);



  const refreshCategories = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories(signal);
      setCategories(data);
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
    refreshCategories(controller.signal);
    return () => {
      controller.abort();
    };
  }, [refreshCategories]);

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
    if (selectedIds.length === categories.length) {
      setSelectedIds([]);
      setSelectionMode(false);
    } else {
      setSelectedIds(categories.map((category) => category.id));
    }
  };

  const handleDeleteSelected = async () => {
    setIsDeleting(true);
    try {
      for (const id of selectedIds) {
        await deleteCategory(id);
      }

      toast.success("Sukses!", {
        description: `${selectedIds.length} category berhasil dihapus.`,
        duration: 2000,
      });

    } catch (err: any) {
      toast.error("Error!", {
        description: err.message || "Gagal menghapus salah satu category. Proses dihentikan.",
        duration: 2000,
      });
    } finally {
      setIsDeleteConfirmOpen(false);
      setIsDeleting(false);
      cancelSelectionMode();
      await refreshCategories();
    }
  };



  const handleMouseDown = (categoryId: number) => {
    isLongPressTriggered.current = false;
    pressTimer.current = setTimeout(() => {
      isLongPressTriggered.current = true;
      setSelectionMode(true);
      toggleSelection(categoryId);
    }, 750);
  };

  const handleMouseUp = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
  };

  const handleClick = (categoryId: number) => {
    if (isLongPressTriggered.current) return;

    if (selectionMode) {
      toggleSelection(categoryId);
    } else {
      setViewingCategoryId(categoryId);
    }
  };



  const renderContent = () => {
    if (loading) return <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-red-500" size={32} /></div>;
    if (error) return <p className="text-center text-red-500">Error: {error}</p>;
    if (categories.length === 0) return <p className="text-center text-gray-400">Tidak ada data category.</p>;

    return (
      <ul className="divide-y divide-white/20">
        {categories.map((category) => (
          <li
            key={category.id}
            onMouseDown={() => handleMouseDown(category.id)}
            onMouseUp={handleMouseUp}
            onClick={() => handleClick(category.id)}
            onTouchStart={() => handleMouseDown(category.id)} // For mobile
            onTouchEnd={handleMouseUp} // For mobile
            className={`py-2 px-4 flex items-center gap-4 transition-colors duration-200 ${selectionMode ? 'cursor-pointer hover:bg-gray-800' : ''} ${selectedIds.includes(category.id) ? 'bg-red-900/50' : ''}`}
          >
            {selectionMode && (
              <Checkbox
                checked={selectedIds.includes(category.id)}
                onCheckedChange={() => toggleSelection(category.id)}
                className="border-white"
              />
            )}
            <div>
              <h3 className="font-semibold text-sm">{category.name}</h3>
              <p
                className="text-gray-400 text-xs mt-0 
                whitespace-nowrap overflow-hidden text-ellipsis 
                max-w-[82vw] sm:max-w-[380px]"
              >
                {category.desc}
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
          totalCount={categories.length}
          onCancel={cancelSelectionMode}
          onSelectAll={handleSelectAll}
          onEdit={() => setEditingCategoryId(selectedIds[0])}
          onDelete={() => setIsDeleteConfirmOpen(true)}
        />
      ) : (
        <SimpleHeader title="Category" backUrl="/setting" />
      )}

      <div className="pb-24">
        <div className="mb-5">
          {renderContent()}
        </div>
      </div>

      <Button onClick={() => setIsAddModalOpen(true)} className="fixed bottom-20 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center right-4 md:right-[calc(50%-12rem)]">
        <Plus size={28} />
      </Button>

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={async () => {
          await refreshCategories();
          toast.success("Sukses!", { description: "Category baru berhasil ditambahkan.", duration: 2000 });
        }}
      />

      <CategoryDetailModal
        categoryId={viewingCategoryId}
        onClose={() => setViewingCategoryId(null)}
      />
      <EditCategoryModal
        categoryId={editingCategoryId}
        onClose={() => setEditingCategoryId(null)}
        onSuccess={async () => {
          await refreshCategories();
          toast.success("Sukses!", { description: "Category berhasil diperbarui." });
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