"use client"

interface ObjectTreeNodeProps {
  label: string
  dataType?: string
  selected?: boolean
}

export function ObjectTreeNode({ label, dataType, selected = false }: ObjectTreeNodeProps) {
  return (
    <div className={`flex items-center justify-between px-2 py-0.5 text-[11px] ${selected ? "bg-[#2f4f6a]" : ""}`}>
      <span className="truncate">{label}</span>
      {dataType ? <span className="ml-3 font-mono text-[10px] text-[#9ca3af]">{dataType}</span> : null}
    </div>
  )
}
