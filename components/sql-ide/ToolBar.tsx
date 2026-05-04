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

function CutIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="4.2" cy="11.1" r="1.6" fill="none" stroke="#bfbfbf" strokeWidth="1" />
      <circle cx="11.8" cy="11.1" r="1.6" fill="none" stroke="#bfbfbf" strokeWidth="1" />
      <path d="M5.4 10 12 3.4M10.6 10 4 3.4" stroke="#bfbfbf" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="3.2" y="4.8" width="6.8" height="7.2" fill="none" stroke="#bfbfbf" strokeWidth="1" />
      <rect x="6" y="2.2" width="6.8" height="7.2" fill="none" stroke="#bfbfbf" strokeWidth="1" />
    </svg>
  )
}

function PasteIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="4.2" y="3.6" width="7.6" height="9.2" fill="none" stroke="#bfbfbf" strokeWidth="1" />
      <rect x="6" y="2" width="4" height="2.2" rx="0.6" fill="none" stroke="#bfbfbf" strokeWidth="1" />
      <path d="M6.2 6.2h3.6M6.2 8.2h3.6M6.2 10.2h2.8" stroke="#bfbfbf" strokeWidth="0.9" />
    </svg>
  )
}

function ActivityMonitorIcon() {
  return (
    <img src="/toolbar-icons/activity-vs.png" alt="" className="h-[18px] w-[18px] object-contain" draggable={false} />
  )
}

function FindInFilesIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 4h5l1.1-1.2H13v2H3z" fill="#d29a45" />
      <path d="M3 5h10v4.6H3z" fill="#f0b44f" />
      <circle cx="6.2" cy="8.45" r="2.1" fill="none" stroke="#57aff0" strokeWidth="1.2" />
      <path d="m7.8 9.95 1.7 1.7" stroke="#57aff0" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function SolutionExplorerIcon() {
  return (
    <img src="/toolbar-icons/solution-explorer-vs.png" alt="" className="h-[18px] w-[18px] object-contain" draggable={false} />
  )
}

function PropertiesWindowIcon() {
  return (
    <img src="/toolbar-icons/properties-wrench.png" alt="" className="h-[13px] w-[13px] object-contain" draggable={false} />
  )
}

function ToolboxIcon() {
  return (
    <img src="/toolbar-icons/toolbox-bag.png" alt="" className="h-[14px] w-[14px] object-contain" draggable={false} />
  )
}

function CommandWindowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="2.3" y="3" width="11.4" height="10" fill="none" stroke="#cfcfcf" strokeWidth="1" />
      <path d="m5 6.1 2 1.9-2 2M8.2 10h2.7" fill="none" stroke="#cfcfcf" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PlugIcon({ withPencil = false }: { withPencil?: boolean }) {
  const plugColor = withPencil ? "#c7c7c7" : "#5f6066"
  return (
    <span className="relative flex h-[17px] w-[17px] items-center justify-center">
      <svg className="h-[16px] w-[16px]" viewBox="0 0 16 16" aria-hidden="true">
        <rect x="4.6" y="1.4" width="2.2" height="3.2" rx="0.8" fill={plugColor} />
        <rect x="9.2" y="1.4" width="2.2" height="3.2" rx="0.8" fill={plugColor} />
        <rect x="3.2" y="4.5" width="9.6" height="3.8" rx="1.2" fill={plugColor} />
        <rect x="4.3" y="7.8" width="7.4" height="1.4" fill={plugColor} />
        <path d="M4.9 9h6.2v1.3c0 1.2-1.1 2.2-2.3 2.2H7.2c-1.2 0-2.3-1-2.3-2.2z" fill={plugColor} />
        <rect x="6.8" y="12.3" width="2.4" height="2.7" rx="0.7" fill={plugColor} />
      </svg>
      {withPencil ? (
        <svg
          className="absolute -left-[3px] top-[1px] h-[10px] w-[10px] rotate-[35deg]"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <rect x="2.2" y="5.8" width="8.1" height="4.2" rx="0.6" fill="#6ba6db" />
          <rect x="9.6" y="5.8" width="2.7" height="4.2" fill="#4f86b8" />
          <path d="M12.3 5.8 14.6 7.9l-2.3 2.1z" fill="#d7deea" />
          <path d="M13.2 7.9 14.6 9.2l-1.1 1z" fill="#23262e" />
        </svg>
      ) : null}
    </span>
  )
}

function UndoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6.3 5.3H3.5m0 0 1.7-1.7M3.5 5.3 5.2 7" fill="none" stroke="#8f8f8f" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.2 5.3h2.5c2.3 0 3.8 1.4 3.8 3.5 0 1.7-1.1 3.1-2.9 3.5" fill="none" stroke="#8f8f8f" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  )
}

function RedoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M9.7 5.3h2.8m0 0-1.7-1.7m1.7 1.7L10.8 7" fill="none" stroke="#8f8f8f" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.8 5.3H7.3C5 5.3 3.5 6.7 3.5 8.8c0 1.7 1.1 3.1 2.9 3.5" fill="none" stroke="#8f8f8f" strokeWidth="1.35" strokeLinecap="round" />
    </svg>
  )
}

function ExecuteSquareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="4.8" y="4.8" width="6.4" height="6.4" fill="#8a8a8a" />
    </svg>
  )
}

function ExecuteCheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3.4 8.2 6.7 11.4 12.8 4.6" fill="none" stroke="#d6d6d6" strokeWidth="2.05" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ExecuteNodesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="1.6" y="1.8" width="3.3" height="3.3" fill="none" stroke="#bfbfbf" strokeWidth="1" />
      <rect x="10.6" y="1.8" width="3.3" height="3.3" fill="none" stroke="#bfbfbf" strokeWidth="1" />
      <rect x="1.6" y="10.6" width="3.3" height="3.3" fill="none" stroke="#bfbfbf" strokeWidth="1" />
      <path d="M4.9 3.45h5.7M3.25 5.1v5.5" stroke="#bfbfbf" strokeWidth="0.95" />
      <path d="M10.6 11.1h3.3l-1.65 2.8z" fill="none" stroke="#bfbfbf" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  )
}

function BoxStackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <rect x="2.8" y="4.1" width="9.2" height="7.8" fill="none" stroke="#bebebe" strokeWidth="1" />
      <rect x="4.9" y="6.1" width="9.2" height="7.8" fill="none" stroke="#bebebe" strokeWidth="1" />
      <path d="M6.1 8.1h6.8M6.1 10h6.8" stroke="#9fa4ac" strokeWidth="0.9" />
    </svg>
  )
}

function ActivePanelIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <rect x="2.3" y="2.2" width="13.4" height="13.6" fill="none" stroke="#8f90c8" strokeWidth="1.1" />
      <rect x="5.2" y="5.1" width="7.6" height="1.1" fill="#bfbfbf" />
      <rect x="5.2" y="7.5" width="7.6" height="1.1" fill="#bfbfbf" />
      <rect x="5.2" y="9.9" width="7.6" height="1.1" fill="#bfbfbf" />
      <rect x="5.2" y="12.3" width="7.6" height="1.1" fill="#bfbfbf" />
    </svg>
  )
}

function EndTableIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <rect x="1.8" y="1.8" width="14.4" height="14.4" fill="none" stroke="#8f90c8" strokeWidth="1.05" />
      <rect x="4.3" y="4.3" width="9.4" height="9.4" fill="none" stroke="#bfc3ca" strokeWidth="0.95" />
      <path d="M4.3 7.4h9.4M4.3 10.6h9.4M7.4 4.3v9.4M10.6 4.3v9.4" stroke="#bfc3ca" strokeWidth="0.85" />
    </svg>
  )
}

function EndSmallSquaresIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <rect x="3.1" y="4.2" width="4.3" height="4.3" fill="none" stroke="#bfc3ca" strokeWidth="1" />
      <rect x="10.4" y="4.2" width="4.3" height="4.3" fill="none" stroke="#bfc3ca" strokeWidth="1" />
      <rect x="3.1" y="10.4" width="4.3" height="4.3" fill="none" stroke="#bfc3ca" strokeWidth="1" />
      <path d="M7.4 6.3h3M5.2 8.5v1.9M7.4 12.5h3" stroke="#9ea3ab" strokeWidth="0.9" />
    </svg>
  )
}

function EndDocIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M2.9 2.2h8.5l3 2.8v10.3H2.9z" fill="none" stroke="#c2c6cd" strokeWidth="1.1" />
      <path d="M11.4 2.2V5h3" fill="none" stroke="#c2c6cd" strokeWidth="1.1" />
      <path d="M5.1 8.2h5.6M5.1 10.4h5.6" stroke="#c2c6cd" strokeWidth="0.95" />
      <path d="m10.4 12.6 2.2 2.1M12.6 14.7h-2.1v-2.1" fill="none" stroke="#c2c6cd" strokeWidth="0.95" />
    </svg>
  )
}

