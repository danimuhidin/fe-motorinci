import SimpleHeader from "@/components/SimpleHeader";
import Link from "next/link";

export default function Calculator() {
  const MenuSettings = [
    {
      title: "Mesin 4 Tak",
      description: "Mesin 4 Tak / Four Stroke Engine",
      href: "/calculator/four-stroke",
    },
    {
      title: "Mesin 2 Tak",
      description: "Mesin 2 Tak / Two Stroke Engine",
      href: "/calculator/two-stroke",
    }
  ];
  return (
    <div className="min-h-screen">
      <SimpleHeader title="Kalkulator" />
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
