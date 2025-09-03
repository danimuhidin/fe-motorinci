"use client";

import { useEffect, useState } from "react";
import SimpleHeader from "@/components/SimpleHeader";
import { fetchWithAuth } from "@/lib/api";
import { Brand } from "@/types/brand";

export default function SettingBrandPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getBrands = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchWithAuth<Brand[]>('/motorinci/brands', { signal });
        setBrands(data);
        setLoading(false);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Gagal memuat data.');
          setLoading(false);
          console.error(err);
        }
      }
    };

    getBrands();

    return () => {
      controller.abort();
    };
  }, []);

  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-gray-400">Memuat data...</p>;
    }

    if (error) {
      return <p className="text-center text-red-500">Error: {error}</p>;
    }

    if (brands.length === 0) {
      return <p className="text-center text-gray-400">Tidak ada data brand.</p>;
    }

    return (
      <ul className="divide-y divide-white/20">
        {brands.map((brand) => (
          <li key={brand.id} className="py-4">
            <h3 className="font-semibold text-lg">{brand.name}</h3>
            <p className="text-gray-400 text-sm mt-1">{brand.desc}</p>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <SimpleHeader title="Brand" backUrl="/setting" />
      <div className="pt-4 pb-18 px-4">
        <div className="mb-5">
          {renderContent()}
        </div>
      </div>
    </>
  );
}