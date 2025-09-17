// components/home/Hero.tsx
import Image from "next/image";
import { Search } from "lucide-react";

interface HeroProps {
  onSearchClick: () => void;
}

export function Hero({ onSearchClick }: HeroProps) {
  return (
    <div className="relative w-full h-[200px] sm:h-[250px] overflow-hidden rounded-b-lg">
      <Image
        src="/banner.png"
        alt="Hero Banner"
        fill
        priority
        style={{ objectFit: "contain", top: -10 }}
        className=""
      />
      <div className="absolute inset-0 flex flex-col justify-between p-4 z-10 text-white">
        <div className="flex justify-between items-center w-full">
          <Image
            src="/motorinci.png"
            alt="Motorinci Logo"
            width={40}
            height={30}
            className="h-auto"
          />
          <Search className="h-6 w-6 cursor-pointer" onClick={onSearchClick} />
        </div>
      </div>
    </div>
  );
}