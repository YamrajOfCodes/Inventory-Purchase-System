import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1714]/30 backdrop-blur-sm">
      <div className="flex items-center gap-3 rounded-xl bg-white px-6 py-4 shadow-2xl ring-1 ring-black/5">
        <Loader2 className="h-5 w-5 animate-spin text-[#C8A96E]" />
        <span className="text-sm font-medium text-[#1A1714]">Loading…</span>
      </div>
    </div>
  );
}