function ServerFrameIcon() {
  return (
    <img src="/toolbar-icons/server-frame-fixed.png" alt="" className="h-[18px] w-[18px] object-contain opacity-100" draggable={false} />
  )
}

function EndGreenLinesIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M3 5.1h7.3M3 8.6h7.3M3 12.1h7.3" stroke="#76c98b" strokeWidth="1.1" />
      <path d="m12.1 6.1 2 2-2 2" fill="none" stroke="#76c98b" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function EndBlueTuneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M3 5.1h12M3 12.9h12" stroke="#6fa2dd" strokeWidth="1" />
      <circle cx="6.2" cy="5.1" r="1.8" fill="none" stroke="#6fa2dd" strokeWidth="1" />
      <circle cx="11.8" cy="12.9" r="1.8" fill="none" stroke="#6fa2dd" strokeWidth="1" />
    </svg>
  )
}

function EndBlueGearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <circle cx="9" cy="9" r="3.1" fill="none" stroke="#6fa2dd" strokeWidth="1" />
      <path d="M9 3.9v1.3M9 12.8v1.3M3.9 9h1.3M12.8 9h1.3" stroke="#6fa2dd" strokeWidth="1" />
      <path d="m4.2 4.5 1 .9M12.8 12.6l1 .9M13.7 4.5l-1 .9M5.2 12.6l-1 .9" stroke="#6fa2dd" strokeWidth="1" />
    </svg>
  )
}

function BlueListArrowIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M2.5 4.1h3.2M2.5 8.0h3.2M2.5 11.9h3.2" stroke="#efefef" strokeWidth="1.1" />
      <path d="M6.8 4.1h8.7M6.8 8.0h8.7M6.8 11.9h8.7" stroke="#efefef" strokeWidth="1.1" />
      <path d="M6.8 6.0h8.7M6.8 9.9h8.7" stroke="#66ca6f" strokeWidth="1.3" />
    </svg>
  )
}

function BlueSliderIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M2.7 4.1h3.1M2.7 8h3.1M2.7 11.9h3.1" stroke="#efefef" strokeWidth="1.1" />
      <path d="M7 4.1h8.4M7 8h8.4M7 11.9h8.4" stroke="#efefef" strokeWidth="1.1" />
      <path d="M6.2 7.9c0-2.3 1.9-4.2 4.2-4.2s4.2 1.9 4.2 4.2c0 1.7-1 3.1-2.5 3.8" fill="none" stroke="#4fa6ff" strokeWidth="1.25" />
      <path d="m10.8 11.9 1.9-.1-1.1 1.5" fill="none" stroke="#4fa6ff" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BlueSwapIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M2.4 4.2h4.2M2.4 8h4.2M2.4 11.8h4.2" stroke="#efefef" strokeWidth="1.1" />
      <path d="M11.2 4.2h4.3M11.2 8h4.3M11.2 11.8h4.3" stroke="#efefef" strokeWidth="1.1" />
      <path d="M7.2 8h6.5" stroke="#4fa6ff" strokeWidth="1.3" />
      <path d="m7.2 8 2.1-1.8v3.6z" fill="#4fa6ff" />
    </svg>
  )
}

function BlueTuneRightIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 18 18" aria-hidden="true">
      <path d="M2.4 4.2h4.2M2.4 8h4.2M2.4 11.8h4.2" stroke="#efefef" strokeWidth="1.1" />
      <path d="M11.2 4.2h4.3M11.2 8h4.3M11.2 11.8h4.3" stroke="#efefef" strokeWidth="1.1" />
      <path d="M6.9 8h6.5" stroke="#4fa6ff" strokeWidth="1.3" />
      <path d="m13.4 8-2.1-1.8v3.6z" fill="#4fa6ff" />
    </svg>
  )
}

function QueryOptionsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
      <rect x="1.8" y="2.0" width="3.6" height="3.6" fill="none" stroke="#c4c4c4" strokeWidth="1.1" />
      <rect x="12.6" y="2.0" width="3.6" height="3.6" fill="none" stroke="#c4c4c4" strokeWidth="1.1" />
      <rect x="1.8" y="12.4" width="3.6" height="3.6" fill="none" stroke="#c4c4c4" strokeWidth="1.1" />
      <rect x="12.6" y="12.4" width="3.6" height="3.6" fill="none" stroke="#c4c4c4" strokeWidth="1.1" />
      <path d="M5.4 3.8h7.2M3.6 5.6v6.8" stroke="#c4c4c4" strokeWidth="1.05" />
    </svg>
  )
}

function IntelliSenseEnabledIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
      <rect x="1.8" y="2.0" width="3.6" height="3.6" fill="none" stroke="#c4c4c4" strokeWidth="1.1" />
      <rect x="12.6" y="2.0" width="3.6" height="3.6" fill="none" stroke="#c4c4c4" strokeWidth="1.1" />
      <rect x="1.8" y="12.4" width="3.6" height="3.6" fill="none" stroke="#c4c4c4" strokeWidth="1.1" />
      <rect x="12.6" y="12.4" width="3.6" height="3.6" fill="none" stroke="#c4c4c4" strokeWidth="1.1" opacity="0" />
      <path d="M5.4 3.8h7.2M3.6 5.6v6.8" stroke="#c4c4c4" strokeWidth="1.05" />
      <circle cx="14.0" cy="13.8" r="3.6" fill="#3fbf66" />
      <path d="m12.4 13.8 1.1 1.2 2.3-2.4" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
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

      <div className="mx-[1px] flex items-center gap-[2px]">
        <div className="flex h-[22px] w-[34px] items-center justify-between px-[1px] hover:bg-[rgba(62,62,64,1)]">
          <button className="flex h-[22px] w-[20px] cursor-default items-center justify-center">
            <img
              src="/toolbar-icons/new-query-icon.png"
              alt=""
              className="h-[16px] w-[16px] object-contain"
              draggable={false}
            />
          </button>
          <button className="flex h-[22px] w-[10px] cursor-default items-center justify-center">
            <TinyDownArrow />
          </button>
        </div>
        <button className="flex h-[22px] w-[34px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]">
          <img
            src="/toolbar-icons/newfile-disabled-combo.png"
            alt=""
            className="h-[16px] w-[34px] object-contain"
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
        className="flex h-[22px] cursor-default items-center gap-1.5 pl-[2px] pr-1 text-[12px] text-[#ececec] hover:bg-[#3a3a40]"
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
      <div className="flex items-center gap-[1px]">
        <button className="flex h-[22px] w-[22px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]">
          <CutIcon />
        </button>
        <button className="flex h-[22px] w-[22px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]">
          <CopyIcon />
        </button>
        <button className="flex h-[22px] w-[22px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]">
          <PasteIcon />
        </button>
      </div>
      <div className="mx-1 h-[18px] w-px bg-[#4a4a4a]" />

      <div className="ml-[-2px] flex h-[22px] items-center gap-[1px] hover:bg-[rgba(62,62,64,1)]">
        <button className="flex h-[22px] w-[22px] cursor-default items-center justify-center">
          <UndoIcon />
        </button>
        <button className="flex h-[22px] w-[12px] cursor-default items-center justify-center">
          <TinyDownArrow />
        </button>
      </div>
      <div className="flex h-[22px] items-center gap-[1px] hover:bg-[rgba(62,62,64,1)]">
        <button className="flex h-[22px] w-[22px] cursor-default items-center justify-center">
          <RedoIcon />
        </button>
        <button className="flex h-[22px] w-[12px] cursor-default items-center justify-center">
          <TinyDownArrow />
        </button>
      </div>
      <div className="mx-1 h-[18px] w-px bg-[#4a4a4a]" />
      <button className="mr-1 flex h-[24px] w-[24px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]">
        <FindInFilesIcon />
      </button>

      <button className="mr-1 flex h-[24px] min-w-[194px] cursor-default items-center border border-[#3c3c3f] bg-[#333337] pl-2 pr-0 text-left text-[12px] text-[#afb6b9] hover:!border-[#5a5f6f] hover:!bg-[#2f3138]">
        {"PRINT '>>>>' + CAST(@RowCc"}
        <span className="ml-[1px] flex h-full w-[12px] items-center justify-center text-[13px] leading-none text-[#afb6b9]">▾</span>
      </button>

      <div className="mx-1 h-[18px] w-px bg-[#4a4a4a]" />
      <button className="flex h-[22px] w-[22px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]">
        <SolutionExplorerIcon />
      </button>
      <button className="flex h-[22px] w-[22px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]">
        <PropertiesWindowIcon />
      </button>
      <button className="flex h-[22px] w-[22px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]">
        <ToolboxIcon />
      </button>
      <div className="flex h-[22px] items-center gap-[1px] hover:bg-[rgba(62,62,64,1)]">
        <button className="flex h-[22px] w-[22px] cursor-default items-center justify-center">
          <CommandWindowIcon />
        </button>
        <button className="flex h-[22px] w-[12px] cursor-default items-center justify-center">
          <TinyDownArrow />
        </button>
      </div>
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
      <button className="flex h-[22px] w-[22px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]">
        <PlugIcon />
      </button>
      <button className="flex h-[22px] w-[22px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]">
        <PlugIcon withPencil />
      </button>
      <div className="mx-1 h-[18px] w-px bg-[#4a4a4a]" />

      <div className="relative">
        <select
          value={currentDatabase}
          onChange={(e) => onDatabaseChange(e.target.value)}
          className="h-[24px] min-w-[168px] cursor-default appearance-none border border-[#3c3c3f] bg-[#333337] pl-2 pr-6 text-[12px] text-[#afb6b9] outline-none transition-colors hover:border-[#8f93c8] hover:shadow-[inset_0_0_0_1px_rgba(143,147,200,0.35)] focus:border-[#8f93c8] focus:shadow-[inset_0_0_0_1px_rgba(143,147,200,0.35)]"
        >
          <option>Portfolio</option>
          <option>MyDatabase</option>
          <option>DataWarehouse</option>
          <option>master</option>
        </select>
        <span className="pointer-events-none absolute right-[6px] top-1/2 -translate-y-1/2 text-[11px] text-[#afb6b9]">▾</span>
      </div>

      <div className="mx-1 h-[18px] w-px bg-[#4a4a4a]" />

      <button
        onClick={onExecute}
        disabled={isExecuting}
        className={`flex h-[22px] cursor-default items-center gap-1.5 pl-[2px] pr-[4px] text-[12px] text-[#d9d9d9] hover:bg-[rgba(62,62,64,1)] ${
          isExecuting ? "opacity-60" : ""
        }`}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4.3 2.8v10.4L12.8 8z" fill="#3fcf73" />
        </svg>
        <span>Execute</span>
      </button>

      <div className="mx-1 h-[18px] w-px bg-[#4a4a4a]" />
      <div className="ml-[-2px] flex items-center">
        <button className="flex h-[22px] w-[22px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]"><ExecuteSquareIcon /></button>
        <button className="flex h-[22px] w-[22px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]"><ExecuteCheckIcon /></button>
        <button className="flex h-[22px] w-[22px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]"><ExecuteNodesIcon /></button>
        <button className="flex h-[22px] w-[24px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]"><BoxStackIcon /></button>
        <button className="flex h-[22px] w-[24px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]"><ActivePanelIcon /></button>
        <div className="mx-1 h-[18px] w-px bg-[#4a4a4a]" />
        <button className="flex h-[22px] w-[20px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]"><QueryOptionsIcon /></button>
        <button className="flex h-[22px] w-[20px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]"><IntelliSenseEnabledIcon /></button>
        <button className="flex h-[22px] w-[20px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]"><ServerFrameIcon /></button>
      </div>
      <div className="mx-1 h-[18px] w-px bg-[#4a4a4a]" />
      <IconButton><EndSmallSquaresIcon /></IconButton>
      <IconButton><EndTableIcon /></IconButton>
      <IconButton><EndDocIcon /></IconButton>
      <div className="mx-1 h-[18px] w-px bg-[#4a4a4a]" />
      <button className="flex h-[26px] w-[26px] translate-y-[1px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]"><BlueListArrowIcon /></button>
      <button className="flex h-[26px] w-[26px] translate-y-[1px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]"><BlueSliderIcon /></button>
      <button className="flex h-[26px] w-[26px] translate-y-[1px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]"><BlueSwapIcon /></button>
      <button className="flex h-[26px] w-[26px] translate-y-[1px] cursor-default items-center justify-center hover:bg-[rgba(62,62,64,1)]"><BlueTuneRightIcon /></button>
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
