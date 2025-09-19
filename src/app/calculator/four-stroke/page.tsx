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
      title: "Noken As",
      description: "Noken As / Camshaft",
      href: "/calculator/four-stroke/camshaft",
    },
    {
      title: "Porting Polish",
      description: "Porting Polish / Porting Polish",
      href: "/calculator/four-stroke/porting-polish",
    },
    {
      title: "Klep",
      description: "Klep / Valve",
      href: "/calculator/four-stroke/valve",
    },
    {
      title: "Per Klep",
      description: "Per Klep / Valve Spring",
      href: "/calculator/four-stroke/valve-spring",
    },
    {
      title: "Rasio Kompresi",
      description: "Rasio Kompresi / Compression Ratio",
      href: "/calculator/four-stroke/compression-ratio",
    },
    {
      title: "Effective Stroke",
      description: "Effective Stroke / Effective Stroke",
      href: "/calculator/four-stroke/effective-stroke",
    },
    {
      title: "Kruk As",
      description: "Kruk As / Crankshaft",
      href: "/calculator/four-stroke/crankshaft",
    },
    {
      title: "Piston Speed",
      description: "Piston Speed / Piston Speed",
      href: "/calculator/four-stroke/piston-speed",
    },
    {
      title: "Batas Aman Putaran Mesin",
      description: "Batas Aman Putaran Mesin / Safe Engine RPM",
      href: "/calculator/four-stroke/safe-engine-rpm",
    },
    {
      title: "Gap Ring Piston",
      description: "Gap Ring Piston / Piston Ring Gap",
      href: "/calculator/four-stroke/piston-ring-gap",
    },
    {
      title: "Panjang Pickup Motor",
      description: "Panjang Pickup Motor / Motorcycle Pickup Length",
      href: "/calculator/four-stroke/motorcycle-pickup-length",
    },
    {
      title: "Injektor Bahan Bakar",
      description: "Injektor Bahan Bakar / Fuel Injector",
      href: "/calculator/four-stroke/fuel-injector",
    },
    {
      title: "Karburator/Trottle Body",
      description: "Carburetor/Throttle Body",
      href: "/calculator/four-stroke/carburetor",
    },
    {
      title: "Intake Filter",
      description: "Intake Filter / Intake Filter",
      href: "/calculator/four-stroke/intake-filter",
    },
    {
      title: "Knalpot Racing",
      description: "Knalpot Racing / Racing Exhaust",
      href: "/calculator/four-stroke/racing-exhaust",
    },
    {
      title: "Potensi Top Speed",
      description: "Potensi Top Speed / Top Speed Potential",
      href: "/calculator/four-stroke/top-speed-potential",
    },
    {
      title: "Potensi Performa Mesin (DK & Torsi)",
      description: "Potensi Performa Mesin (DK & Torsi) / Engine Performance Potential (HP & Torque)",
      href: "/calculator/four-stroke/engine-performance-potential",
    },
    {
      title: "Rasio Transmisi/Rasio Final Gear",
      description: "Rasio Transmisi/Rasio Final Gear",
      href: "/calculator/four-stroke/transmission-ratio",
    }
  ];
  return (
    <div className="min-h-screen">
      <SimpleHeader title="Mesin 4 Tak" backUrl="/calculator" />
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
