// app/compare/[slug]/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import SimpleHeader from "@/components/SimpleHeader";
import { MotorHeader } from "@/components/compare/MotorHeader";
import { ComparisonCard } from "@/components/compare/ComparisonCard";
import { getMotorById } from "@/lib/api/motor";
import type { Motor } from "@/types/motor";

interface CompareResultPageProps {
  params: { slug: string; };
}

const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

export default function CompareResultPage({ params }: CompareResultPageProps) {
  const ids = params.slug.split('-vs-');
  const motor1Id = Number(ids[0]);
  const motor2Id = Number(ids[1]);

  const [motor1, setMotor1] = useState<Motor | null>(null);
  const [motor2, setMotor2] = useState<Motor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllMotorData = async () => {
      try {
        setLoading(true);
        // Ambil data kedua motor secara bersamaan
        const [data1, data2] = await Promise.all([
          getMotorById(motor1Id),
          getMotorById(motor2Id)
        ]);
        setMotor1(data1);
        setMotor2(data2);
      } catch (error) {
        console.error(`Gagal memuat data perbandingan`, error);
      } finally {
        setLoading(false);
      }
    };
    
    if (motor1Id && motor2Id) fetchAllMotorData();
  }, [motor1Id, motor2Id]);

  // Mengumpulkan dan mengelompokkan semua grup spesifikasi dari kedua motor
  const specGroups = useMemo(() => {
    if (!motor1 || !motor2) return [];
    const allSpecs = [...motor1.specifications, ...motor2.specifications];
    const groupNames = new Set(allSpecs.map(s => s.specification_item.specification_group.name));
    return Array.from(groupNames);
  }, [motor1, motor2]);

  return (
    <>
      <SimpleHeader title="Hasil Komparasi" backUrl="/compare" />
      <div className="p-2 sm:p-4">
        {/* Bagian Header & Carousel */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 items-start">
          <MotorHeader motor={motor1} loading={loading} />
          <MotorHeader motor={motor2} loading={loading} />
        </div>

        {/* Bagian Kartu Perbandingan */}
        <div className="space-y-3 mt-2 sm:mt-4 pb-30">
          <ComparisonCard title="Informasi Umum" loading={loading}>
            <ul className="p-2 space-y-2 text-xs"><li className="flex justify-between"><span>Kategori:</span> <span className="font-medium text-right">{motor1?.category.name}</span></li><li className="flex justify-between"><span>Kapasitas Mesin:</span> <span className="font-medium">{motor1?.engine_cc} cc</span></li><li className="flex justify-between"><span>Harga (mulai dari):</span> <span className="font-medium">{motor1 ? formatPrice(motor1.low_price) : ''}</span></li></ul>
            <ul className="p-2 space-y-2 text-xs"><li className="flex justify-between"><span>Kategori:</span> <span className="font-medium text-right">{motor2?.category.name}</span></li><li className="flex justify-between"><span>Kapasitas Mesin:</span> <span className="font-medium">{motor2?.engine_cc} cc</span></li><li className="flex justify-between"><span>Harga (mulai dari):</span> <span className="font-medium">{motor2 ? formatPrice(motor2.low_price) : ''}</span></li></ul>
          </ComparisonCard>
          
          <ComparisonCard title="Fitur Unggulan" loading={loading}>
            <ul className="p-2 space-y-2 text-xs list-disc list-inside">{motor1 && motor1.features.length > 0 ? motor1.features.map(f => (<li key={f.id}>{f.feature_item.name}</li>)) : <li>-</li>}</ul>
            <ul className="p-2 space-y-2 text-xs list-disc list-inside">{motor2 && motor2.features.length > 0 ? motor2.features.map(f => (<li key={f.id}>{f.feature_item.name}</li>)) : <li>-</li>}</ul>
          </ComparisonCard>

          {/* Mapping untuk setiap grup spesifikasi */}
          {specGroups.map(groupName => (
            <ComparisonCard key={groupName} title={groupName} loading={loading}>
              <ul className="p-2 space-y-2 text-xs">{motor1?.specifications.filter(s => s.specification_item.specification_group.name === groupName).map(s => (<li key={s.id} className="flex justify-between items-start gap-2"><span className="text-gray-400">{s.specification_item.name}:</span><span className="font-medium text-right">{s.value} {s.specification_item.unit || ""}</span></li>))}</ul>
              <ul className="p-2 space-y-2 text-xs">{motor2?.specifications.filter(s => s.specification_item.specification_group.name === groupName).map(s => (<li key={s.id} className="flex justify-between items-start gap-2"><span className="text-gray-400">{s.specification_item.name}:</span><span className="font-medium text-right">{s.value} {s.specification_item.unit || ""}</span></li>))}</ul>
            </ComparisonCard>
          ))}
        </div>
      </div>
    </>
  );
}