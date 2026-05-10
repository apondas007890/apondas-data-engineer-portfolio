"use client";

import { Upload } from "lucide-react";

type Props = {
  label: string;
  accept?: string;
  onChange: (file: File | null) => void;
};

export function FileUploadBox({ label, accept, onChange }: Props) {
  return (
    <label className="block w-full border border-white/10 rounded-2xl p-4 bg-white/[0.02] cursor-pointer hover:bg-white/[0.04] transition-colors">
      <div className="flex items-center gap-3 text-gray-300">
        <Upload className="w-4 h-4" />
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </label>
  );
}

