import SimpleHeader from "@/components/SimpleHeader";
import { Info, User, GitBranch } from "lucide-react";

export default function AboutPage() {
  const appInfo = {
    name: "MOTORINCI",
    description: "Aplikasi ini dibuat untuk menampilkan katalog motor dari berbagai brand terkemuka.",
    creator: "RWRR.ID",
    version: "1.0.0",
  };

  return (
    <>
      <SimpleHeader title="Tentang Aplikasi" backUrl="/setting" />
      <div className="p-4 sm:p-6 space-y-8">
        <div className="text-center">
          <Info className="mx-auto h-12 w-12 text-white my-4" />
          <h1 className="text-3xl font-bold">{appInfo.name}</h1>
          <p className="text-gray-400 mt-2 text-sm px-2">
            {appInfo.description}
          </p>
        </div>

        <div className="divide-y divide-white/20 rounded-lg border border-white/20 bg-zinc-900/50">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-400" />
              <span className="text-sm">Pembuat</span>
            </div>
            <span className="text-gray-300 text-sm">{appInfo.creator}</span>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <GitBranch className="h-5 w-5 text-gray-400" />
              <span className="text-sm">Versi</span>
            </div>
            <span className="text-gray-300 text-sm">{appInfo.version}</span>
          </div>
        </div>
      </div>
    </>
  );
}