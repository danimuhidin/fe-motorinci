// app/setting/motor/[id]/general/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import SimpleHeader from "@/components/SimpleHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

import { getMotorById, updateMotorGeneral, MotorGeneralFormData } from "@/lib/api/motor";
import { getBrands } from "@/lib/api/brand";
import { getCategories } from "@/lib/api/category";
import type { Brand } from "@/types/brand";
import type { Category } from "@/types/category";

export default function GeneralSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const motorId = Number(params.id);

  const [formData, setFormData] = useState<Partial<MotorGeneralFormData>>({});
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Ambil semua data yang diperlukan saat komponen dimuat
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Ambil semua data secara paralel untuk performa lebih baik
        const [motorData, brandsData, categoriesData] = await Promise.all([
          getMotorById(motorId),
          getBrands(),
          getCategories(),
        ]);
        
        // Isi form dengan data motor yang ada
        setFormData({
          name: motorData.name,
          brand_id: motorData.brand_id,
          category_id: motorData.category_id,
          year_model: motorData.year_model,
          engine_cc: motorData.engine_cc,
          brochure_url: motorData.brochure_url,
          sparepart_url: motorData.sparepart_url,
          low_price: motorData.low_price,
          up_price: motorData.up_price,
          desc: motorData.desc,
        });

        setBrands(brandsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Gagal memuat data:", error);
        toast.error("Gagal memuat data untuk form.");
      } finally {
        setLoading(false);
      }
    };
    if (motorId) fetchData();
  }, [motorId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: 'brand_id' | 'category_id', value: string) => {
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateMotorGeneral(motorId, formData as MotorGeneralFormData);
      toast.success("Informasi Umum berhasil diperbarui!");
      router.push(`/setting/motor/${motorId}`); // Kembali ke menu
    } catch (error: any) {
      toast.error("Gagal menyimpan:", { description: error.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <SimpleHeader title="Memuat Form..." backUrl={`/setting/motor/${motorId}`} />
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-red-500" size={32} />
        </div>
      </>
    );
  }

  return (
    <>
      <SimpleHeader title="Edit Informasi Umum" backUrl={`/setting/motor/${motorId}`} />
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
        {/* Name */}
        <div>
          <Label htmlFor="name">Nama Model</Label>
          <Input id="name" name="name" value={formData.name || ''} onChange={handleInputChange} className="mt-1 bg-zinc-800" required />
        </div>

        {/* Brand */}
        <div>
          <Label htmlFor="brand_id">Brand</Label>
          <Select value={String(formData.brand_id || '')} onValueChange={(value) => handleSelectChange('brand_id', value)} required>
            <SelectTrigger id="brand_id" className="mt-1 bg-zinc-800 w-full"><SelectValue placeholder="Pilih Brand..." /></SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/20 text-white">
              {brands.map(brand => <SelectItem key={brand.id} value={String(brand.id)}>{brand.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category_id">Kategori</Label>
          <Select value={String(formData.category_id || '')} onValueChange={(value) => handleSelectChange('category_id', value)} required>
            <SelectTrigger id="category_id" className="mt-1 bg-zinc-800 w-full"><SelectValue placeholder="Pilih Kategori..." /></SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/20 text-white">
              {categories.map(cat => <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Year & CC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="year_model">Tahun</Label>
            <Input id="year_model" name="year_model" type="number" value={formData.year_model || ''} onChange={handleInputChange} className="mt-1 bg-zinc-800" required />
          </div>
          <div>
            <Label htmlFor="engine_cc">Kapasitas Mesin (cc)</Label>
            <Input id="engine_cc" name="engine_cc" type="number" value={formData.engine_cc || ''} onChange={handleInputChange} className="mt-1 bg-zinc-800" required />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="low_price">Harga Terendah</Label>
            <Input id="low_price" name="low_price" type="number" value={formData.low_price || ''} onChange={handleInputChange} className="mt-1 bg-zinc-800" required />
          </div>
          <div>
            <Label htmlFor="up_price">Harga Tertinggi</Label>
            <Input id="up_price" name="up_price" type="number" value={formData.up_price || ''} onChange={handleInputChange} className="mt-1 bg-zinc-800" required />
          </div>
        </div>
        
        <div>
          <Label htmlFor="desc">Deskripsi</Label>
          <Input id="desc" name="desc" value={formData.desc || ''} onChange={handleInputChange} className="mt-1 bg-zinc-800" />
        </div>
        <div>
          <Label htmlFor="brochure_url">URL Brosur</Label>
          <Input id="brochure_url" name="brochure_url" type="url" value={formData.brochure_url || ''} onChange={handleInputChange} className="mt-1 bg-zinc-800" />
        </div>
        <div>
          <Label htmlFor="sparepart_url">URL Spare Part</Label>
          <Input id="sparepart_url" name="sparepart_url" type="url" value={formData.sparepart_url || ''} onChange={handleInputChange} className="mt-1 bg-zinc-800" />
        </div>
        
        {/* Submit Button */}
        <Button type="submit" disabled={isSaving} className="w-full bg-red-600 hover:bg-red-700">
          {isSaving ? <Loader2 className="animate-spin" /> : 'Simpan Perubahan'}
        </Button>
      </form>
    </>
  );
}