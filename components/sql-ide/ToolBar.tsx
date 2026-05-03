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
    <button className="flex h-[22px] w-[22px] cursor-default items-center justify-center text-[#d1d1d1] hover:bg-[#3a3a40]">
      {children}
    </button>
  )
}

function RowGrip() {
  return (
    <div className="mr-1 flex h-[24px] w-[12px] items-center justify-center">
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

function CircleNavArrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="9" cy="9" r="7.2" fill="#5a5a59" />
      {dir === "left" ? (
        <path
          d="M12.8 9H6.3M6.3 9 8.9 6.4M6.3 9 8.9 11.6"
          fill="none"
          stroke="#282827"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M5.2 9h6.5M11.7 9 9.1 6.4M11.7 9 9.1 11.6"
          fill="none"
          stroke="#282827"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}

function TinyDownArrow() {
  return (
    <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
      <path d="M1 2.5h6L4 5.8z" fill="#c7c7c7" />
    </svg>
  )
}

function NewFileIcon({ disabled = false }: { disabled?: boolean }) {
  const strokeBack = disabled ? "#6e727a" : "#cfd4df"
  const strokeFront = disabled ? "#8b8f98" : "#f3f5f8"
  const star = disabled ? "#848892" : "#e6ad3f"
  const fold = disabled ? "#7a7e87" : "#d8dbe2"
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" opacity={disabled ? 0.45 : 1}>
      <path d="M4.6 5.4h6.1v10H4.6z" fill="none" stroke={strokeBack} strokeWidth="1.35" />
      <path d="M8.2 3.8h6.4l2.1 2.2v9.9H8.2z" fill="none" stroke={strokeFront} strokeWidth="1.35" />
      <path d="M14.6 3.8V6h2.1" fill="none" stroke={fold} strokeWidth="1.2" />
      <g transform="translate(1.5,1.1)" stroke={star} strokeWidth="1.25" strokeLinecap="round">
        <path d="M4.2 0v5.8" />
        <path d="M1.3 1.1 7 4.6" />
        <path d="M1.3 4.6 7 1.1" />
        <path d="M1.2 2.9h6" />
      </g>
    </svg>
  )
}

function FolderOpenIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3.2 7h4.9l1.2-1.7h7.3v2H3.2z" fill="#d79b43" />
      <path d="M3.2 8h13.6l-1.5 6.2H4.1z" fill="#f0b44f" />
      <path d="M12.8 3.4c1.9 0 3.3 1.4 3.3 3.2" fill="none" stroke="#4fb0f2" strokeWidth="1.6" />
      <path d="M14.6 3.2 16.9 3l-.9 2" fill="none" stroke="#4fb0f2" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SaveIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3.7 3.7h10.4l2 2.1v10.4H3.7z" fill="#5b5d63" />
      <path d="M6 3.7h6v3.1H6z" fill="#7b7e85" />
      <rect x="6" y="9.8" width="7.6" height="4.1" fill="#4d4f55" />
    </svg>
  )
}

function SolutionIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5 6h8.5l1.3 1.2v8H5z" fill="#46aaf1" />
      <path d="M7.1 6h4.4v2H7.1z" fill="#a8dbff" />
      <path d="M8 3.8h8.2l1.3 1.2v7.8H8z" fill="#65c0ff" />
      <path d="M10.1 3.8h4.3v2h-4.3z" fill="#c6ebff" />
      <path d="M11.2 10.2h3.8M9.4 8.6h3.8" stroke="#233849" strokeWidth="0.9" />
    </svg>
  )
}

function FileDocIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 1.8h6.6L13 5.2v9H3z" fill="none" stroke="#d8d8d8" strokeWidth="1.2" />
      <path d="M9.6 1.8v3.4H13" fill="none" stroke="#d8d8d8" strokeWidth="1.2" />
      <path d="M5.2 7h5.6M5.2 9h5.6M5.2 11h4.1" stroke="#aeb3ba" strokeWidth="1" />
    </svg>
  )
}


