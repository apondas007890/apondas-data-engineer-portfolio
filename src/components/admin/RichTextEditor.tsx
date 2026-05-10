"use client";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function RichTextEditor({ value, onChange, placeholder }: Props) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={6}
      placeholder={placeholder}
      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-white font-medium placeholder:text-[#6f7f95] focus:outline-none focus:border-brand-blue/30 transition-all resize-none"
    />
  );
}

