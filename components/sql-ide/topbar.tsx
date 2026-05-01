"use client"

import { MenuBar } from "@/components/sql-ide/MenuBar"
import { TitleBar } from "@/components/sql-ide/TitleBar"
import { ToolBar } from "@/components/sql-ide/ToolBar"

interface TopbarProps {
  onNewQuery: () => void
  onExecute: () => void
  isExecuting: boolean
  currentDatabase: string
  onDatabaseChange: (database: string) => void
}

export function Topbar({
  onNewQuery,
  onExecute,
  isExecuting,
  currentDatabase,
  onDatabaseChange,
}: TopbarProps) {
  const titleText = "APON\\SQLEXPRESS.MyDatabase (APON\\ASUS (70))* - Microsoft SQL Server Management Studio"

  return (
    <div className="flex flex-col">
      <TitleBar title={titleText} />
      <MenuBar />
      <ToolBar
        isExecuting={isExecuting}
        currentDatabase={currentDatabase}
        onDatabaseChange={onDatabaseChange}
        onNewQuery={onNewQuery}
        onExecute={onExecute}
      />
    </div>
  )
}
