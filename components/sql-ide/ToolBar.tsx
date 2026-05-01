"use client"

import { useState } from "react"
import { useTheme } from "@/app/page"

interface ToolBarProps {
  isExecuting: boolean
  currentDatabase: string
  onDatabaseChange: (database: string) => void
  onNewQuery: () => void
  onExecute: () => void
}

function Divider() {
  return <div className="mx-1 h-[20px] w-[6px]" />
}

function IconButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="flex h-[22px] w-[22px] cursor-pointer items-center justify-center text-[#d1d1d1] hover:bg-[#3a3a40]">
      {children}
    </button>
  )
}

function RowGrip() {
  return (
    <div className="mr-2 flex h-[24px] w-[14px] items-center justify-center">
      <div className="grid grid-cols-2 gap-[2px]">
        {Array.from({ length: 12 }).map((_, i) => (
          <span key={i} className="h-[2px] w-[2px] rounded-full bg-[#3c3c3c]" />
        ))}
      </div>
    </div>
  )
}

function Glyph({ color = "#bfbfbf" }: { color?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="2.5" y="2.5" width="11" height="11" rx="1" fill="none" stroke={color} strokeWidth="1" />
      <path d="M5 8h6M8 5v6" stroke={color} strokeWidth="1" />
    </svg>
  )
}

function ToolbarRowOne({ onNewQuery }: { onNewQuery: () => void }) {
  return (
    <div className="flex h-[31px] items-center bg-[#2d2d30] px-1">
      <RowGrip />
      <IconButton><Glyph /></IconButton>
      <IconButton><Glyph color="#7aa6d9" /></IconButton>
      <IconButton><Glyph color="#9f9f9f" /></IconButton>
      <IconButton><Glyph color="#c8a84b" /></IconButton>
      <Divider />
      <IconButton><Glyph color="#7aa6d9" /></IconButton>
      <IconButton><Glyph color="#9f9f9f" /></IconButton>
      <IconButton><Glyph color="#9f9f9f" /></IconButton>
      <Divider />

      <button
        onClick={onNewQuery}
        className="flex h-[22px] cursor-pointer items-center gap-1 px-2 text-[12px] text-[#ececec] hover:bg-[#3a3a40]"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
          <rect x="2.5" y="2" width="8.8" height="11.5" rx="1" fill="#dcdcdc" />
          <path d="M11.8 7.8h3M13.3 6.2v3.2" stroke="#35c56a" strokeWidth="1.4" />
        </svg>
        <span>New Query</span>
      </button>

      <IconButton><Glyph color="#d0d0d0" /></IconButton>
      <IconButton><Glyph color="#d0d0d0" /></IconButton>
      <IconButton><Glyph color="#d0d0d0" /></IconButton>
      <IconButton><Glyph color="#d0d0d0" /></IconButton>
      <Divider />
      <IconButton><Glyph color="#6fa2dd" /></IconButton>
      <IconButton><Glyph color="#7f7f7f" /></IconButton>
      <IconButton><Glyph color="#7f7f7f" /></IconButton>
      <Divider />
      <IconButton><Glyph color="#d0d0d0" /></IconButton>
      <IconButton><Glyph color="#d0d0d0" /></IconButton>
      <Divider />

      <button className="flex h-[24px] min-w-[240px] cursor-pointer items-center border border-[#4a4a50] bg-[#222226] px-2 text-left text-[12px] text-[#d9d9d9] hover:bg-[#2c2c31]">
        {"PRINT '>>>>' + CAST(@RowCo..."}
        <span className="ml-auto text-[#8e8e8e]">▾</span>
      </button>

      <Divider />
      <IconButton><Glyph color="#b485d7" /></IconButton>
      <IconButton><Glyph /></IconButton>
      <IconButton><Glyph color="#bfbfbf" /></IconButton>
      <IconButton><Glyph /></IconButton>
    </div>
  )
}

