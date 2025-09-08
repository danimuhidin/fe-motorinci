import SimpleHeader from "@/components/SimpleHeader";
import Link from "next/link";
import {
  Info, Factory, ListCollapse, Palette, Group, Box, CircleStar
} from "lucide-react";

export default function Setting() {
  const GeneralSettings = [
    {
      title: "About App",
      description: "Learn more about the app",
      icon: <Info className="text-xl" />,
      href: "/setting/about",
    },
  ];
  const MenuSettings = [
    {
      title: "Brand",
      description: "Manage data brand",
      icon: <Factory className="text-xl" />,
      href: "/setting/brand",
    },
    {
      title: "Category",
      description: "Manage data category",
      icon: <ListCollapse className="text-xl" />,
      href: "/setting/category",
    },
    {
      title: "Color",
      description: "Manage data color",
      icon: <Palette className="text-xl" />,
      href: "/setting/color",
    },
    {
      title: "Feature",
      description: "Manage data feature",
      icon: <CircleStar className="text-xl" />,
      href: "/setting/feature",
    },
    {
      title: "Specification Group",
      description: "Manage data specification group",
      icon: <Group className="text-xl" />,
      href: "/setting/specification-group",
    },
    {
      title: "Specification Item",
      description: "Manage data specification item",
      icon: <Box className="text-xl" />,
      href: "/setting/specification-item",
    },
  ];

  return (
    <>
      <SimpleHeader title="Setting" />
      <div className="pt-4 pb-18 px-4">
        <div className="mb-5">
          <h1 className="text-base font-medium">General</h1>
          <ul className="divide-y divide-white/20">
            {GeneralSettings.map((setting) => (
              <li key={setting.title} className="active:bg-white/10">
                <Link href={setting.href} className="flex items-center justify-between p-3">
                  <div className="flex items-center space-x-3">
                    {setting.icon}
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

        {process.env.NEXT_ADMINISTRATOR_OR_NOT === 'true' && (
          <div className="mb-5">
            <h1 className="text-base font-medium">Administrator</h1>
            <ul className="divide-y divide-white/20">
              {MenuSettings.map((setting) => (
                <li key={setting.title} className="active:bg-white/10">
                  <Link href={setting.href} className="flex items-center justify-between p-3">
                    <div className="flex items-center space-x-3">
                      {setting.icon}
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
        )}
      </div>
    </>
  );
}
