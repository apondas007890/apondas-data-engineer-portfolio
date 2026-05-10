"use client"

import { Sidebar } from "@/components/sql-ide/sidebar"

interface ObjectExplorerProps {
  width: number
  selectedNode: string | null
  onWidthChange: (width: number) => void
  onSelectNode: (node: string | null, query?: string) => void
}

export function ObjectExplorer({ width, selectedNode, onWidthChange, onSelectNode }: ObjectExplorerProps) {
  return (
    <Sidebar
      width={width}
      selectedNode={selectedNode}
      onWidthChange={onWidthChange}
      onSelectNode={onSelectNode}
    />
  )
}
