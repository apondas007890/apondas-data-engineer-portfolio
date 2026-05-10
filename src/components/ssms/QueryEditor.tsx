"use client"

interface QueryEditorProps {
  value: string
  onChange: (value: string) => void
}

export function QueryEditor({ value, onChange }: QueryEditorProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-full w-full resize-none bg-[#1e1e1e] p-3 font-mono text-[12px] text-[#d4d4d4] outline-none"
      spellCheck={false}
    />
  )
}