function ToolbarRowOne({ onNewQuery }: { onNewQuery: () => void }) {
  return (
    <div className="flex h-[31px] items-center bg-[#2d2d30] pl-0 pr-1">
      <RowGrip />
      <button className="flex h-[22px] w-[22px] cursor-default items-center justify-center hover:bg-[#34343a]">
        <CircleNavArrow dir="left" />
      </button>
      <button className="mx-[2px] flex h-[22px] w-[16px] cursor-default items-center justify-center hover:bg-[#34343a]">
        <TinyDownArrow />
      </button>
      <button className="flex h-[22px] w-[22px] cursor-default items-center justify-center hover:bg-[#34343a]">
        <CircleNavArrow dir="right" />
      </button>
      <div className="mx-1 h-[20px] w-px bg-[#4a4a4a]" />

      <div className="mx-[1px] flex items-center gap-[8px]">
        <div className="flex h-[22px] items-center gap-[2px] hover:bg-[rgba(62,62,64,1)]">
          <button className="flex h-[22px] w-[22px] cursor-default items-center justify-center">
            <img
              src="/toolbar-icons/new-query-icon.png"
              alt=""
              className="h-[16px] w-[16px] object-contain"
              draggable={false}
            />
          </button>
          <button className="flex h-[22px] w-[12px] cursor-default items-center justify-center">
            <TinyDownArrow />
          </button>
        </div>
        <button className="flex h-[22px] w-[40px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]">
          <img
            src="/toolbar-icons/newfile-disabled-combo.png"
            alt=""
            className="h-[16px] w-[40px] object-contain"
            draggable={false}
          />
        </button>
        <button className="flex h-[22px] w-[22px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]">
          <img
            src="/toolbar-icons/open-folder-blue-arrow.png"
            alt=""
            className="h-[16px] w-[16px] object-contain"
            draggable={false}
          />
        </button>
        <button className="flex h-[22px] w-[22px] cursor-default items-center justify-center transition-colors hover:bg-[rgba(62,62,64,1)]">
          <img
            src="/toolbar-icons/solution-blue.png"
            alt=""
            className="h-[16px] w-[16px] object-contain"
            draggable={false}
          />
        </button>
        <div className="flex h-[22px] w-[22px] items-center justify-center opacity-55 hover:bg-[rgba(62,62,64,1)]">
          <img
            src="/toolbar-icons/save-gray.png"
            alt=""
            className="h-[16px] w-[16px] object-contain"
            draggable={false}
          />
        </div>
      </div>
      <div className="mx-1 h-[18px] w-px bg-[#4a4a4a]" />

      <button
        onClick={onNewQuery}
        className="flex h-[22px] cursor-default items-center gap-1.5 px-2 text-[12px] text-[#ececec] hover:bg-[#3a3a40]"
      >
        <FileDocIcon />
        <span>New Query</span>
      </button>

      <button className="ml-[1px] flex h-[22px] w-[22px] cursor-default items-center justify-start pl-[2px] hover:bg-[rgba(62,62,64,1)]">
        <FileDocIcon />
      </button>
      <button className="flex h-[22px] w-[22px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]">
        <img src="/toolbar-icons/mdf-gray.png" alt="" className="h-[16px] w-[16px] object-contain opacity-88" draggable={false} />
      </button>
      <button className="flex h-[22px] w-[22px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]">
        <img src="/toolbar-icons/dmx-gray.png" alt="" className="h-[16px] w-[16px] object-contain opacity-88" draggable={false} />
      </button>
      <button className="flex h-[22px] w-[22px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]">
        <img src="/toolbar-icons/xmla-gray.png" alt="" className="h-[20px] w-[20px] object-contain opacity-88" draggable={false} />
      </button>
      <button className="flex h-[22px] w-[22px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]">
        <img src="/toolbar-icons/dax-gray.png" alt="" className="h-[20px] w-[20px] object-contain opacity-88" draggable={false} />
      </button>
      <div className="mx-1 h-[18px] w-px bg-[#4a4a4a]" />

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

      <button className="flex h-[24px] min-w-[240px] cursor-default items-center border border-[#4a4a50] bg-[#222226] px-2 text-left text-[12px] text-[#d9d9d9] hover:bg-[#2c2c31]">
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
    <div className="flex h-[32px] items-center bg-[#2d2d30] pl-0 pr-1">
      <RowGrip />
      <IconButton><Glyph color="#7f7f7f" /></IconButton>
      <IconButton><Glyph color="#7f7f7f" /></IconButton>
      <Divider />

      <select
        value={currentDatabase}
        onChange={(e) => onDatabaseChange(e.target.value)}
        className="h-[25px] min-w-[290px] cursor-default border border-[#4a4a50] bg-[#222226] px-2 text-[12px] text-[#e2e2e2] outline-none"
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
        className={`flex h-[22px] cursor-default items-center gap-1 px-2 text-[12px] text-[#ececec] hover:bg-[#3a3a40] ${
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
    <div className="flex h-[30px] items-center bg-[#2d2d30] pl-0 pr-1">
      <RowGrip />
      <div className="relative">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex h-[22px] cursor-default items-center gap-1 px-1.5 text-[12px] text-[#c7c7c7] hover:bg-[#35353b]"
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
