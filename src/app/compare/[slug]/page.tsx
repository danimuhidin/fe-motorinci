// app/compare/[slug]/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import SimpleHeader from "@/components/SimpleHeader";
import { MotorTitle } from "@/components/compare/MotorTitle";
import { MotorCarousel } from "@/components/compare/MotorCarousel";
import { ComparisonCard } from "@/components/compare/ComparisonCard";
import { getMotorById } from "@/lib/api/motor";
import type { Motor, Specification } from "@/types/motor";

interface CompareResultPageProps {
  params: { slug: string; };
}

const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
const findSpecValue = (specs: Specification[], specName: string) => {
  const spec = specs.find(s => s.specification_item.name === specName);
  return spec ? `${spec.value} ${spec.specification_item.unit || ""}`.trim() : "-";
}

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

  const specGroups = useMemo(() => {
    if (!motor1 || !motor2) return [];
    const allSpecs = [...motor1.specifications, ...motor2.specifications];
    const groupNames = new Set(allSpecs.map(s => s.specification_item.specification_group.name));
    return Array.from(groupNames);
  }, [motor1, motor2]);

  return (
    <>
      <SimpleHeader
        title="Hasil Perbandingan"
        backUrl="/compare"
        className="sticky top-0 z-20 bg-black/98"
      />

      <div className="p-2 sm:p-4 pt-0 sm:p-0">
        <div className="grid grid-cols-2 gap-2 sm:gap-4 items-start sticky top-12 z-10 pb-2 bg-black/98 pt-2 sm:p-4">
          <div className="space-y-4">
            <MotorTitle motor={motor1} loading={loading} />
          </div>
          <div className="space-y-4">
            <MotorTitle motor={motor2} loading={loading} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-4 items-start mb-4">
          <div className="space-y-4">
            <MotorCarousel motor={motor1} loading={loading} />
          </div>
          <div className="space-y-4">
            <MotorCarousel motor={motor2} loading={loading} />
          </div>
        </div>

        <div className="space-y-2 mt-1 pb-20">
          <ComparisonCard title="Informasi Umum" loading={loading}>
            <div className="space-y-4">
              <div className="border-b border-white/5 pb-1 mb-1">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-xs text-gray-400">Kategori</div>
                  <div className="text-xs text-gray-400">Kategori</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-sm">{motor1?.category.name || '-'}</span>
                  <span className="text-sm">{motor2?.category.name || '-'}</span>
                </div>
              </div>
              <div className="border-b border-white/5 pb-1 mb-1">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-xs text-gray-400">Kapasitas Mesin</div>
                  <div className="text-xs text-gray-400">Kapasitas Mesin</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-sm">{motor1?.engine_cc || '-'} cc</span>
                  <span className="text-sm">{motor2?.engine_cc || '-'} cc</span>
                </div>
              </div>
              <div className="pb-1 mb-0">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-xs text-gray-400">Harga (mulai dari)</div>
                  <div className="text-xs text-gray-400">Harga (mulai dari)</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-sm">{motor1 ? formatPrice(motor1.low_price) : '-'}</span>
                  <span className="text-sm">{motor2 ? formatPrice(motor2.low_price) : '-'}</span>
                </div>
              </div>
            </div>
          </ComparisonCard>

          <ComparisonCard title="Fitur Unggulan" loading={loading}>
            <div className="grid grid-cols-2 gap-2">
              {/* Kolom Motor 1 */}
              <div className="space-y-1 text-sm">
                {motor1 && motor1.features.length > 0 ? (
                  motor1.features.map(f => <div key={f.id}>{f.feature_item.name}</div>)
                ) : (
                  <div>-</div>
                )}
              </div>

              {/* Kolom Motor 2 */}
              <div className="space-y-1 text-sm">
                {motor2 && motor2.features.length > 0 ? (
                  motor2.features.map(f => <div key={f.id}>{f.feature_item.name}</div>)
                ) : (
                  <div>-</div>
                )}
              </div>
            </div>
          </ComparisonCard>

          {specGroups.map(groupName => {
            const specItems = new Set([
              ...(motor1?.specifications.filter(s => s.specification_item.specification_group.name === groupName).map(s => s.specification_item.name) || []),
              ...(motor2?.specifications.filter(s => s.specification_item.specification_group.name === groupName).map(s => s.specification_item.name) || [])
            ]);

            return (
              <ComparisonCard key={groupName} title={groupName} loading={loading}>
                <div className="space-y-4">
                  {Array.from(specItems).map(itemName => (
                    <div key={itemName} className="border-b border-white/5 pb-1 last:border-0 last:pb-0">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-xs text-gray-400">{itemName}</div>
                        <div className="text-xs text-gray-400">{itemName}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-0 font-medium">
                        <span className="text-sm">{motor1 ? findSpecValue(motor1.specifications, itemName) : '-'}</span>
                        <span className="text-sm">{motor2 ? findSpecValue(motor2.specifications, itemName) : '-'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ComparisonCard>
            )
          })}
        </div>
      </div>
    </>
  );
}