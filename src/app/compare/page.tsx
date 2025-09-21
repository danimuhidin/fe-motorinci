// app/compare/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SimpleHeader from "@/components/SimpleHeader";
import { Button } from "@/components/ui/button";
import { MotorSearchCombobox } from "@/components/ui/MotorSearchCombobox"; // Impor komponen baru
import type { Motor } from "@/types/motor";

export default function ComparePage() {
  const router = useRouter();
  
  const [motor1, setMotor1] = useState<Motor | undefined>();
  const [motor2, setMotor2] = useState<Motor | undefined>();

  const handleCompare = () => {
    if (motor1 && motor2) {
      router.push(`/compare/${motor1.id}-vs-${motor2.id}`);
    }
  };

  return (
    <>
      <SimpleHeader title="Komparasi Motor" />
      <div className="p-4 sm:p-6 space-y-6">
        <p className="text-gray-300 text-center text-sm">
          Pilih dua motor yang ingin Anda bandingkan spesifikasinya secara berdampingan.
        </p>

        <div className="grid grid-cols-1 gap-4 items-center">
          <MotorSearchCombobox
            selectedValue={motor1}
            onSelect={setMotor1}
            excludeId={motor2?.id}
            placeholder="Pilih motor pertama..."
          />
          <MotorSearchCombobox
            selectedValue={motor2}
            onSelect={setMotor2}
            excludeId={motor1?.id}
            placeholder="Pilih motor kedua..."
          />
        </div>
        
        <Button
          onClick={handleCompare}
          disabled={!motor1 || !motor2}
          className="w-full bg-red-600 hover:bg-red-700"
        >
          Komparasi
        </Button>
      </div>
    </>
  );
}