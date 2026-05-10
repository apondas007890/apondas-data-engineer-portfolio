"use client";

import { Icon } from "@iconify/react";
import { useState } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  label?: string;
};

export function IconPicker({ value, onChange, label = "Icon key" }: Props) {
  const [previewError, setPreviewError] = useState(false);
  return (
    <div className="space-y-2">
      <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">{label}</label>
      <div className="flex items-center gap-3">
        <input
          value={value}
          onChange={(e) => {
            setPreviewError(false);
            onChange(e.target.value);
          }}
          placeholder="simple-icons:github"
          className="flex-1 bg-[#101216] border border-white/[0.08] rounded-xl py-2.5 px-3 text-white"
        />
        <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.02] grid place-items-center">
          {!value || previewError ? (
            <span className="text-gray-500 text-xs">N/A</span>
          ) : (
            <Icon icon={value} className="w-5 h-5 text-white" onLoad={() => setPreviewError(false)} />
          )}
        </div>
      </div>
    </div>
  );
}