function ToolbarRowTwo({
  isExecuting,
  currentDatabase,
  onDatabaseChange,
  onExecute,
}: Pick<ToolBarProps, "isExecuting" | "currentDatabase" | "onDatabaseChange" | "onExecute">) {
  return (
    <div className="flex h-[32px] items-center bg-[#2d2d30] px-1">
      <RowGrip />
      <IconButton><Glyph color="#7f7f7f" /></IconButton>
      <IconButton><Glyph color="#7f7f7f" /></IconButton>
      <Divider />

      <select
        value={currentDatabase}
        onChange={(e) => onDatabaseChange(e.target.value)}
        className="h-[25px] min-w-[290px] cursor-pointer border border-[#4a4a50] bg-[#222226] px-2 text-[12px] text-[#e2e2e2] outline-none"
      >
        <option>Portfolio</option>
        <option>MyDatabase</option>
        <option>DataWarehouse</option>
        <option>master</option>
      </select>

      <Divider />

      <button
        onClick={onExecute}
        disabled={isExecuting}
        className={`flex h-[22px] cursor-pointer items-center gap-1 px-2 text-[12px] text-[#ececec] hover:bg-[#3a3a40] ${
          isExecuting ? "opacity-60" : ""
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4.2 2.8v10.5L13 8z" fill="#37c96d" />
        </svg>
        <span>Execute</span>
      </button>

      <Divider />
      <IconButton><Glyph color="#d6d6d6" /></IconButton>
      <IconButton><Glyph color="#d6d6d6" /></IconButton>
      <IconButton><Glyph color="#d6d6d6" /></IconButton>
      <Divider />
      <IconButton><Glyph color="#d6d6d6" /></IconButton>
      <IconButton><Glyph color="#7ac983" /></IconButton>
      <IconButton><Glyph color="#d6d6d6" /></IconButton>
      <Divider />
      <IconButton><Glyph color="#d6d6d6" /></IconButton>
      <IconButton><Glyph color="#d6d6d6" /></IconButton>
      <IconButton><Glyph color="#d6d6d6" /></IconButton>
      <IconButton><Glyph color="#d6d6d6" /></IconButton>
      <Divider />
      <IconButton><Glyph color="#7ac983" /></IconButton>
      <IconButton><Glyph color="#6fa2dd" /></IconButton>
      <IconButton><Glyph color="#6fa2dd" /></IconButton>
      <Divider />
      <IconButton><Glyph color="#6fa2dd" /></IconButton>
      <IconButton><Glyph color="#6fa2dd" /></IconButton>
      <IconButton><Glyph color="#bfbfbf" /></IconButton>
    </div>
  )
}

function SqlShadesRow() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex h-[30px] items-center bg-[#2d2d30] px-1">
      <RowGrip />
      <div className="relative">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex h-[22px] cursor-pointer items-center gap-1 px-1.5 text-[12px] text-[#c7c7c7] hover:bg-[#35353b]"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
            <rect x="1" y="1" width="14" height="14" rx="2" fill="rgba(182, 182, 211, 1)" />
            <rect x="2.2" y="2.6" width="8" height="2.1" rx="0.8" fill="#273b3c" />
            <rect x="2.2" y="6.3" width="8" height="2.1" rx="0.8" fill="#273b3c" />
            <rect x="2.2" y="10" width="8" height="2.1" rx="0.8" fill="#273b3c" />
            <path d="M11.5 4.5a4.2 4.2 0 1 1-2.8 7.4 3.4 3.4 0 1 0 2.8-7.4z" fill="#273b3c" />
          </svg>
          <span>SQL Shades</span>
          <span className="ml-0.5 flex flex-col items-center leading-[8px] text-[#9f9f9f]">
            <span className="text-[10px]">-</span>
            <span className="text-[10px]">▾</span>
          </span>
        </button>

        {isOpen && (
          <div className="absolute left-0 top-full z-30 mt-1 min-w-[98px] border border-[#4a4a4a] bg-[#232327] py-1 text-[11px]">
            <button
              onClick={() => {
                setTheme("dark")
                setIsOpen(false)
              }}
              className={`flex w-full items-center px-2 py-1 text-left hover:bg-[#35353b] ${
                theme === "dark" ? "text-[#e0e0e0]" : "text-[#b7b7b7]"
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => {
                setTheme("light")
                setIsOpen(false)
              }}
              className={`flex w-full items-center px-2 py-1 text-left hover:bg-[#35353b] ${
                theme === "light" ? "text-[#e0e0e0]" : "text-[#b7b7b7]"
              }`}
            >
              Light
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function ToolBar(props: ToolBarProps) {
  return (
    <div className="flex flex-col">
      <ToolbarRowOne onNewQuery={props.onNewQuery} />
      <ToolbarRowTwo
        isExecuting={props.isExecuting}
        currentDatabase={props.currentDatabase}
        onDatabaseChange={props.onDatabaseChange}
        onExecute={props.onExecute}
      />
      <SqlShadesRow />
    </div>
  )
}
