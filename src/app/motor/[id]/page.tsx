// app/motor/[id]/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import SimpleHeader from "@/components/SimpleHeader";
import { ComparisonCard } from "@/components/compare/ComparisonCard";
import { MotorCarousel } from "@/components/compare/MotorCarousel";
import { getMotorById } from "@/lib/api/motor";
import type { Motor } from "@/types/motor";
import { Loader2 } from "lucide-react";
import { InfoBanner } from "@/components/ui/info-banner";

const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

export default function MotorDetailPage() {
  const params = useParams(); // 3. Gunakan hook useParams untuk mendapatkan parameter
  const motorId = Number(params.id); // 'id' sesuai dengan nama folder [id]

  const [motor, setMotor] = useState<Motor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!motorId) return;
    const controller = new AbortController();
    const fetchMotorDetail = async () => {
      try {
        setLoading(true);
        const data = await getMotorById(motorId, controller.signal);
        setMotor(data);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error("Gagal memuat detail motor:", err);
          setError("Gagal memuat data motor. Silakan coba lagi.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMotorDetail();

    return () => controller.abort();
  }, [motorId]);

  // Mengelompokkan spesifikasi berdasarkan grupnya
  const specGroups = useMemo(() => {
    if (!motor) return [];
    const groupMap = new Map<string, Motor['specifications']>();
    motor.specifications.forEach(spec => {
      const groupName = spec.specification_item.specification_group.name;
      if (!groupMap.has(groupName)) {
        groupMap.set(groupName, []);
      }
      groupMap.get(groupName)!.push(spec);
    });
    return Array.from(groupMap.entries());
  }, [motor]);

  if (loading) {
    return (
      <>
        <SimpleHeader title="Memuat..." backUrl="/" />
        <div className="flex justify-center items-center h-[80vh]">
          <Loader2 className="animate-spin text-red-500" size={40} />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <SimpleHeader title="Error" backUrl="/" />
        <div className="p-4 text-center text-red-500">{error}</div>
      </>
    );
  }

  if (!motor) return null;

  return (
    <>
      <SimpleHeader title={`${motor.name} ${motor.year_model}`} backUrl="/" className="sticky top-0 z-20 bg-black/98" />
      <div className="p-4">
        {/* 1. Carousel */}
        <div className="mb-4">
          <MotorCarousel motor={motor} loading={loading} />
        </div>

        <div className="space-y-2">
          <ComparisonCard title="Informasi Umum">
            {/* Menghapus space-y dari ul, padding diatur di li */}
            <ul className="text-sm">
              <li className="flex justify-between py-1 border-b border-zinc-700">
                <span className="text-xs text-gray-400">Brand:</span>
                <span className="font-medium text-xs text-right">{motor.brand.name}</span>
              </li>
              <li className="flex justify-between py-1 border-b border-zinc-700">
                <span className="text-xs text-gray-400">Motor:</span>
                <span className="font-medium text-xs text-right">{motor.name}</span>
              </li>
              <li className="flex justify-between py-1 border-b border-zinc-700">
                <span className="text-xs text-gray-400">Tahun:</span>
                <span className="font-medium text-xs text-right">{motor.year_model}</span>
              </li>
              <li className="flex justify-between py-1 border-b border-zinc-700">
                <span className="text-xs text-gray-400">Kategori:</span>
                <span className="font-medium text-xs text-right">{motor.category.name}</span>
              </li>
              <li className="flex justify-between py-1 border-b border-zinc-700">
                <span className="text-xs text-gray-400">Kapasitas Mesin:</span>
                <span className="font-medium text-xs text-right">{motor.engine_cc} cc</span>
              </li>
              {/* last:border-b-0 tidak diperlukan karena ini elemen terakhir secara statis */}
              <li className="flex justify-between pt-1">
                <span className="text-xs text-gray-400">Harga (mulai dari):</span>
                <span className="font-medium text-xs text-right">{formatPrice(motor.low_price)}</span>
              </li>
            </ul>
          </ComparisonCard>

          <ComparisonCard title="Fitur Unggulan">
            <ul className="text-sm list-disc list-inside">
              {motor.features.length > 0 ? motor.features.map(f => (
                <li key={f.id} className="text-xs py-1 border-b border-zinc-700 last:border-b-0 last:pb-0">
                  {f.feature_item.name}
                </li>
              )) : <li className="text-xs">Tidak ada data fitur.</li>}
            </ul>
          </ComparisonCard>

          {/* Mapping untuk setiap grup spesifikasi */}
          {specGroups.map(([groupName, specs]) => (
            <ComparisonCard key={groupName} title={groupName}>
              <ul className="text-xs">
                {specs.map(s => (
                  <li key={s.id} className="flex justify-between items-start gap-2 py-1 border-b border-zinc-700 last:border-b-0 last:pb-0">
                    <span className="text-gray-400">{s.specification_item.name}:</span>
                    <span className="font-medium text-right">{s.value} {s.specification_item.unit || ""}</span>
                  </li>
                ))}
              </ul>
            </ComparisonCard>
          ))}
        </div>
      </div>

      <InfoBanner />
    </>
  );
}