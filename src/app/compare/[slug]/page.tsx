"use client";

import { useEffect, useState, useMemo } from "react";
import SimpleHeader from "@/components/SimpleHeader";
import { MotorTitle } from "@/components/compare/MotorTitle";
import { MotorCarousel } from "@/components/compare/MotorCarousel";
import { ComparisonCard } from "@/components/compare/ComparisonCard";
import { compareMotors } from "@/lib/api/motor";
import type { Motor, Specification } from "@/types/motor";
import { useParams } from "next/navigation";
import { InfoBanner } from "@/components/ui/info-banner";

export default function CompareResultPage() {
  const params = useParams(); // 3. Gunakan hook useParams untuk mendapatkan parameter
  const ids = (params.slug as string).split('-vs-'); // 'slug' sesuai nama folder [slug]
  const motor1Id = Number(ids[0]);
  const motor2Id = Number(ids[1]);

  const formatPrice = (price: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);
  const findSpecValue = (specs: Specification[], specName: string) => {
    const spec = specs.find(s => s.specification_item.name === specName);
    return spec ? `${spec.value} ${spec.specification_item.unit || ""}`.trim() : "-";
  }
  const [motor1, setMotor1] = useState<Motor | null>(null);
  const [motor2, setMotor2] = useState<Motor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComparisonData = async () => {
      try {
        setLoading(true);
        const { motor1, motor2 } = await compareMotors(motor1Id, motor2Id);
        setMotor1(motor1);
        setMotor2(motor2);
      } catch (error) {
        console.error(`Gagal memuat data perbandingan`, error);
      } finally {
        setLoading(false);
      }
    };

    if (motor1Id && motor2Id) {
      fetchComparisonData();
    }
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
        <div className="grid grid-cols-2 gap-2 sm:gap-4 items-start sticky top-12 z-10 py-2 mb-2 bg-[#050505]">
          <a href={`/motor/${motor1Id}`}>
            <div className="space-y-4">
              <MotorTitle motor={motor1} loading={loading} />
            </div>
          </a>

          <a href={`/motor/${motor2Id}`}>
            <div className="space-y-4">
              <MotorTitle motor={motor2} loading={loading} />
            </div>
          </a>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-4 items-start mb-4">
          <div className="space-y-4">
            <MotorCarousel motor={motor1} loading={loading} />
          </div>
          <div className="space-y-4">
            <MotorCarousel motor={motor2} loading={loading} />
          </div>
        </div>

        <div className="space-y-2 mt-1">
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
                  <div className="text-xs text-gray-400">Harga</div>
                  <div className="text-xs text-gray-400">Harga</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-xs">{motor1 ? formatPrice(motor1.low_price) : '-'}</span>
                  <span className="text-xs">{motor2 ? formatPrice(motor2.low_price) : '-'}</span>
                </div>
              </div>
            </div>
          </ComparisonCard>

          <ComparisonCard title="Fitur Unggulan" loading={loading}>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1 text-xs">
                {motor1 && motor1.features.length > 0 ? (
                  motor1.features.map(f => <div key={f.id}>{f.feature_item.name}</div>)
                ) : (
                  <div>-</div>
                )}
              </div>

              <div className="space-y-1 text-xs">
                {motor2 && motor2.features.length > 0 ? (
                  motor2.features.map(f => <div key={f.id}>{f.feature_item.name}</div>)
                ) : (
                  <div>-</div>
                )}
              </div>
            </div>
          </ComparisonCard>

          <ComparisonCard title="Warna Tersedia" loading={loading}>
            <div className="grid grid-cols-2">
              <div className="flex">
                {motor1 && motor1.available_colors.length > 0 ? (
                  motor1.available_colors.map(c => (
                    <div key={c.id} className="h-8 w-8 rounded-full border-2 border-white/20 shadow-md p-1" style={{ backgroundColor: c.color.hex }} />
                  ))
                ) : (
                  <div>-</div>
                )}
              </div>

              <div className="flex">
                {motor2 && motor2.available_colors.length > 0 ? (
                  motor2.available_colors.map(c => (
                    <div key={c.id} className="h-8 w-8 rounded-full border-2 border-white/20 shadow-md" style={{ backgroundColor: c.color.hex }} />
                  ))
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
                        <span className="text-xs">{motor1 ? findSpecValue(motor1.specifications, itemName) : '-'}</span>
                        <span className="text-xs">{motor2 ? findSpecValue(motor2.specifications, itemName) : '-'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </ComparisonCard>
            )
          })}
        </div >
      </div >

      <InfoBanner />
    </>
  );
}