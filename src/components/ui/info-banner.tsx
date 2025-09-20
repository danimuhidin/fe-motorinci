import { AlertTriangle } from 'lucide-react';
export function InfoBanner() {
  return (
    <div className={`flex items-center gap-2 rounded-lg border border-yellow-500/30 bg-yellow-900/20 p-2 text-yellow-300 mb-23 mx-4`}>
      <AlertTriangle className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
      <p className="text-xs">Platform ini mungkin dapat menampilkan data motor yang kurang lengkap atau tidak akurat. Pastikan untuk selalu memverifikasi informasi dari sumber resmi.</p>
    </div>
  );
}