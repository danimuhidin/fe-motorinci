// app/setting/motor/[id]/specifications/page.tsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import SimpleHeader from "@/components/SimpleHeader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { getMotorById } from "@/lib/api/motor";
import { 
  getSpecificationItems, 
  createMotorSpecification, 
  updateMotorSpecification 
} from "@/lib/api/specification";
import type { SpecificationItem } from "@/types/specification";

// Tipe untuk state form kita
type SpecValueState = {
  value: string;
  pivotId: number | null; // ID dari tabel relasi (motor_specifications)
}

export default function SpecificationSettingsPage() {
  const params = useParams();
  const motorId = Number(params.id);

  // State utama untuk form, key-nya adalah specification_item_id
  const [specValues, setSpecValues] = useState<Record<number, SpecValueState>>({});
  const [allSpecItems, setAllSpecItems] = useState<SpecificationItem[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [savingSpecId, setSavingSpecId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    try {
      // Tidak perlu setLoading(true) di sini agar refresh tidak menampilkan spinner halaman penuh
      const [motorData, allItemsData] = await Promise.all([
        getMotorById(motorId),
        getSpecificationItems(),
      ]);
      setAllSpecItems(allItemsData || []);

      const initialValues: Record<number, SpecValueState> = {};
      // Isi dengan nilai default (pivotId: null) untuk semua kemungkinan spesifikasi
      allItemsData.forEach(item => {
        initialValues[item.id] = { value: '', pivotId: null };
      });
      
      // Timpa dengan nilai yang sudah ada dari motor
      motorData.specifications.forEach(spec => {
        initialValues[spec.specification_item.id] = {
          value: spec.value,
          pivotId: spec.id, // Simpan ID relasi
        };
      });
      setSpecValues(initialValues);

    } catch (error) {
      console.error(error);
      toast.error("Gagal memuat data spesifikasi.");
    } finally {
      setLoading(false);
    }
  }, [motorId]);

  useEffect(() => {
    if (motorId) fetchData();
  }, [motorId, fetchData]);

  const groupedSpecItems = useMemo(() => {
    const groups: Record<string, SpecificationItem[]> = {};
    allSpecItems.forEach(item => {
      const groupName = item.specification_group.name;
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(item);
    });
    return Object.entries(groups);
  }, [allSpecItems]);

  const handleValueChange = (specItemId: number, value: string) => {
    setSpecValues(prev => ({
      ...prev,
      [specItemId]: {
        ...prev[specItemId], // Jaga pivotId yang ada
        value: value,
      }
    }));
  };

  const handleSave = async (specItemId: number) => {
    const specData = specValues[specItemId];
    // Jangan simpan jika value tidak terdefinisi (meskipun seharusnya tidak terjadi)
    if (typeof specData?.value === 'undefined') return;
    
    // Jangan simpan jika value kosong (opsional, bisa dihapus jika ingin menyimpan string kosong)
    if (specData.value.trim() === '') return;

    setSavingSpecId(specItemId);
    try {
      if (specData.pivotId) {
        // --- UPDATE ---
        await updateMotorSpecification(specData.pivotId, motorId, specItemId, specData.value);
      } else {
        // --- CREATE ---
        await createMotorSpecification(motorId, specItemId, specData.value);
      }
      toast.success("Spesifikasi berhasil disimpan.");
      // Refresh data untuk mendapatkan pivotId yang baru (jika baru dibuat)
      // dan memastikan data tetap sinkron.
      await fetchData(); 
    } catch (error: any) {
      toast.error("Gagal menyimpan.", { description: error.message });
    } finally {
      setSavingSpecId(null);
    }
  };
  
  if (loading) {
    return (
      <>
        <SimpleHeader title="Manajemen Spesifikasi" backUrl={`/setting/motor/${motorId}`} />
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-red-500" size={32} />
        </div>
      </>
    );
  }

  return (
    <>
      <SimpleHeader title="Manajemen Spesifikasi" backUrl={`/setting/motor/${motorId}`} />
      <div className="p-4 sm:p-6 space-y-4 mb-20">
        <div className="p-4 rounded-lg bg-yellow-900/20 border border-yellow-500/30 text-yellow-300 text-xs">
          <p>Perubahan akan disimpan secara otomatis saat Anda selesai mengetik dan berpindah dari kolom input.</p>
        </div>
        {groupedSpecItems.map(([groupName, items]) => (
          <div key={groupName} className="p-4 rounded-lg border border-white/20 bg-zinc-900/50">
            <h2 className="text-base font-semibold mb-4 border-b border-white/10 pb-2">{groupName}</h2>
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor={`spec-${item.id}`} className="text-gray-400 col-span-1 text-xs">{item.name}</Label>
                  <div className="col-span-2 flex items-center gap-2">
                    <Input
                      id={`spec-${item.id}`}
                      value={specValues[item.id]?.value || ''}
                      onChange={(e) => handleValueChange(item.id, e.target.value)}
                      onBlur={() => handleSave(item.id)}
                      className="bg-zinc-800 text-xs"
                      placeholder={item.unit || "Masukkan nilai..."}
                    />
                    {savingSpecId === item.id && <Loader2 className="animate-spin h-4 w-4 text-red-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}