import SimpleHeader from "@/components/SimpleHeader";
import Link from "next/link";
import {
  User, Settings, Info, Factory
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
      title: "Profile",
      description: "Manage your profile settings",
      icon: <User className="text-xl" />,
      href: "/setting/profile",
    },
    {
      title: "Account",
      description: "Security and login settings",
      icon: <Settings className="text-xl" />,
      href: "/setting/account",
    },
    {
      title: "Brand",
      description: "Manage motorcycle brand",
      icon: <Factory className="text-xl" />,
      href: "/setting/brand",
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
