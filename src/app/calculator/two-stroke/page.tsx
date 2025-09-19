import SimpleHeader from "@/components/SimpleHeader";
import Link from "next/link";

export default function Calculator() {
  const MenuSettings = [
    {
      title: "Volume Kapasitas Silinder",
      description: "Volume Kapasitas Silinder / Cylinder Capacity Volume",
      href: "/calculator/four-stroke/cylinder-capacity",
    },
    {
      title: "Rasio Kompresi",
      description: "Rasio Kompresi / Compression Ratio",
      href: "/calculator/four-stroke/compression-ratio",
    },
    {
      title: "Cleareance",
      description: "Cleareance",
      href: "/calculator/four-stroke/clearance",
    },
    {
      title: "Squish Head",
      description: "Squish Head",
      href: "/calculator/four-stroke/squish-head",
    },
    {
      title: "Durasi Mesin 2 Tak",
      description: "Durasi Mesin 2 Tak / 2 Stroke Engine Duration",
      href: "/calculator/four-stroke/duration-2-stroke",
    },
    {
      title: "Porting Polish",
      description: "Porting Polish",
      href: "/calculator/four-stroke/porting-polish",
    },
    {
      title: "Piston Speed",
      description: "Piston Speed",
      href: "/calculator/four-stroke/piston-speed",
    },
    {
      title: "Batas Aman Putaran Mesin",
      description: "Batas Aman Putaran Mesin / Safe Engine RPM",
      href: "/calculator/four-stroke/safe-engine-rpm",
    },
    {
      title: "Diameter Ideal Karburator 2 Tak",
      description: "Diameter Ideal Karburator 2 Tak / Ideal Carburetor Diameter for 2 Stroke",
      href: "/calculator/four-stroke/ideal-carburetor-diameter-2-stroke",
    },
    {
      title: "Potensi Top Speed",
      description: "Potensi Top Speed",
      href: "/calculator/four-stroke/top-speed-potential",
    },
    {
      title: "Rasio Transmisi/Rasio Final Gear",
      description: "Rasio Transmisi/Rasio Final Gear",
      href: "/calculator/four-stroke/transmission-ratio",
    }
  ];
  return (
    <div className="min-h-screen">
      <SimpleHeader title="Mesin 2 Tak" backUrl="/calculator" />
      <div className="pt-2 pb-18">
        <div className="mb-5">
          <ul className="divide-y divide-white/20">
            {MenuSettings.map((setting) => (
              <li key={setting.title} className="active:bg-white/10">
                <Link href={setting.href} className="flex items-center justify-between p-3">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h1 className="text-sm font-medium">{setting.title}</h1>
                      <p className="text-xs text-white/70">{setting.description}</p>
                    </div>
                  </div>
                  <i className="lucide lucide-chevron-right" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
