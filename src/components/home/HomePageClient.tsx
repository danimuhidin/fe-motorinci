"use client";

import { useState, useRef } from "react";
import { Hero } from "@/components/home/Hero";
import Autoplay from "embla-carousel-autoplay";
import { SearchModal } from "@/components/home/SearchModal";
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

const API_PUBLIC_URL = process.env.NEXT_PUBLIC_API_PUBLIC_URL;

interface HomePageClientProps {
    randomMotors: Motor[];
    categories: Category[];
    brands: Brand[];
}

export function HomePageClient({ randomMotors, categories, brands }: HomePageClientProps) {
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    const autoplayPlugin = useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })
    );

    return (
        <div className="min-h-screen pb-16">
            <Hero onSearchClick={() => setIsSearchModalOpen(true)} />

            <div className="pt-0 p-4 space-y-8">
                <section>
                    <Carousel
                        plugins={[autoplayPlugin.current]}
                        opts={{ loop: true, align: "start" }}
                        className="w-full"
                    >
                        <CarouselContent>
                            {randomMotors.map((motor) => (
                                <CarouselItem key={motor.id} className="shrink-0">
                                    <Link href={`/motor/${motor.id}`}>
                                        <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-zinc-800">
                                            {motor.images && motor.images.length > 0 ? (
                                                <Image
                                                    src={`${API_PUBLIC_URL}${motor.images[0].image}`}
                                                    alt={motor.name}
                                                    fill
                                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                                                    style={{ objectFit: "cover" }}
                                                    priority
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
                                                <p className="text-white text-sm font-semibold">{motor.brand.name} {motor.name} {motor.year_model}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2 bg-black/50 border-white/20 hover:bg-black/80" />
                        <CarouselNext className="right-2 bg-black/50 border-white/20 hover:bg-black/80" />
                    </Carousel>
                </section>

                <section>
                    <h2 className="text-lg font-bold mb-4">Jelajahi Kategori</h2>
                    <div className="grid grid-cols-2 grid-cols-3 gap-4">
                        {categories.map((category) => (
                            <Link key={category.id} href={`/category/${category.id}`}>
                                <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-zinc-800 group">
                                    {category.image ? (
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
                </section>

                <section>
                    <h2 className="text-lg font-bold mb-4">Jelajahi Brand</h2>
                    <div className="grid grid-cols-3 grid-cols-4 gap-4">
                        {brands.map((brand) => (
                            <Link key={brand.id} href={`/brand/${brand.id}`}>
                                <div className="relative aspect-square w-full rounded-lg bg-zinc-800 p-4 flex items-center justify-center transition-transform duration-300 hover:scale-105 hover:bg-zinc-700 overflow-hidden">
                                    {brand.icon ? (
                                        <Image
                                            src={`${API_PUBLIC_URL}${brand.icon}`}
                                            alt={brand.name}
                                            fill
                                            sizes="(max-width: 640px) 33vw, 25vw"
                                            style={{ objectFit: "contain" }}
                                        />
                                    ) : (
                                        <span className="text-white font-semibold text-center text-sm">{brand.name}</span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>

            <SearchModal
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
            />
        </div>
    );
}