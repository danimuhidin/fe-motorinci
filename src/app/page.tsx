// src/app/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Hero } from "@/components/home/Hero";
import Autoplay from "embla-carousel-autoplay";
import { SearchModal } from "@/components/home/SearchModal";
import { getHomePageData } from "@/lib/api/motor";
import type { Motor } from "@/types/motor";
import type { Category } from "@/types/category";
import type { Brand } from "@/types/brand";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";

const API_PUBLIC_URL = process.env.NEXT_PUBLIC_API_PUBLIC_URL;

export default function HomePage() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [randomMotors, setRandomMotors] = useState<Motor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const data = await getHomePageData();
        setRandomMotors(data.randomMotors);
        setCategories(data.categories);
        setBrands(data.brands);
      } catch (error) {
        console.error("Gagal memuat data halaman utama:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  return (
    <div className="min-h-screen pb-16">
      <Hero onSearchClick={() => setIsSearchModalOpen(true)} />

      <div className="pt-0 p-4 space-y-8">
        <section>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin text-red-500" size={32} />
            </div>
          ) : (
            <Carousel
              plugins={[autoplayPlugin.current]}
              opts={{
                loop: true,
                align: "start",
              }}
              className="w-full"
            >
              <CarouselContent>
                {randomMotors.map((motor) => (
                  <CarouselItem key={motor.id} className="shrink-0">
                    <Link href={`/motor/${motor.id}`}>
                      <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-zinc-800">
                        {motor.images && motor.images.length > 0 ? (
                          <Image
                            src={`${API_PUBLIC_URL}${motor.images[0].image_url}`}
                            alt={motor.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <Image
                            src="/imagenotfound.png"
                            alt="Gambar tidak tersedia"
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                            style={{ objectFit: "contain" }}
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-2 flex items-end">
                          <p className="text-white text-sm font-semibold">{motor.brand.name} {motor.name} {motor.year_model} </p>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 bg-black/50 border-white/20 hover:bg-black/80" />
              <CarouselNext className="right-2 bg-black/50 border-white/20 hover:bg-black/80" />
            </Carousel>
          )}
        </section>


        <section>
          <h2 className="text-lg font-bold mb-4">Jelajahi Kategori</h2>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin text-red-500" size={32} />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link key={category.id} href={`/category/${category.id}`}>
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-zinc-800 group">
                    {category.image ? ( // Asumsi category.image adalah URL gambar
                      <Image
                        src={`${API_PUBLIC_URL}${category.image}`}
                        alt={category.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        style={{ objectFit: "cover" }}
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <Image
                        src="/imagenotfound.png"
                        alt="Gambar tidak tersedia"
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        style={{ objectFit: "contain" }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex items-end justify-center">
                      <p className="text-white text-base font-semibold">{category.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-bold mb-4">Jelajahi Brand</h2>
          {loading ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="animate-spin text-red-500" size={32} />
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {brands.map((brand) => (
                <Link key={brand.id} href={`/brand/${brand.id}`}>
                  <div className="relative aspect-square w-full rounded-lg bg-zinc-800 p-4 flex items-center justify-center transition-transform duration-300 hover:scale-105 hover:bg-zinc-700">
                    {brand.icon ? (
                      <Image
                        src={`${API_PUBLIC_URL}${brand.icon}`}
                        alt={brand.name}
                        fill
                        sizes="(max-width: 640px) 33vw, 25vw"
                        style={{ objectFit: "contain" }}
                      />
                    ) : (
                      // Fallback jika tidak ada ikon
                      <span className="text-white font-semibold text-center text-sm">{brand.name}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </div>
  );
}