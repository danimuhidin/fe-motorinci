// app/compare/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SimpleHeader from "@/components/SimpleHeader";
import { Combobox } from "@/components/ui/combobox"; // Perubahan: Kembali menggunakan Combobox
import { Button } from "@/components/ui/button";
import { getMotors } from "@/lib/api/motor";
import type { Motor } from "@/types/motor";
import { Loader2 } from "lucide-react";

export default function ComparePage() {
  const router = useRouter();
  const [motors, setMotors] = useState<Motor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Perubahan: Kembalikan tipe state ke number
  const [motor1Id, setMotor1Id] = useState<number | undefined>();
  const [motor2Id, setMotor2Id] = useState<number | undefined>();

  useEffect(() => {
    const fetchMotors = async () => {
      try {
        const data = await getMotors();
        setMotors(data);
      } catch (error) {
        console.error("Gagal memuat data motor:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMotors();
  }, []);

  // Format data untuk Combobox
  const motorOptions = motors.map((motor) => ({
    value: motor.id, // Perubahan: value kembali menjadi number
    label: `${motor.brand.name} ${motor.name} ${motor.year_model}`,
  }));

  const handleCompare = () => {
    if (motor1Id && motor2Id) {
      router.push(`/compare/${motor1Id}-vs-${motor2Id}`);
    }
  };

  return (
    <>
      <SimpleHeader title="Komparasi" />
      <div className="p-4 sm:p-6 space-y-6">
        <p className="text-gray-400 text-center">
          Pilih dua motor yang ingin Anda bandingkan spesifikasinya secara berdampingan.
        </p>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin text-red-500" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 items-center">
            <Combobox
              options={motorOptions}
              selectedValue={motor1Id}
              onSelect={setMotor1Id}
              placeholder="Pilih motor pertama..."
              searchPlaceholder="Cari motor (Example: Honda ADV 2022)..."
              notFoundText="Motor tidak ditemukan."
            />
            {/* ----vs----  */}
            <div className="text-center text-gray-500 font-semibold">X</div>
            <Combobox
              options={motorOptions.filter(opt => opt.value !== motor1Id)}
              selectedValue={motor2Id}
              onSelect={setMotor2Id}
              placeholder="Pilih motor kedua..."
              searchPlaceholder="Cari motor (Example: Yamaha NMAX 2022)..."
              notFoundText="Motor tidak ditemukan."
            />
          </div>
        )}
        
        <Button
          onClick={handleCompare}
          disabled={!motor1Id || !motor2Id || loading}
          className="w-full bg-red-600 hover:bg-red-700"
        >
          Bandingkan Sekarang
        </Button>
      </div>
    </>
  );
}