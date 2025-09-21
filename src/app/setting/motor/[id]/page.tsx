// app/setting/motor/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight, FileText, ImageIcon, Star, Wrench, Palette } from "lucide-react";
import SimpleHeader from "@/components/SimpleHeader";
import { getMotorById } from "@/lib/api/motor";
import type { Motor } from "@/types/motor";

// Array untuk item menu agar mudah dikelola
const menuItems = [
    { href: "general", icon: FileText, label: "Informasi Umum", description: "Edit nama, tahun, harga, dll." },
    { href: "images", icon: ImageIcon, label: "Gambar", description: "Kelola galeri gambar motor." },
    { href: "features", icon: Star, label: "Fitur", description: "Atur fitur unggulan motor." },
    { href: "specifications", icon: Wrench, label: "Spesifikasi", description: "Kelola detail spesifikasi teknis." },
    { href: "colors", icon: Palette, label: "Warna", description: "Atur warna yang tersedia." }
];

export default function MotorSettingsMenuPage() {
  const params = useParams();
  const motorId = Number(params.id);
  const [motor, setMotor] = useState<Motor | null>(null);

  useEffect(() => {
    const fetchMotorName = async () => {
      try {
        const data = await getMotorById(motorId);
        setMotor(data);
      } catch (error) {
        console.error("Gagal mengambil data motor:", error);
      }
    };
    if (motorId) fetchMotorName();
  }, [motorId]);

  const motorName = motor ? `${motor.brand.name} ${motor.name}` : "Memuat...";

  return (
    <>
      <SimpleHeader title={motorName} backUrl="/setting/motor" />
      <div className="p-4 sm:p-6">
        <p className="text-gray-400 mb-4">Pilih bagian mana dari motor ini yang ingin Anda kelola.</p>
        <div className="space-y-3">
          {menuItems.map((item) => (
            <Link key={item.href} href={`/setting/motor/${motorId}/${item.href}`}>
              <div className="flex items-center justify-between p-4 bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-white/20 transition-colors mb-3">
                <div className="flex items-center gap-4">
                  <item.icon className="h-6 w-6 text-red-500" />
                  <div>
                    <p className="font-semibold">{item.label}</p>
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-500" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}