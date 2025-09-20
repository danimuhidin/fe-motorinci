// app/setting/motor/[id]/features/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import SimpleHeader from "@/components/SimpleHeader";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

import { getMotorById } from "@/lib/api/motor";
import { getFeatureItems, addMotorFeature, removeMotorFeature } from "@/lib/api/feature"; 
import type { Feature as MotorFeatureRel } from "@/types/motor"; 
import type { Feature as FeatureItem } from "@/types/feature";   

export default function FeatureSettingsPage() {
  const params = useParams();
  const motorId = Number(params.id);

  const [currentFeatures, setCurrentFeatures] = useState<MotorFeatureRel[]>([]);
  const [allFeatureItems, setAllFeatureItems] = useState<FeatureItem[]>([]);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>("");
  
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [motorData, featureItemsData] = await Promise.all([
          getMotorById(motorId),
          getFeatureItems(),
        ]);
        setCurrentFeatures(motorData.features || []);
        setAllFeatureItems(featureItemsData || []);
      } catch (error) {
        console.error("Gagal memuat data:", error);
        toast.error("Gagal memuat data fitur.");
      } finally {
        setLoading(false);
      }
    };
    if (motorId) fetchData();
  }, [motorId]);

  const availableFeatures = allFeatureItems.filter(
    (item) => !currentFeatures.some((cf) => cf.feature_item.id === item.id)
  );

  const handleAddFeature = async () => {
    if (!selectedFeatureId) return;
    setIsAdding(true);
    try {
      const newFeature = await addMotorFeature(motorId, Number(selectedFeatureId));
      setCurrentFeatures(prev => [...prev, newFeature]);
      toast.success(`Fitur "${newFeature.feature_item.name}" berhasil ditambahkan.`);
      setSelectedFeatureId("");
    } catch (error: any) {
      toast.error("Gagal menambah fitur.", { description: error.message });
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveFeature = async (motorFeatureId: number, featureName: string) => {
    setDeletingId(motorFeatureId);
    try {
      await removeMotorFeature(motorFeatureId);
      setCurrentFeatures(prev => prev.filter(f => f.id !== motorFeatureId));
      toast.success(`Fitur "${featureName}" berhasil dihapus.`);
    } catch (error: any) {
      toast.error("Gagal menghapus fitur.", { description: error.message });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return (
    <>
        <SimpleHeader title="Manajemen Fitur" backUrl={`/setting/motor/${motorId}`} />
        <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-red-500" size={32} /></div>
    </>
  );

  return (
    <>
      <SimpleHeader title="Manajemen Fitur" backUrl={`/setting/motor/${motorId}`} />
      <div className="p-4 sm:p-6 space-y-8">
        {/* Form Tambah Fitur */}
        <div className="p-4 rounded-lg border border-white/20 bg-zinc-900/50 space-y-3">
          <h2 className="text-lg font-semibold">Tambah Fitur Baru</h2>
          <div className="flex gap-2">
            <Select value={selectedFeatureId} onValueChange={setSelectedFeatureId}>
              <SelectTrigger className="w-full bg-zinc-800"><SelectValue placeholder="Pilih fitur untuk ditambahkan..." /></SelectTrigger>
              <SelectContent className="bg-zinc-900 border-white/20 text-white">
                {availableFeatures.length > 0 ? availableFeatures.map(item => (
                  <SelectItem key={item.id} value={String(item.id)}>{item.name}</SelectItem>
                )) : <div className="p-2 text-sm text-gray-500">Semua fitur sudah ditambahkan.</div>}
              </SelectContent>
            </Select>
            <Button onClick={handleAddFeature} disabled={!selectedFeatureId || isAdding} className="bg-red-600 hover:bg-red-700 flex-shrink-0">
              {isAdding ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Daftar Fitur Saat Ini */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Fitur Saat Ini ({currentFeatures.length})</h2>
          <div className="space-y-2">
            {currentFeatures.length > 0 ? currentFeatures.map(feature => (
              <div key={feature.id} className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                <span>{feature.feature_item.name}</span>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveFeature(feature.id, feature.feature_item.name)} disabled={deletingId === feature.id}>
                  {deletingId === feature.id ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 className="h-4 w-4 text-red-500"/>}
                </Button>
              </div>
            )) : (
              <p className="text-center text-gray-500 py-4">Belum ada fitur yang ditambahkan.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}