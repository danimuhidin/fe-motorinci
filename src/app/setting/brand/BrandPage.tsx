// src/app/setting/brand/BrandClientPage.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import SimpleHeader from "@/components/SimpleHeader";
import BrandModalContent from '@/components/admin/BrandModal';
import { createBrand } from "@/lib/api/brands";
import type { Brand, NewBrandData } from '@/lib/api/brands';

export default function BrandClientPage({ initialBrands }: { initialBrands: Brand[] }) {
    const router = useRouter();
    const [brands, setBrands] = useState<Brand[]>(initialBrands);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSaveBrand = async (data: NewBrandData) => {
        try {
            await createBrand(data);
            router.refresh();
        } catch (error) {
            console.error("Gagal menyimpan brand dari halaman utama:", error);
            alert("Gagal menyimpan data. Silakan coba lagi.");
            throw error;
        }
    };

    return (
        <>
            <SimpleHeader title="Brand" backUrl="/setting" />
            <div className="p-4 md:p-6">
                <ul>
                    {brands && brands.length > 0 ? (
                        brands.map((brand) => (
                            <li key={brand.id} className="py-2 border-b">{brand.name}</li>
                        ))
                    ) : (
                        <li>Tidak ada data brand.</li>
                    )}
                </ul>
            </div>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                    <Button
                        className="fixed bottom-22 right-8 bg-red-600 text-white rounded-full w-14 h-14 text-3xl shadow-lg hover:bg-red-700 transition-transform duration-200 transform hover:scale-110"
                        aria-label="Tambah Brand Baru"
                    >
                        +
                    </Button>
                </DialogTrigger>
                <BrandModalContent
                    onSave={handleSaveBrand}
                    closeDialog={() => setIsModalOpen(false)}
                />
            </Dialog>
        </>
    );
}