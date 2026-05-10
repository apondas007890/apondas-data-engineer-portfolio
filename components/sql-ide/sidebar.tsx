"use client"

import { useEffect, useState } from "react"
import { useTheme } from "@/app/page"
import { ChevronDownIcon, ChevronRightIcon, XIcon } from "lucide-react"
import { portfolioDatabaseChildren, type PortfolioSchemaNode } from "@/src/data/portfolioDbSchema"

interface SidebarProps {
  width: number
  onWidthChange: (width: number) => void
  selectedNode: string | null
  onSelectNode: (node: string | null, query?: string) => void
}

// Server icon with green connection indicator - #414141 fill with #f0eff1 inner details
const ServerIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <rect x="2" y="2" width="12" height="4" rx="0.5" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" />
    <rect x="2" y="7" width="12" height="4" rx="0.5" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" />
    <circle cx="4" cy="4" r="0.8" fill={isDark ? "#f0eff1" : "#414141"} />
    <circle cx="4" cy="9" r="0.8" fill={isDark ? "#f0eff1" : "#414141"} />
    {/* Green connection indicator */}
    <circle cx="13" cy="12" r="2.5" fill="#22c55e" />
  </svg>
)

const FolderIcon = ({ color = "#e8c44d" }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <path d="M1.5 3C1.5 2.44772 1.94772 2 2.5 2H6L7.5 4H13.5C14.0523 4 14.5 4.44772 14.5 5V12C14.5 12.5523 14.0523 13 13.5 13H2.5C1.94772 13 1.5 12.5523 1.5 12V3Z" fill={color} />
  </svg>
)

const DatabaseIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <ellipse cx="8" cy="3.6" rx="4.25" ry="1.6" fill="none" stroke={isDark ? "#d7d7d8" : "#4f4f52"} strokeWidth="0.9" />
    <path
      d="M3.75 3.65v8.15c0 .95 1.9 1.7 4.25 1.7s4.25-.75 4.25-1.7V3.65"
      fill="none"
      stroke={isDark ? "#d7d7d8" : "#4f4f52"}
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.75 11.8c0 .95 1.9 1.7 4.25 1.7s4.25-.75 4.25-1.7"
      fill="none"
      stroke={isDark ? "#d7d7d8" : "#4f4f52"}
      strokeWidth="0.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const TableIcon = ({ isDark }: { isDark: boolean }) => {
  const iconColor = isDark ? "#d7d7d8" : "#2e2e30"
  const cellFill = isDark ? "#d7d7d8" : "#2e2e30"

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
      <rect x="1.5" y="2" width="13" height="12" rx="1.4" fill="none" stroke={iconColor} strokeWidth="1.2" />
      <rect x="2.8" y="5" width="2.8" height="2.1" fill={cellFill} />
      <rect x="6.6" y="5" width="2.8" height="2.1" fill={cellFill} />
      <rect x="10.4" y="5" width="2.8" height="2.1" fill={cellFill} />
      <rect x="2.8" y="8" width="2.8" height="2.1" fill={cellFill} />
      <rect x="6.6" y="8" width="2.8" height="2.1" fill={cellFill} />
      <rect x="10.4" y="8" width="2.8" height="2.1" fill={cellFill} />
      <rect x="2.8" y="11" width="2.8" height="2.1" fill={cellFill} />
      <rect x="6.6" y="11" width="2.8" height="2.1" fill={cellFill} />
      <rect x="10.4" y="11" width="2.8" height="2.1" fill={cellFill} />
    </svg>
  )
}

const ViewIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <rect x="2" y="3" width="12" height="10" rx="1" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" />
    <circle cx="8" cy="8" r="3" fill={isDark ? "#f0eff1" : "#414141"} />
    <circle cx="8" cy="8" r="1.5" fill={isDark ? "#414141" : "#f0eff1"} />
  </svg>
)

// Column icon with vertical bars - properly aligned
const ColumnIcon = ({ isDark, isPK = false }: { isDark: boolean; isPK?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    {isPK ? (
      <>
        {/* Use neutral SSMS-like color to match other icons */}
        {(() => {
          const keyColor = isDark ? "#d7d7d8" : "#6f7074"
          return (
            <>
              <circle cx="5" cy="5" r="3" fill={keyColor} stroke={keyColor} strokeWidth="0.5" />
              <circle cx="5" cy="5" r="1.2" fill={isDark ? "#414141" : "#f0eff1"} />
              <path d="M7 7l5 5M10 10l2-2" stroke={keyColor} strokeWidth="1.5" fill="none" />
            </>
          )
        })()}
      </>
    ) : (
      <>
        <rect
          x="4.3"
          y="2.05"
          width="7.4"
          height="11.7"
          rx="0.55"
          fill={isDark ? "#4a4a4c" : "#d8d8d8"}
          stroke={isDark ? "#d7d7d8" : "#8b8b8f"}
          strokeWidth="0.82"
        />
        <rect
          x="5.1"
          y="2.85"
          width="5.8"
          height="2"
          fill={isDark ? "#1b1b1c" : "#b8b8b8"}
        />
        <rect
          x="5.1"
          y="5.8"
          width="5.8"
          height="2"
          fill={isDark ? "#d7d7d8" : "#f0f0f0"}
        />
        <rect
          x="5.1"
          y="8.75"
          width="5.8"
          height="2"
          fill={isDark ? "#d7d7d8" : "#f0f0f0"}
        />
        <rect
          x="5.1"
          y="11.7"
          width="5.8"
          height="1"
          fill={isDark ? "#d7d7d8" : "#f0f0f0"}
        />
      </>
    )}
  </svg>
)

const KeyIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <circle cx="5" cy="6" r="3" fill={isDark ? "#d7d7d8" : "#6f7074"} />
    <circle cx="5" cy="6" r="1.15" fill={isDark ? "#1c1c1d" : "#f0eff1"} />
    <path d="M7 8l6 6M11 12l2-2" stroke={isDark ? "#d7d7d8" : "#6f7074"} strokeWidth="1.7" fill="none" strokeLinecap="square" />
  </svg>
)

const StatisticsIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <rect
      x="2.35"
      y="2.05"
      width="11.3"
      height="11.7"
      rx="0.85"
      fill={isDark ? "#4a4a4c" : "#d8d8d8"}
      stroke={isDark ? "#d7d7d8" : "#8b8b8f"}
      strokeWidth="0.7"
    />
    <rect
      x="3.45"
      y="3.2"
      width="9.1"
      height="2.05"
      rx="0.12"
      fill={isDark ? "#1a1a1b" : "#bdbdc2"}
      stroke={isDark ? "#d7d7d8" : "#b7b7bb"}
      strokeWidth="0.22"
    />
    <rect
      x="3.45"
      y="5.9"
      width="9.1"
      height="6.75"
      rx="0.18"
      fill={isDark ? "#1a1a1b" : "#f7f7f7"}
      stroke={isDark ? "#d7d7d8" : "#b7b7bb"}
      strokeWidth="0.22"
    />
    <path
      d="M4.55 11.35h6.9M5.15 11.35V8.7h1.15v2.65M7.15 11.35V7.05H8.3v4.3M9.15 11.35V8h1.15v3.35"
      fill="none"
      stroke={isDark ? "#f1f1f1" : "#5f5f63"}
      strokeWidth="0.95"
      strokeLinecap="square"
      strokeLinejoin="miter"
    />
  </svg>
)

const SecurityIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <path d="M8 1L2 4v4c0 4 2.5 6.5 6 7.5 3.5-1 6-3.5 6-7.5V4L8 1z" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" />
    <path d="M6 8l2 2 3-4" stroke="#22c55e" strokeWidth="1.5" fill="none" />
  </svg>
)

const UserIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <rect x="2.25" y="2.2" width="11.5" height="11.6" rx="1" fill={isDark ? "#474749" : "#dadade"} stroke={isDark ? "#f3f3f4" : "#8b8b8f"} strokeWidth="0.8" />
    <circle cx="6.1" cy="6" r="1.55" fill={isDark ? "#1c1c1d" : "#66676a"} />
    <path d="M4.55 10.35c.35-1.25 1.25-2 2.55-2s2.2.75 2.55 2" fill="none" stroke={isDark ? "#1c1c1d" : "#66676a"} strokeWidth="0.95" strokeLinecap="round" />
    <path d="M10.35 5.4h1.7M10.35 7.35h1.7M10.35 9.3h1.7" stroke={isDark ? "#f3f3f4" : "#8b8b8f"} strokeWidth="0.8" strokeLinecap="round" />
  </svg>
)

const RoleIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <circle cx="5.1" cy="5.4" r="1.55" fill={isDark ? "#d7d7d8" : "#6f7074"} />
    <circle cx="10.7" cy="5.2" r="1.25" fill={isDark ? "#d7d7d8" : "#6f7074"} />
    <path d="M3.6 10.7c.35-1.2 1.2-1.95 2.45-1.95s2.1.75 2.45 1.95" fill="none" stroke={isDark ? "#d7d7d8" : "#6f7074"} strokeWidth="0.9" strokeLinecap="round" />
    <path d="M8.95 10.55c.22-.95.95-1.55 1.95-1.55s1.7.6 1.95 1.55" fill="none" stroke={isDark ? "#d7d7d8" : "#6f7074"} strokeWidth="0.82" strokeLinecap="round" />
  </svg>
)

const BoxIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <rect x="2" y="2" width="12" height="12" rx="1" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" />
  </svg>
)

const AssemblyIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <rect
      x="2.7"
      y="2.6"
      width="10.6"
      height="10.8"
      rx="0.9"
      fill={isDark ? "#4a4a4c" : "#dbdbdf"}
      stroke={isDark ? "#e8e8e9" : "#8b8b8f"}
      strokeWidth="0.8"
    />
    <rect x="3.9" y="3.8" width="8.2" height="2.1" rx="0.15" fill={isDark ? "#1c1c1d" : "#b8b8bd"} />
    <rect x="4.35" y="7.1" width="3.05" height="2.35" fill={isDark ? "#f2f2f2" : "#5e5f63"} />
    <rect x="8.55" y="7.1" width="3.05" height="2.35" fill={isDark ? "#f2f2f2" : "#5e5f63"} />
    <rect x="4.35" y="10.1" width="3.05" height="2.35" fill={isDark ? "#f2f2f2" : "#5e5f63"} />
    <rect x="8.55" y="10.1" width="3.05" height="2.35" fill={isDark ? "#f2f2f2" : "#5e5f63"} />
  </svg>
)

const SchemaIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <rect x="3.1" y="2.3" width="9.8" height="11.4" rx="0.8" fill={isDark ? "#474749" : "#d8d8dc"} stroke={isDark ? "#d7d7d8" : "#8b8b8f"} strokeWidth="0.7" />
    <rect x="4.2" y="3.4" width="7.6" height="2.1" fill={isDark ? "#1b1b1c" : "#b9b9be"} />
    <path d="M5.1 7.3h1.45M7.3 7.3h1.45M9.5 7.3h1.45M5.1 9.5h1.45M7.3 9.5h1.45M9.5 9.5h1.45M5.1 11.7h1.45M7.3 11.7h1.45M9.5 11.7h1.45" stroke={isDark ? "#f2f2f2" : "#66676a"} strokeWidth="0.75" strokeLinecap="square" />
  </svg>
)

const CertificateIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <rect x="2.8" y="2.25" width="9.2" height="10.2" rx="0.7" fill={isDark ? "#474749" : "#d8d8dc"} stroke={isDark ? "#d7d7d8" : "#8b8b8f"} strokeWidth="0.7" />
    <path d="M4.4 5h6M4.4 7.1h6M4.4 9.2h4.9" stroke={isDark ? "#f2f2f2" : "#66676a"} strokeWidth="0.8" strokeLinecap="round" />
    <circle cx="11.45" cy="11.3" r="1.25" fill="#d9d9da" stroke={isDark ? "#1f1f20" : "#77787b"} strokeWidth="0.35" />
    <path d="M10.85 12.1l-.35 1.6 1-.55 1 .55-.35-1.6" fill="#d9d9da" stroke={isDark ? "#1f1f20" : "#77787b"} strokeWidth="0.35" strokeLinejoin="round" />
  </svg>
)

const BrokerItemIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <rect x="3.1" y="2.3" width="9.8" height="11.4" rx="0.8" fill={isDark ? "#474749" : "#d8d8dc"} stroke={isDark ? "#d7d7d8" : "#8b8b8f"} strokeWidth="0.72" />
    <rect x="4.25" y="3.45" width="7.5" height="2.05" fill={isDark ? "#1b1b1c" : "#b9b9be"} />
    <path d="M5 7.15h6M5 9.05h6M5 10.95h4.6" stroke={isDark ? "#f2f2f2" : "#66676a"} strokeWidth="0.8" strokeLinecap="round" />
  </svg>
)

const ProcedureIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <path
      d="M3.7 2.15h6.2l2.35 2.3v9.25H3.7z"
      fill={isDark ? "#4a4a4c" : "#dddddf"}
      stroke={isDark ? "#f1f1f2" : "#8b8b8f"}
      strokeWidth="0.85"
      strokeLinejoin="round"
    />
    <path
      d="M9.9 2.15v2.3h2.35"
      fill="none"
      stroke={isDark ? "#f1f1f2" : "#8b8b8f"}
      strokeWidth="0.85"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="4.9" y="5.15" width="6.15" height="1.3" rx="0.2" fill={isDark ? "#1c1c1d" : "#b6b6bb"} />
    <path
      d="M5.15 8.15h2.15M8.05 8.15h2.15M5.15 10.1h5.3"
      stroke={isDark ? "#f2f2f2" : "#66676a"}
      strokeWidth="0.82"
      strokeLinecap="round"
    />
    <path
      d="M5.25 12.05l1.15-1.05 1.1 1.05 1.1-1.05 1.15 1.05"
      fill="none"
      stroke={isDark ? "#f2f2f2" : "#66676a"}
      strokeWidth="0.78"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const FunctionIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <path
      d="M3.7 2.15h6.2l2.35 2.3v9.25H3.7z"
      fill={isDark ? "#4a4a4c" : "#dddddf"}
      stroke={isDark ? "#f1f1f2" : "#8b8b8f"}
      strokeWidth="0.85"
      strokeLinejoin="round"
    />
    <path
      d="M9.9 2.15v2.3h2.35"
      fill="none"
      stroke={isDark ? "#f1f1f2" : "#8b8b8f"}
      strokeWidth="0.85"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="4.9" y="5.15" width="6.15" height="1.3" rx="0.2" fill={isDark ? "#1c1c1d" : "#b6b6bb"} />
    <path
      d="M5.35 8.1h5.2M5.35 10.4h5.2"
      stroke={isDark ? "#f2f2f2" : "#66676a"}
      strokeWidth="0.8"
      strokeLinecap="round"
    />
    <path
      d="M6.15 8.85c.35-.55.8-.85 1.4-.85.7 0 1.15.25 1.45.85.22.42.48.65.9.65"
      fill="none"
      stroke={isDark ? "#f2f2f2" : "#66676a"}
      strokeWidth="0.78"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const ReplicationIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <circle cx="4" cy="8" r="2.5" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" />
    <circle cx="12" cy="8" r="2.5" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" />
    <path d="M6.5 8h3" stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="1" />
    <path d="M8 6l2 2-2 2" fill={isDark ? "#f0eff1" : "#414141"} />
  </svg>
)

const ManagementIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <circle cx="8" cy="8" r="5" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" />
    <circle cx="8" cy="8" r="2" fill={isDark ? "#f0eff1" : "#414141"} />
    <rect x="7" y="1" width="2" height="3" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.3" />
    <rect x="7" y="12" width="2" height="3" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.3" />
    <rect x="1" y="7" width="3" height="2" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.3" />
    <rect x="12" y="7" width="3" height="2" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.3" />
  </svg>
)

const ProfilerIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <rect x="2" y="2" width="12" height="12" rx="1" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" />
    <path d="M4 10l2-3 2 2 4-5" stroke="#22c55e" strokeWidth="1.5" fill="none" />
  </svg>
)

const ConnectPlugIcon = ({ disconnected = false }: { disconnected?: boolean }) => (
  <span className="relative flex h-[15px] w-[15px] items-center justify-center">
    <svg className="h-[14px] w-[14px]" viewBox="0 0 16 16" aria-hidden="true">
      <rect x="4.6" y="1.4" width="2.2" height="3.2" rx="0.8" fill="#c7c7c7" />
      <rect x="9.2" y="1.4" width="2.2" height="3.2" rx="0.8" fill="#c7c7c7" />
      <rect x="3.2" y="4.5" width="9.6" height="3.8" rx="1.2" fill="#c7c7c7" />
      <rect x="4.3" y="7.8" width="7.4" height="1.4" fill="#c7c7c7" />
      <path d="M4.9 9h6.2v1.3c0 1.2-1.1 2.2-2.3 2.2H7.2c-1.2 0-2.3-1-2.3-2.2z" fill="#c7c7c7" />
      <rect x="6.8" y="12.3" width="2.4" height="2.7" rx="0.7" fill="#c7c7c7" />
    </svg>
    {disconnected ? (
      <svg
        className="absolute -left-[2px] top-[1px] h-[8px] w-[8px]"
        viewBox="0 0 16 16"
        aria-hidden="true"
      >
        <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="#d24a43" strokeWidth="2" strokeLinecap="square" />
      </svg>
    ) : null}
  </span>
)

const DiagramIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <rect x="2" y="2" width="5" height="4" rx="0.5" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" />
    <rect x="9" y="10" width="5" height="4" rx="0.5" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" />
    <path d="M4.5 6v4h7V10" stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.8" fill="none" />
  </svg>
)

const LinkProviderIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <rect x="3" y="2.8" width="10" height="10.4" rx="0.8" fill={isDark ? "#474749" : "#d8d8dc"} stroke={isDark ? "#d7d7d8" : "#8b8b8f"} strokeWidth="0.72" />
    <path d="M5.1 5.3h5.8M5.1 7.5h5.8M5.1 9.7h4.1" stroke={isDark ? "#f2f2f2" : "#66676a"} strokeWidth="0.82" strokeLinecap="round" />
    <path d="M10.2 10.7l1.8-1.8M10.65 8.35h1.35v1.35" fill="none" stroke={isDark ? "#f2f2f2" : "#66676a"} strokeWidth="0.82" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const TriggerIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <path d="M8.8 1.8L3.7 8.15h3.1l-.7 6.05 5.1-6.35H8.1z" fill={isDark ? "#d7d7d8" : "#6f7074"} />
  </svg>
)

const PolicyIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <rect x="3.2" y="2.2" width="9.6" height="11.6" rx="0.8" fill={isDark ? "#474749" : "#d8d8dc"} stroke={isDark ? "#d7d7d8" : "#8b8b8f"} strokeWidth="0.72" />
    <path d="M5.1 5.1h5.8M5.1 7.4h5.8M5.1 9.7h3.9" stroke={isDark ? "#f2f2f2" : "#66676a"} strokeWidth="0.82" strokeLinecap="round" />
    <path d="M9.8 10.75l.8.65 1.35-1.55" fill="none" stroke="#22c55e" strokeWidth="0.95" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const EventSessionIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <rect x="3.1" y="2.25" width="9.8" height="11.5" rx="0.8" fill={isDark ? "#474749" : "#d8d8dc"} stroke={isDark ? "#d7d7d8" : "#8b8b8f"} strokeWidth="0.7" />
    <rect x="4.2" y="3.45" width="7.6" height="2" fill={isDark ? "#1b1b1c" : "#b9b9be"} />
    <path d="M5.1 10.9l1.6-2.35 1.4 1.15 1.8-2.7 1 1.25" fill="none" stroke="#22c55e" strokeWidth="0.85" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const LogIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <path d="M3.8 2.15h6.15l2.25 2.2v9.45H3.8z" fill={isDark ? "#4a4a4c" : "#dddddf"} stroke={isDark ? "#f1f1f2" : "#8b8b8f"} strokeWidth="0.78" strokeLinejoin="round" />
    <path d="M9.95 2.15v2.2h2.25" fill="none" stroke={isDark ? "#f1f1f2" : "#8b8b8f"} strokeWidth="0.78" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.1 6h5.5M5.1 8.05h5.5M5.1 10.1h4.2" stroke={isDark ? "#f2f2f2" : "#66676a"} strokeWidth="0.8" strokeLinecap="round" />
  </svg>
)

const SubscriptionIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <rect x="2.5" y="3" width="11" height="8.8" rx="0.9" fill={isDark ? "#474749" : "#d8d8dc"} stroke={isDark ? "#d7d7d8" : "#8b8b8f"} strokeWidth="0.72" />
    <path d="M4.4 6.2h7.2M4.4 8.45h4.5" stroke={isDark ? "#f2f2f2" : "#66676a"} strokeWidth="0.82" strokeLinecap="round" />
    <path d="M10.5 10.5h2.1M11.55 9.45v2.1" stroke="#22c55e" strokeWidth="0.9" strokeLinecap="round" />
  </svg>
)

interface TreeNode {
  id: string
  label: string
  iconType: "server" | "folder" | "database" | "table" | "view" | "column" | "column-pk" | "key" | "statistics" | "security" | "user" | "role" | "schema" | "certificate" | "broker-item" | "procedure" | "function" | "assembly" | "box" | "replication" | "management" | "profiler" | "diagram" | "provider" | "trigger" | "policy" | "event-session" | "log" | "subscription"
  folderColor?: string
  dataType?: string
  keyType?: "PK" | "FK"
  nullable?: boolean
  query?: string
  children?: TreeNode[]
}

const mapPortfolioTypeToIcon = (type: PortfolioSchemaNode["type"], keyType?: "PK" | "FK"): TreeNode["iconType"] => {
  if (type === "database" || type === "server") return type
  if (type === "table") return "table"
  if (type === "view") return "view"
  if (type === "procedure") return "procedure"
  if (type === "function") return "function"
  if (type === "trigger") return "trigger"
  if (type === "column") {
    return keyType === "PK" ? "column-pk" : "column"
  }
  return "folder"
}

const mapPortfolioNodes = (nodes: PortfolioSchemaNode[]): TreeNode[] =>
  nodes.map((node) => ({
    id: node.id,
    label: node.label,
    iconType: mapPortfolioTypeToIcon(node.type, node.keyType),
    folderColor: "#e8c44d",
    dataType: node.dataType,
    keyType: node.keyType,
    nullable: node.nullable,
    query: node.query,
    children: node.children ? mapPortfolioNodes(node.children) : undefined,
  }))

const masterSecurityChildren: TreeNode[] = [
  {
    id: "security-users",
    label: "Users",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      { id: "user-ms-agent-signing-certificate", label: "##MS_AgentSigningCertificate##", iconType: "user" },
      { id: "user-ms-policy-event-processing-login", label: "##MS_PolicyEventProcessingLogin##", iconType: "user" },
      { id: "user-dbo", label: "dbo", iconType: "user" },
      { id: "user-guest", label: "guest", iconType: "user" },
      { id: "user-information-schema", label: "INFORMATION_SCHEMA", iconType: "user" },
      { id: "user-sys", label: "sys", iconType: "user" },
    ],
  },
  {
    id: "security-roles",
    label: "Roles",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      {
        id: "security-database-roles",
        label: "Database Roles",
        iconType: "folder",
        folderColor: "#e8c44d",
        children: [
          { id: "db-role-accessadmin", label: "db_accessadmin", iconType: "role" },
          { id: "db-role-backupoperator", label: "db_backupoperator", iconType: "role" },
          { id: "db-role-datareader", label: "db_datareader", iconType: "role" },
          { id: "db-role-datawriter", label: "db_datawriter", iconType: "role" },
          { id: "db-role-ddladmin", label: "db_ddladmin", iconType: "role" },
          { id: "db-role-denydatareader", label: "db_denydatareader", iconType: "role" },
          { id: "db-role-denydatawriter", label: "db_denydatawriter", iconType: "role" },
          { id: "db-role-owner", label: "db_owner", iconType: "role" },
          { id: "db-role-securityadmin", label: "db_securityadmin", iconType: "role" },
          { id: "db-role-public", label: "public", iconType: "role" },
        ],
      },
      { id: "security-application-roles", label: "Application Roles", iconType: "folder", folderColor: "#e8c44d" },
    ],
  },
  {
    id: "security-schemas",
    label: "Schemas",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      { id: "schema-db-accessadmin", label: "db_accessadmin", iconType: "schema" },
      { id: "schema-db-backupoperator", label: "db_backupoperator", iconType: "schema" },
      { id: "schema-db-datareader", label: "db_datareader", iconType: "schema" },
      { id: "schema-db-datawriter", label: "db_datawriter", iconType: "schema" },
      { id: "schema-db-ddladmin", label: "db_ddladmin", iconType: "schema" },
      { id: "schema-db-denydatareader", label: "db_denydatareader", iconType: "schema" },
      { id: "schema-db-denydatawriter", label: "db_denydatawriter", iconType: "schema" },
      { id: "schema-db-owner", label: "db_owner", iconType: "schema" },
      { id: "schema-db-securityadmin", label: "db_securityadmin", iconType: "schema" },
      { id: "schema-dbo", label: "dbo", iconType: "schema" },
      { id: "schema-guest", label: "guest", iconType: "schema" },
      { id: "schema-information-schema", label: "INFORMATION_SCHEMA", iconType: "schema" },
      { id: "schema-sys", label: "sys", iconType: "schema" },
    ],
  },
  { id: "security-asymmetric-keys", label: "Asymmetric Keys", iconType: "folder", folderColor: "#e8c44d" },
  {
    id: "security-certificates",
    label: "Certificates",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      { id: "cert-ms-agent-signing", label: "##MS_AgentSigningCertificate##", iconType: "certificate" },
      { id: "cert-ms-policy-signing", label: "##MS_PolicySigningCertificate##", iconType: "certificate" },
      { id: "cert-ms-schema-signing", label: "##MS_SchemaSigningCertificate49DAF39CDF8914F6AD714B481518685F0570173", iconType: "certificate" },
      { id: "cert-ms-smolextended-signing", label: "##MS_SmoExtendedSigningCertificate##", iconType: "certificate" },
      { id: "cert-ms-sqlauthenticator", label: "##MS_SQLAuthenticatorCertificate##", iconType: "certificate" },
      { id: "cert-ms-sqlreplication-signing", label: "##MS_SQLReplicationSigningCertificate##", iconType: "certificate" },
      { id: "cert-ms-sqlresource-signing", label: "##MS_SQLResourceSigningCertificate##", iconType: "certificate" },
    ],
  },
  {
    id: "security-symmetric-keys",
    label: "Symmetric Keys",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [{ id: "symm-ms-service-master-key", label: "##MS_ServiceMasterKey##", iconType: "key" }],
  },
  {
    id: "security-always-encrypted-keys",
    label: "Always Encrypted Keys",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      { id: "security-column-master-keys", label: "Column Master Keys", iconType: "folder", folderColor: "#e8c44d" },
      { id: "security-column-encryption-keys", label: "Column Encryption Keys", iconType: "folder", folderColor: "#e8c44d" },
    ],
  },
  { id: "security-database-audit-specifications", label: "Database Audit Specifications", iconType: "folder", folderColor: "#e8c44d" },
  { id: "security-security-policies", label: "Security Policies", iconType: "folder", folderColor: "#e8c44d" },
]

const masterServiceBrokerChildren: TreeNode[] = [
  {
    id: "master-message-types",
    label: "Message Types",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      {
        id: "master-system-message-types",
        label: "System Message Types",
        iconType: "folder",
        folderColor: "#e8c44d",
        children: [
          { id: "msg-default", label: "DEFAULT", iconType: "broker-item" },
          { id: "msg-event-notification", label: "http://schemas.microsoft.com/SQL/Notifications/EventNotification", iconType: "broker-item" },
          { id: "msg-query-notification", label: "http://schemas.microsoft.com/SQL/Notifications/QueryNotification", iconType: "broker-item" },
          { id: "msg-failed-remote-service-binding", label: "http://schemas.microsoft.com/SQL/ServiceBroker/BrokerConfigurationNotice/FailedRemoteServiceBinding", iconType: "broker-item" },
          { id: "msg-failed-route", label: "http://schemas.microsoft.com/SQL/ServiceBroker/BrokerConfigurationNotice/FailedRoute", iconType: "broker-item" },
          { id: "msg-missing-remote-service-binding", label: "http://schemas.microsoft.com/SQL/ServiceBroker/BrokerConfigurationNotice/MissingRemoteServiceBinding", iconType: "broker-item" },
          { id: "msg-missing-route", label: "http://schemas.microsoft.com/SQL/ServiceBroker/BrokerConfigurationNotice/MissingRoute", iconType: "broker-item" },
          { id: "msg-dialog-timer", label: "http://schemas.microsoft.com/SQL/ServiceBroker/DialogTimer", iconType: "broker-item" },
          { id: "msg-end-dialog", label: "http://schemas.microsoft.com/SQL/ServiceBroker/EndDialog", iconType: "broker-item" },
          { id: "msg-error", label: "http://schemas.microsoft.com/SQL/ServiceBroker/Error", iconType: "broker-item" },
          { id: "msg-service-diagnostic-description", label: "http://schemas.microsoft.com/SQL/ServiceBroker/ServiceDiagnostic/Description", iconType: "broker-item" },
          { id: "msg-service-diagnostic-query", label: "http://schemas.microsoft.com/SQL/ServiceBroker/ServiceDiagnostic/Query", iconType: "broker-item" },
          { id: "msg-service-diagnostic-status", label: "http://schemas.microsoft.com/SQL/ServiceBroker/ServiceDiagnostic/Status", iconType: "broker-item" },
          { id: "msg-service-echo-echo", label: "http://schemas.microsoft.com/SQL/ServiceBroker/ServiceEcho/Echo", iconType: "broker-item" },
        ],
      },
    ],
  },
  {
    id: "master-contracts",
    label: "Contracts",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      {
        id: "master-system-contracts",
        label: "System Contracts",
        iconType: "folder",
        folderColor: "#e8c44d",
        children: [
          { id: "contract-default", label: "DEFAULT", iconType: "broker-item" },
          { id: "contract-post-event-notification", label: "http://schemas.microsoft.com/SQL/Notifications/PostEventNotification", iconType: "broker-item" },
          { id: "contract-post-query-notification", label: "http://schemas.microsoft.com/SQL/Notifications/PostQueryNotification", iconType: "broker-item" },
          { id: "contract-broker-configuration-notice", label: "http://schemas.microsoft.com/SQL/ServiceBroker/BrokerConfigurationNotice", iconType: "broker-item" },
          { id: "contract-service-diagnostic", label: "http://schemas.microsoft.com/SQL/ServiceBroker/ServiceDiagnostic", iconType: "broker-item" },
          { id: "contract-service-echo", label: "http://schemas.microsoft.com/SQL/ServiceBroker/ServiceEcho", iconType: "broker-item" },
        ],
      },
    ],
  },
  {
    id: "master-queues",
    label: "Queues",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      {
        id: "master-system-queues",
        label: "System Queues",
        iconType: "folder",
        folderColor: "#e8c44d",
        children: [
          { id: "queue-event-notification-errors", label: "dbo.EventNotificationErrorsQueue", iconType: "table" },
          { id: "queue-query-notification-errors", label: "dbo.QueryNotificationErrorsQueue", iconType: "table" },
          { id: "queue-service-broker-queue", label: "dbo.ServiceBrokerQueue", iconType: "table" },
        ],
      },
    ],
  },
  {
    id: "master-services",
    label: "Services",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      {
        id: "master-system-services",
        label: "System Services",
        iconType: "folder",
        folderColor: "#e8c44d",
        children: [
          { id: "service-event-notification-service", label: "http://schemas.microsoft.com/SQL/Notifications/EventNotificationService", iconType: "broker-item" },
          { id: "service-query-notification-service", label: "http://schemas.microsoft.com/SQL/Notifications/QueryNotificationService", iconType: "broker-item" },
          { id: "service-service-broker", label: "http://schemas.microsoft.com/SQL/ServiceBroker/ServiceBroker", iconType: "broker-item" },
        ],
      },
    ],
  },
  {
    id: "master-routes",
    label: "Routes",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      { id: "route-auto-created-local", label: "AutoCreatedLocal", iconType: "broker-item" },
    ],
  },
  { id: "master-remote-service-binding", label: "Remote Service Binding", iconType: "folder", folderColor: "#e8c44d" },
  { id: "master-broker-priorities", label: "Broker Priorities", iconType: "folder", folderColor: "#e8c44d" },
]

const masterSystemViewsChildren: TreeNode[] = [
  { id: "view-dbo-spt-values", label: "dbo.spt_values", iconType: "view" },
  { id: "view-info-check-constraints", label: "INFORMATION_SCHEMA.CHECK_CONSTRAINTS", iconType: "view" },
  { id: "view-info-column-domain-usage", label: "INFORMATION_SCHEMA.COLUMN_DOMAIN_USAGE", iconType: "view" },
  { id: "view-info-column-privileges", label: "INFORMATION_SCHEMA.COLUMN_PRIVILEGES", iconType: "view" },
  { id: "view-info-columns", label: "INFORMATION_SCHEMA.COLUMNS", iconType: "view" },
  { id: "view-info-constraint-column-usage", label: "INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE", iconType: "view" },
  { id: "view-info-constraint-table-usage", label: "INFORMATION_SCHEMA.CONSTRAINT_TABLE_USAGE", iconType: "view" },
  { id: "view-info-domain-constraints", label: "INFORMATION_SCHEMA.DOMAIN_CONSTRAINTS", iconType: "view" },
  { id: "view-info-domains", label: "INFORMATION_SCHEMA.DOMAINS", iconType: "view" },
  { id: "view-info-key-column-usage", label: "INFORMATION_SCHEMA.KEY_COLUMN_USAGE", iconType: "view" },
  { id: "view-info-parameters", label: "INFORMATION_SCHEMA.PARAMETERS", iconType: "view" },
  { id: "view-info-referential-constraints", label: "INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS", iconType: "view" },
  { id: "view-info-routine-columns", label: "INFORMATION_SCHEMA.ROUTINE_COLUMNS", iconType: "view" },
  { id: "view-info-routines", label: "INFORMATION_SCHEMA.ROUTINES", iconType: "view" },
  { id: "view-info-schemata", label: "INFORMATION_SCHEMA.SCHEMATA", iconType: "view" },
  { id: "view-info-sequences", label: "INFORMATION_SCHEMA.SEQUENCES", iconType: "view" },
  { id: "view-info-table-constraints", label: "INFORMATION_SCHEMA.TABLE_CONSTRAINTS", iconType: "view" },
  { id: "view-info-table-privileges", label: "INFORMATION_SCHEMA.TABLE_PRIVILEGES", iconType: "view" },
  { id: "view-info-tables", label: "INFORMATION_SCHEMA.TABLES", iconType: "view" },
  { id: "view-info-view-column-usage", label: "INFORMATION_SCHEMA.VIEW_COLUMN_USAGE", iconType: "view" },
  { id: "view-info-view-table-usage", label: "INFORMATION_SCHEMA.VIEW_TABLE_USAGE", iconType: "view" },
  { id: "view-info-views", label: "INFORMATION_SCHEMA.VIEWS", iconType: "view" },
  { id: "view-sys-all-columns", label: "sys.all_columns", iconType: "view" },
  { id: "view-sys-all-objects", label: "sys.all_objects", iconType: "view" },
  { id: "view-sys-all-parameters", label: "sys.all_parameters", iconType: "view" },
  { id: "view-sys-all-sql-modules", label: "sys.all_sql_modules", iconType: "view" },
  { id: "view-sys-all-views", label: "sys.all_views", iconType: "view" },
  { id: "view-sys-allocation-units", label: "sys.allocation_units", iconType: "view" },
  { id: "view-sys-assemblies", label: "sys.assemblies", iconType: "view" },
  { id: "view-sys-assembly-files", label: "sys.assembly_files", iconType: "view" },
  { id: "view-sys-assembly-modules", label: "sys.assembly_modules", iconType: "view" },
  { id: "view-sys-assembly-references", label: "sys.assembly_references", iconType: "view" },
  { id: "view-sys-assembly-types", label: "sys.assembly_types", iconType: "view" },
  { id: "view-sys-asymmetric-keys", label: "sys.asymmetric_keys", iconType: "view" },
  { id: "view-sys-availability-databases-cluster", label: "sys.availability_databases_cluster", iconType: "view" },
  { id: "view-sys-availability-group-listener-ip-addresses", label: "sys.availability_group_listener_ip_addresses", iconType: "view" },
  { id: "view-sys-availability-group-listeners", label: "sys.availability_group_listeners", iconType: "view" },
  { id: "view-sys-availability-groups", label: "sys.availability_groups", iconType: "view" },
  { id: "view-sys-availability-groups-cluster", label: "sys.availability_groups_cluster", iconType: "view" },
  { id: "view-sys-availability-read-only-routing-lists", label: "sys.availability_read_only_routing_lists", iconType: "view" },
  { id: "view-sys-availability-replicas", label: "sys.availability_replicas", iconType: "view" },
  { id: "view-sys-backup-devices", label: "sys.backup_devices", iconType: "view" },
  { id: "view-sys-certificates", label: "sys.certificates", iconType: "view" },
  { id: "view-sys-change-tracking-databases", label: "sys.change_tracking_databases", iconType: "view" },
  { id: "view-sys-change-tracking-tables", label: "sys.change_tracking_tables", iconType: "view" },
  { id: "view-sys-check-constraints", label: "sys.check_constraints", iconType: "view" },
  { id: "view-sys-column-encryption-key-values", label: "sys.column_encryption_key_values", iconType: "view" },
  { id: "view-sys-column-encryption-keys", label: "sys.column_encryption_keys", iconType: "view" },
  { id: "view-sys-column-master-keys", label: "sys.column_master_keys", iconType: "view" },
  { id: "view-sys-column-store-dictionaries", label: "sys.column_store_dictionaries", iconType: "view" },
  { id: "view-sys-column-store-row-groups", label: "sys.column_store_row_groups", iconType: "view" },
  { id: "view-sys-column-store-segments", label: "sys.column_store_segments", iconType: "view" },
  { id: "view-sys-column-type-usages", label: "sys.column_type_usages", iconType: "view" },
  { id: "view-sys-column-xml-schema-collection-usages", label: "sys.column_xml_schema_collection_usages", iconType: "view" },
  { id: "view-sys-columns", label: "sys.columns", iconType: "view" },
  { id: "view-sys-computed-columns", label: "sys.computed_columns", iconType: "view" },
  { id: "view-sys-configurations", label: "sys.configurations", iconType: "view" },
  { id: "view-sys-conversation-endpoints", label: "sys.conversation_endpoints", iconType: "view" },
  { id: "view-sys-conversation-groups", label: "sys.conversation_groups", iconType: "view" },
  { id: "view-sys-conversation-priorities", label: "sys.conversation_priorities", iconType: "view" },
  { id: "view-sys-credentials", label: "sys.credentials", iconType: "view" },
  { id: "view-sys-crypt-properties", label: "sys.crypt_properties", iconType: "view" },
  { id: "view-sys-cryptographic-providers", label: "sys.cryptographic_providers", iconType: "view" },
  { id: "view-sys-data-spaces", label: "sys.data_spaces", iconType: "view" },
  { id: "view-sys-database-audit-specification-details", label: "sys.database_audit_specification_details", iconType: "view" },
  { id: "view-sys-database-automatic-tuning-configurations", label: "sys.database_automatic_tuning_configurations", iconType: "view" },
  { id: "view-sys-database-automatic-tuning-mode", label: "sys.database_automatic_tuning_mode", iconType: "view" },
  { id: "view-sys-database-automatic-tuning-options", label: "sys.database_automatic_tuning_options", iconType: "view" },
  { id: "view-sys-database-credentials", label: "sys.database_credentials", iconType: "view" },
  { id: "view-sys-database-files", label: "sys.database_files", iconType: "view" },
  { id: "view-sys-database-filestream-options", label: "sys.database_filestream_options", iconType: "view" },
  { id: "view-sys-database-ledger-blocks", label: "sys.database_ledger_blocks", iconType: "view" },
  { id: "view-sys-database-ledger-digest-locations", label: "sys.database_ledger_digest_locations", iconType: "view" },
  { id: "view-sys-database-ledger-transactions", label: "sys.database_ledger_transactions", iconType: "view" },
  { id: "view-sys-database-mirroring", label: "sys.database_mirroring", iconType: "view" },
  { id: "view-sys-database-mirroring-endpoints", label: "sys.database_mirroring_endpoints", iconType: "view" },
  { id: "view-sys-database-mirroring-witnesses", label: "sys.database_mirroring_witnesses", iconType: "view" },
  { id: "view-sys-database-permissions", label: "sys.database_permissions", iconType: "view" },
  { id: "view-sys-database-principals", label: "sys.database_principals", iconType: "view" },
  { id: "view-sys-database-query-store-internal-state", label: "sys.database_query_store_internal_state", iconType: "view" },
  { id: "view-sys-database-query-store-options", label: "sys.database_query_store_options", iconType: "view" },
  { id: "view-sys-database-recovery-status", label: "sys.database_recovery_status", iconType: "view" },
  { id: "view-sys-database-role-members", label: "sys.database_role_members", iconType: "view" },
  { id: "view-sys-database-scoped-configurations", label: "sys.database_scoped_configurations", iconType: "view" },
  { id: "view-sys-database-scoped-credentials", label: "sys.database_scoped_credentials", iconType: "view" },
  { id: "view-sys-databases", label: "sys.databases", iconType: "view" },
  { id: "view-sys-default-constraints", label: "sys.default_constraints", iconType: "view" },
  { id: "view-sys-destination-data-spaces", label: "sys.destination_data_spaces", iconType: "view" },
  { id: "view-sys-dm-audit-actions", label: "sys.dm_audit_actions", iconType: "view" },
  { id: "view-sys-dm-audit-class-type-map", label: "sys.dm_audit_class_type_map", iconType: "view" },
  { id: "view-sys-dm-broker-activated-tasks", label: "sys.dm_broker_activated_tasks", iconType: "view" },
  { id: "view-sys-dm-broker-connections", label: "sys.dm_broker_connections", iconType: "view" },
  { id: "view-sys-dm-broker-forwarded-messages", label: "sys.dm_broker_forwarded_messages", iconType: "view" },
  { id: "view-sys-dm-broker-queue-monitors", label: "sys.dm_broker_queue_monitors", iconType: "view" },
  { id: "view-sys-dm-cache-hit-stats", label: "sys.dm_cache_hit_stats", iconType: "view" },
  { id: "view-sys-dm-cache-size", label: "sys.dm_cache_size", iconType: "view" },
  { id: "view-sys-dm-cache-stats", label: "sys.dm_cache_stats", iconType: "view" },
]

const serverObjectsChildren: TreeNode[] = [
  { id: "server-objects-backup-devices", label: "Backup Devices", iconType: "folder", folderColor: "#e8c44d" },
  {
    id: "server-objects-linked-servers",
    label: "Linked Servers",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      {
        id: "server-objects-linked-servers-providers",
        label: "Providers",
        iconType: "folder",
        folderColor: "#e8c44d",
        children: [
          { id: "provider-adsdsoobject", label: "ADSDSOObject", iconType: "provider" },
          { id: "provider-ace-oledb-12", label: "Microsoft.ACE.OLEDB.12.0", iconType: "provider" },
          { id: "provider-ace-oledb-16", label: "Microsoft.ACE.OLEDB.16.0", iconType: "provider" },
          { id: "provider-msdaosp", label: "MSDAOSP", iconType: "provider" },
          { id: "provider-msdasql", label: "MSDASQL", iconType: "provider" },
          { id: "provider-msolap", label: "MSOLAP", iconType: "provider" },
          { id: "provider-msoledbsql", label: "MSOLEDBSQL", iconType: "provider" },
          { id: "provider-search-collator-dso", label: "Search.CollatorDSO", iconType: "provider" },
          { id: "provider-sqloledb", label: "SQLOLEDB", iconType: "provider" },
          { id: "provider-ssisoledb", label: "SSISOLEDB", iconType: "provider" },
        ],
      },
    ],
  },
  { id: "server-objects-triggers", label: "Triggers", iconType: "folder", folderColor: "#e8c44d", children: [{ id: "server-objects-trigger-leaf", label: "Server Trigger", iconType: "trigger" }] },
]

const replicationChildren: TreeNode[] = [
  {
    id: "replication-local-subscriptions",
    label: "Local Subscriptions",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [{ id: "replication-local-subscription", label: "Local Subscription", iconType: "subscription" }],
  },
]

const managementChildren: TreeNode[] = [
  {
    id: "management-policy-management",
    label: "Policy Management",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      { id: "management-policies", label: "Policies", iconType: "folder", folderColor: "#e8c44d", children: [{ id: "management-policy-leaf", label: "Policy", iconType: "policy" }] },
      { id: "management-conditions", label: "Conditions", iconType: "folder", folderColor: "#e8c44d", children: [{ id: "management-condition-leaf", label: "Condition", iconType: "policy" }] },
      { id: "management-facets", label: "Facets", iconType: "folder", folderColor: "#e8c44d", children: [{ id: "management-facet-leaf", label: "Facet", iconType: "policy" }] },
    ],
  },
  {
    id: "management-extended-events",
    label: "Extended Events",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      {
        id: "management-extended-events-sessions",
        label: "Sessions",
        iconType: "folder",
        folderColor: "#e8c44d",
        children: [
          { id: "event-session-alwayson-health", label: "AlwaysOn_health", iconType: "event-session" },
          { id: "event-session-system-health", label: "system_health", iconType: "event-session" },
          { id: "event-session-telemetry-events", label: "telemetry_events", iconType: "event-session" },
        ],
      },
    ],
  },
  {
    id: "management-sql-server-logs",
    label: "SQL Server Logs",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      { id: "log-current", label: "Current - 5/9/2026 3:39:00 PM", iconType: "log" },
      { id: "log-archive-1", label: "Archive #1 - 5/9/2026 3:01:00 PM", iconType: "log" },
      { id: "log-archive-2", label: "Archive #2 - 5/7/2026 8:33:00 PM", iconType: "log" },
      { id: "log-archive-3", label: "Archive #3 - 5/5/2026 9:50:00 AM", iconType: "log" },
      { id: "log-archive-4", label: "Archive #4 - 5/5/2026 7:58:00 AM", iconType: "log" },
      { id: "log-archive-5", label: "Archive #5 - 5/1/2026 9:17:00 AM", iconType: "log" },
      { id: "log-archive-6", label: "Archive #6 - 4/30/2026 6:03:00 PM", iconType: "log" },
    ],
  },
]

const xEventProfilerChildren: TreeNode[] = [
  { id: "xevent-profiler-standard", label: "Standard", iconType: "event-session" },
  { id: "xevent-profiler-tsql", label: "TSQL", iconType: "event-session" },
]

const masterStorageChildren: TreeNode[] = [
  { id: "master-full-text-stoplists", label: "Full Text Stoplists", iconType: "folder", folderColor: "#e8c44d" },
  { id: "master-partition-schemes", label: "Partition Schemes", iconType: "folder", folderColor: "#e8c44d" },
  { id: "master-partition-functions", label: "Partition Functions", iconType: "folder", folderColor: "#e8c44d" },
]

const masterProgrammabilityChildren: TreeNode[] = [
  {
    id: "master-stored-procedures",
    label: "Stored Procedures",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      {
        id: "master-system-stored-procedures",
        label: "System Stored Procedures",
        iconType: "folder",
        folderColor: "#e8c44d",
        children: [
          { id: "proc-dbo-sp-MScleanupmergepublisher", label: "dbo.sp_MScleanupmergepublisher", iconType: "procedure" },
          { id: "proc-dbo-sp-MSrepl-startup", label: "dbo.sp_MSrepl_startup", iconType: "procedure" },
          { id: "proc-sys-sp-add-agent-parameter", label: "sys.sp_add_agent_parameter", iconType: "procedure" },
          { id: "proc-sys-sp-add-agent-profile", label: "sys.sp_add_agent_profile", iconType: "procedure" },
          { id: "proc-sys-sp-add-columnstore-column-dictionary", label: "sys.sp_add_columnstore_column_dictionary", iconType: "procedure" },
          { id: "proc-sys-sp-add-data-file-recover-suspect-db", label: "sys.sp_add_data_file_recover_suspect_db", iconType: "procedure" },
          { id: "proc-sys-sp-add-log-file-recover-suspect-db", label: "sys.sp_add_log_file_recover_suspect_db", iconType: "procedure" },
          { id: "proc-sys-sp-add-log-shipping-alert-job", label: "sys.sp_add_log_shipping_alert_job", iconType: "procedure" },
          { id: "proc-sys-sp-add-log-shipping-primary-database", label: "sys.sp_add_log_shipping_primary_database", iconType: "procedure" },
          { id: "proc-sys-sp-add-log-shipping-primary-secondary", label: "sys.sp_add_log_shipping_primary_secondary", iconType: "procedure" },
          { id: "proc-sys-sp-add-log-shipping-secondary-database", label: "sys.sp_add_log_shipping_secondary_database", iconType: "procedure" },
          { id: "proc-sys-sp-add-log-shipping-secondary-primary", label: "sys.sp_add_log_shipping_secondary_primary", iconType: "procedure" },
          { id: "proc-sys-sp-addapprole", label: "sys.sp_addapprole", iconType: "procedure" },
          { id: "proc-sys-sp-addarticle", label: "sys.sp_addarticle", iconType: "procedure" },
          { id: "proc-sys-sp-addatype", label: "sys.sp_addatype", iconType: "procedure" },
          { id: "proc-sys-sp-adddatatype", label: "sys.sp_adddatatype", iconType: "procedure" },
          { id: "proc-sys-sp-adddatatypemapping", label: "sys.sp_adddatatypemapping", iconType: "procedure" },
          { id: "proc-sys-sp-adddistpublisher", label: "sys.sp_adddistpublisher", iconType: "procedure" },
          { id: "proc-sys-sp-adddistributiondb", label: "sys.sp_adddistributiondb", iconType: "procedure" },
          { id: "proc-sys-sp-adddistributor", label: "sys.sp_adddistributor", iconType: "procedure" },
          { id: "proc-sys-sp-adddynamicsnapshot-job", label: "sys.sp_adddynamicsnapshot_job", iconType: "procedure" },
          { id: "proc-sys-sp-addextendedproc", label: "sys.sp_addextendedproc", iconType: "procedure" },
          { id: "proc-sys-sp-addextendedproperty", label: "sys.sp_addextendedproperty", iconType: "procedure" },
          { id: "proc-sys-sp-addlinkedserver", label: "sys.sp_addlinkedserver", iconType: "procedure" },
          { id: "proc-sys-sp-addlinkedsrvlogin", label: "sys.sp_addlinkedsrvlogin", iconType: "procedure" },
          { id: "proc-sys-sp-addlogin", label: "sys.sp_addlogin", iconType: "procedure" },
          { id: "proc-sys-sp-addlogreader-agent", label: "sys.sp_addlogreader_agent", iconType: "procedure" },
          { id: "proc-sys-sp-addmergealternatepublisher", label: "sys.sp_addmergealternatepublisher", iconType: "procedure" },
          { id: "proc-sys-sp-addmergearticle", label: "sys.sp_addmergearticle", iconType: "procedure" },
          { id: "proc-sys-sp-addmergefilter", label: "sys.sp_addmergefilter", iconType: "procedure" },
          { id: "proc-sys-sp-addmergelogsettings", label: "sys.sp_addmergelogsettings", iconType: "procedure" },
          { id: "proc-sys-sp-addmergepartition", label: "sys.sp_addmergepartition", iconType: "procedure" },
          { id: "proc-sys-sp-addmergepublication", label: "sys.sp_addmergepublication", iconType: "procedure" },
          { id: "proc-sys-sp-addmergepullsubscription", label: "sys.sp_addmergepullsubscription", iconType: "procedure" },
          { id: "proc-sys-sp-addmergepullsubscription-agent", label: "sys.sp_addmergepullsubscription_agent", iconType: "procedure" },
          { id: "proc-sys-sp-addmergepushsubscription-agent", label: "sys.sp_addmergepushsubscription_agent", iconType: "procedure" },
          { id: "proc-sys-sp-addmergesubscription", label: "sys.sp_addmergesubscription", iconType: "procedure" },
          { id: "proc-sys-sp-addmessage", label: "sys.sp_addmessage", iconType: "procedure" },
          { id: "proc-sys-sp-addpublication", label: "sys.sp_addpublication", iconType: "procedure" },
          { id: "proc-sys-sp-addpublication-snapshot", label: "sys.sp_addpublication_snapshot", iconType: "procedure" },
          { id: "proc-sys-sp-addpullsubscription", label: "sys.sp_addpullsubscription", iconType: "procedure" },
          { id: "proc-sys-sp-addpullsubscription-agent", label: "sys.sp_addpullsubscription_agent", iconType: "procedure" },
          { id: "proc-sys-sp-addpushsubscription-agent", label: "sys.sp_addpushsubscription_agent", iconType: "procedure" },
          { id: "proc-sys-sp-addqreader-agent", label: "sys.sp_addqreader_agent", iconType: "procedure" },
          { id: "proc-sys-sp-addqueued-artinfo", label: "sys.sp_addqueued_artinfo", iconType: "procedure" },
          { id: "proc-sys-sp-addremotelogin", label: "sys.sp_addremotelogin", iconType: "procedure" },
          { id: "proc-sys-sp-addrole", label: "sys.sp_addrole", iconType: "procedure" },
          { id: "proc-sys-sp-addrolemember", label: "sys.sp_addrolemember", iconType: "procedure" },
          { id: "proc-sys-sp-addscriptexec", label: "sys.sp_addscriptexec", iconType: "procedure" },
          { id: "proc-sys-sp-addserver", label: "sys.sp_addserver", iconType: "procedure" },
          { id: "proc-sys-sp-addsrvrolemember", label: "sys.sp_addsrvrolemember", iconType: "procedure" },
          { id: "proc-sys-sp-addsubscriber", label: "sys.sp_addsubscriber", iconType: "procedure" },
          { id: "proc-sys-sp-addsubscriber-schedule", label: "sys.sp_addsubscriber_schedule", iconType: "procedure" },
          { id: "proc-sys-sp-addsubscription", label: "sys.sp_addsubscription", iconType: "procedure" },
          { id: "proc-sys-sp-addsync-triggers", label: "sys.sp_addsynctriggers", iconType: "procedure" },
          { id: "proc-sys-sp-addsynctriggerscore", label: "sys.sp_addsynctriggerscore", iconType: "procedure" },
          { id: "proc-sys-sp-addtabletocontents", label: "sys.sp_addtabletocontents", iconType: "procedure" },
          { id: "proc-sys-sp-addtype", label: "sys.sp_addtype", iconType: "procedure" },
          { id: "proc-sys-sp-addumpdevice", label: "sys.sp_addumpdevice", iconType: "procedure" },
          { id: "proc-sys-sp-adduser", label: "sys.sp_adduser", iconType: "procedure" },
          { id: "proc-sys-sp-adjustpublisheridentityrange", label: "sys.sp_adjustpublisheridentityrange", iconType: "procedure" },
          { id: "proc-sys-sp-altermessage", label: "sys.sp_altermessage", iconType: "procedure" },
          { id: "proc-sys-sp-approlepassword", label: "sys.sp_approlepassword", iconType: "procedure" },
          { id: "proc-sys-sp-article-validation", label: "sys.sp_article_validation", iconType: "procedure" },
          { id: "proc-sys-sp-articlecolumn", label: "sys.sp_articlecolumn", iconType: "procedure" },
          { id: "proc-sys-sp-articlefilter", label: "sys.sp_articlefilter", iconType: "procedure" },
          { id: "proc-sys-sp-articleview", label: "sys.sp_articleview", iconType: "procedure" },
          { id: "proc-sys-sp-assemblies-rowset", label: "sys.sp_assemblies_rowset", iconType: "procedure" },
          { id: "proc-sys-sp-assemblies-rowset-rmt", label: "sys.sp_assemblies_rowset_rmt", iconType: "procedure" },
          { id: "proc-sys-sp-assemblies-rowset2", label: "sys.sp_assemblies_rowset2", iconType: "procedure" },
          { id: "proc-sys-sp-assembly-dependencies-rowset", label: "sys.sp_assembly_dependencies_rowset", iconType: "procedure" },
          { id: "proc-sys-sp-assembly-dependencies-rowset-rmt", label: "sys.sp_assembly_dependencies_rowset_rmt", iconType: "procedure" },
          { id: "proc-sys-sp-assembly-dependencies-rowset2", label: "sys.sp_assembly_dependencies_rowset2", iconType: "procedure" },
          { id: "proc-sys-sp-attach-db", label: "sys.sp_attach_db", iconType: "procedure" },
          { id: "proc-sys-sp-attach-single-file-db", label: "sys.sp_attach_single_file_db", iconType: "procedure" },
          { id: "proc-sys-sp-attachsubscription", label: "sys.sp_attachsubscription", iconType: "procedure" },
          { id: "proc-sys-sp-autostats", label: "sys.sp_autostats", iconType: "procedure" },
          { id: "proc-sys-sp-bcp-dbcmptlevel", label: "sys.sp_bcp_dbcmptlevel", iconType: "procedure" },
          { id: "proc-sys-sp-bindefault", label: "sys.sp_bindefault", iconType: "procedure" },
          { id: "proc-sys-sp-bindrule", label: "sys.sp_bindrule", iconType: "procedure" },
          { id: "proc-sys-sp-browsemergesnapshotfolder", label: "sys.sp_browsemergesnapshotfolder", iconType: "procedure" },
          { id: "proc-sys-sp-browsereplcmds", label: "sys.sp_browsereplcmds", iconType: "procedure" },
          { id: "proc-sys-sp-browsesnapshotfolder", label: "sys.sp_browsesnapshotfolder", iconType: "procedure" },
          { id: "proc-sys-sp-can-tlog-be-applied", label: "sys.sp_can_tlog_be_applied", iconType: "procedure" },
          { id: "proc-sys-sp-catalogs", label: "sys.sp_catalogs", iconType: "procedure" },
          { id: "proc-sys-sp-catalogs-rowset", label: "sys.sp_catalogs_rowset", iconType: "procedure" },
          { id: "proc-sys-sp-catalogs-rowset-rmt", label: "sys.sp_catalogs_rowset_rmt", iconType: "procedure" },
          { id: "proc-sys-sp-catalogs-rowset2", label: "sys.sp_catalogs_rowset2", iconType: "procedure" },
          { id: "proc-sys-sp-cdc-add-job", label: "sys.sp_cdc_add_job", iconType: "procedure" },
          { id: "proc-sys-sp-cdc-change-job", label: "sys.sp_cdc_change_job", iconType: "procedure" },
          { id: "proc-sys-sp-cdc-cleanup-change-table", label: "sys.sp_cdc_cleanup_change_table", iconType: "procedure" },
          { id: "proc-sys-sp-cdc-dbsnapshotLSN", label: "sys.sp_cdc_dbsnapshotLSN", iconType: "procedure" },
          { id: "proc-sys-sp-cdc-disable-db", label: "sys.sp_cdc_disable_db", iconType: "procedure" },
          { id: "proc-sys-sp-cdc-disable-table", label: "sys.sp_cdc_disable_table", iconType: "procedure" },
          { id: "proc-sys-sp-cdc-drop-job", label: "sys.sp_cdc_drop_job", iconType: "procedure" },
          { id: "proc-sys-sp-cdc-enable-db", label: "sys.sp_cdc_enable_db", iconType: "procedure" },
          { id: "proc-sys-sp-cdc-enable-table", label: "sys.sp_cdc_enable_table", iconType: "procedure" },
          { id: "proc-sys-sp-cdc-scan", label: "sys.sp_cdc_scan", iconType: "procedure" },
          { id: "proc-sys-sp-cdc-start-job", label: "sys.sp_cdc_start_job", iconType: "procedure" },
          { id: "proc-sys-sp-cdc-stop-job", label: "sys.sp_cdc_stop_job", iconType: "procedure" },
          { id: "proc-sys-sp-cdc-upgrade", label: "sys.sp_cdc_upgrade", iconType: "procedure" },
          { id: "proc-sys-sp-cdc-vupgrade-databases", label: "sys.sp_cdc_vupgrade_databases", iconType: "procedure" },
          { id: "proc-sys-sp-certify-removable", label: "sys.sp_certify_removable", iconType: "procedure" },
          { id: "proc-sys-sp-change-agent-parameter", label: "sys.sp_change_agent_parameter", iconType: "procedure" },
          { id: "proc-sys-sp-change-agent-profile", label: "sys.sp_change_agent_profile", iconType: "procedure" },
          { id: "proc-sys-sp-change-feed-configure-parameters", label: "sys.sp_change_feed_configure_parameters", iconType: "procedure" },
          { id: "proc-sys-sp-change-feed-create-table-group", label: "sys.sp_change_feed_create_table_group", iconType: "procedure" },
          { id: "proc-sys-sp-change-feed-disable-db", label: "sys.sp_change_feed_disable_db", iconType: "procedure" },
          { id: "proc-sys-sp-change-feed-disable-table", label: "sys.sp_change_feed_disable_table", iconType: "procedure" },
          { id: "proc-sys-sp-change-feed-drop-table-group", label: "sys.sp_change_feed_drop_table_group", iconType: "procedure" },
          { id: "proc-sys-sp-change-feed-enable-db", label: "sys.sp_change_feed_enable_db", iconType: "procedure" },
          { id: "proc-sys-sp-change-feed-enable-table", label: "sys.sp_change_feed_enable_table", iconType: "procedure" },
          { id: "proc-sys-sp-change-feed-vupgrade", label: "sys.sp_change_feed_vupgrade", iconType: "procedure" },
          { id: "proc-sys-sp-change-log-shipping-primary-database", label: "sys.sp_change_log_shipping_primary_database", iconType: "procedure" },
          { id: "proc-sys-sp-change-log-shipping-secondary-database", label: "sys.sp_change_log_shipping_secondary_database", iconType: "procedure" },
          { id: "proc-sys-sp-change-log-shipping-secondary-primary", label: "sys.sp_change_log_shipping_secondary_primary", iconType: "procedure" },
          { id: "proc-sys-sp-change-repl-serverport", label: "sys.sp_change_repl_serverport", iconType: "procedure" },
          { id: "proc-sys-sp-change-subscription-properties", label: "sys.sp_change_subscription_properties", iconType: "procedure" },
          { id: "proc-sys-sp-change-users-login", label: "sys.sp_change_users_login", iconType: "procedure" },
          { id: "proc-sys-sp-changearticle", label: "sys.sp_changearticle", iconType: "procedure" },
          { id: "proc-sys-sp-changearticlecolumndatatype", label: "sys.sp_changearticlecolumndatatype", iconType: "procedure" },
          { id: "proc-sys-sp-changedbowner", label: "sys.sp_changedbowner", iconType: "procedure" },
          { id: "proc-sys-sp-changedistpublisher", label: "sys.sp_changedistpublisher", iconType: "procedure" },
          { id: "proc-sys-sp-changedistributiondb", label: "sys.sp_changedistributiondb", iconType: "procedure" },
          { id: "proc-sys-sp-changedistributor-password", label: "sys.sp_changedistributor_password", iconType: "procedure" },
          { id: "proc-sys-sp-changedistributor-property", label: "sys.sp_changedistributor_property", iconType: "procedure" },
          { id: "proc-sys-sp-changedynamicsnapshot-job", label: "sys.sp_changedynamicsnapshot_job", iconType: "procedure" },
          { id: "proc-sys-sp-changelogreader-agent", label: "sys.sp_changelogreader_agent", iconType: "procedure" },
          { id: "proc-sys-sp-changemergearticle", label: "sys.sp_changemergearticle", iconType: "procedure" },
          { id: "proc-sys-sp-changemergefilter", label: "sys.sp_changemergefilter", iconType: "procedure" },
          { id: "proc-sys-sp-changemergelogsettings", label: "sys.sp_changemergelogsettings", iconType: "procedure" },
          { id: "proc-sys-sp-changemergepublication", label: "sys.sp_changemergepublication", iconType: "procedure" },
          { id: "proc-sys-sp-changemergepullsubscription", label: "sys.sp_changemergepullsubscription", iconType: "procedure" },
          { id: "proc-sys-sp-changemergesubscription", label: "sys.sp_changemergesubscription", iconType: "procedure" },
          { id: "proc-sys-sp-changeobjectowner", label: "sys.sp_changeobjectowner", iconType: "procedure" },
          { id: "proc-sys-sp-changepublication", label: "sys.sp_changepublication", iconType: "procedure" },
          { id: "proc-sys-sp-changepublication-snapshot", label: "sys.sp_changepublication_snapshot", iconType: "procedure" },
          { id: "proc-sys-sp-changeqreader-agent", label: "sys.sp_changeqreader_agent", iconType: "procedure" },
          { id: "proc-sys-sp-changereplicationserverpasswords", label: "sys.sp_changereplicationserverpasswords", iconType: "procedure" },
          { id: "proc-sys-sp-changesubscriber", label: "sys.sp_changesubscriber", iconType: "procedure" },
          { id: "proc-sys-sp-changesubscriber-schedule", label: "sys.sp_changesubscriber_schedule", iconType: "procedure" },
          { id: "proc-sys-sp-changesubscription", label: "sys.sp_changesubscription", iconType: "procedure" },
          { id: "proc-sys-sp-changesubscriptiontsinfo", label: "sys.sp_changesubscriptiontsinfo", iconType: "procedure" },
          { id: "proc-sys-sp-changesubstatus", label: "sys.sp_changesubstatus", iconType: "procedure" },
          { id: "proc-sys-sp-check-constbytable-rowset", label: "sys.sp_check_constbytable_rowset", iconType: "procedure" },
          { id: "proc-sys-sp-check-constbytable-rowset2", label: "sys.sp_check_constbytable_rowset2", iconType: "procedure" },
          { id: "proc-sys-sp-check-constraints-rowset", label: "sys.sp_check_constraints_rowset", iconType: "procedure" },
          { id: "proc-sys-sp-check-constraints-rowset2", label: "sys.sp_check_constraints_rowset2", iconType: "procedure" },
          { id: "proc-sys-sp-check-dynamic-filters", label: "sys.sp_check_dynamic_filters", iconType: "procedure" },
          { id: "proc-sys-sp-check-for-sync-trigger", label: "sys.sp_check_for_sync_trigger", iconType: "procedure" },
          { id: "proc-sys-sp-check-join-filter", label: "sys.sp_check_join_filter", iconType: "procedure" },
          { id: "proc-sys-sp-check-log-shipping-monitor-alert", label: "sys.sp_check_log_shipping_monitor_alert", iconType: "procedure" },
          { id: "proc-sys-sp-check-publication-access", label: "sys.sp_check_publication_access", iconType: "procedure" },
          { id: "proc-sys-sp-check-removable", label: "sys.sp_check_removable", iconType: "procedure" },
          { id: "proc-sys-sp-check-subset-filter", label: "sys.sp_check_subset_filter", iconType: "procedure" },
          { id: "proc-sys-sp-check-sync-trigger", label: "sys.sp_check_sync_trigger", iconType: "procedure" },
          { id: "proc-sys-sp-checkinvalidarticle", label: "sys.sp_checkinvalidarticle", iconType: "procedure" },
          { id: "proc-sys-sp-checkOraclepackageversion", label: "sys.sp_checkOraclepackageversion", iconType: "procedure" },
          { id: "proc-sys-sp-clean-db-file-free-space", label: "sys.sp_clean_db_file_free_space", iconType: "procedure" },
          { id: "proc-sys-sp-clean-db-free-space", label: "sys.sp_clean_db_free_space", iconType: "procedure" },
          { id: "proc-sys-sp-cleanmergelogfiles", label: "sys.sp_cleanmergelogfiles", iconType: "procedure" },
          { id: "proc-sys-sp-cleanup-data-retention", label: "sys.sp_cleanup_data_retention", iconType: "procedure" },
          { id: "proc-sys-sp-cleanup-log-shipping-history", label: "sys.sp_cleanup_log_shipping_history", iconType: "procedure" },
          { id: "proc-sys-sp-cleanup-temporal-history", label: "sys.sp_cleanup_temporal_history", iconType: "procedure" },
          { id: "proc-sys-sp-cleanupdprelication", label: "sys.sp_cleanupdprelication", iconType: "procedure" },
          { id: "proc-sys-sp-column-privileges", label: "sys.sp_column_privileges", iconType: "procedure" },
          { id: "proc-sys-sp-column-privileges-ex", label: "sys.sp_column_privileges_ex", iconType: "procedure" },
          { id: "proc-sys-sp-column-privileges-rowset", label: "sys.sp_column_privileges_rowset", iconType: "procedure" },
          { id: "proc-sys-sp-column-privileges-rowset-rmt", label: "sys.sp_column_privileges_rowset_rmt", iconType: "procedure" },
          { id: "proc-sys-sp-column-privileges-rowset2", label: "sys.sp_column_privileges_rowset2", iconType: "procedure" },
          { id: "proc-sys-sp-columns", label: "sys.sp_columns", iconType: "procedure" },
          { id: "proc-sys-sp-columns-100", label: "sys.sp_columns_100", iconType: "procedure" },
          { id: "proc-sys-sp-columns-100-rowset", label: "sys.sp_columns_100_rowset", iconType: "procedure" },
          { id: "proc-sys-sp-columns-100-rowset2", label: "sys.sp_columns_100_rowset2", iconType: "procedure" },
          { id: "proc-sys-sp-columns-90", label: "sys.sp_columns_90", iconType: "procedure" },
          { id: "proc-sys-sp-columns-90-rowset", label: "sys.sp_columns_90_rowset", iconType: "procedure" },
          { id: "proc-sys-sp-columns-90-rowset-rmt", label: "sys.sp_columns_90_rowset_rmt", iconType: "procedure" },
          { id: "proc-sys-sp-columns-90-rowset2", label: "sys.sp_columns_90_rowset2", iconType: "procedure" },
          { id: "proc-sys-sp-columns-ex", label: "sys.sp_columns_ex", iconType: "procedure" },
          { id: "proc-sys-sp-columns-ex-100", label: "sys.sp_columns_ex_100", iconType: "procedure" },
          { id: "proc-sys-sp-columns-ex-90", label: "sys.sp_columns_ex_90", iconType: "procedure" },
          { id: "proc-sys-sp-columns-managed", label: "sys.sp_columns_managed", iconType: "procedure" },
          { id: "proc-sys-sp-columns-rowset", label: "sys.sp_columns_rowset", iconType: "procedure" },
          { id: "proc-sys-sp-columns-rowset-rmt", label: "sys.sp_columns_rowset_rmt", iconType: "procedure" },
          { id: "proc-sys-sp-columns-rowset2", label: "sys.sp_columns_rowset2", iconType: "procedure" },
          { id: "proc-sys-sp-configure", label: "sys.sp_configure", iconType: "procedure" },
          { id: "proc-sys-sp-configure-peerconflictdetection", label: "sys.sp_configure_peerconflictdetection", iconType: "procedure" },
          { id: "proc-sys-sp-constr-col-usage-rowset", label: "sys.sp_constr_col_usage_rowset", iconType: "procedure" },
          { id: "proc-sys-sp-constr-col-usage-rowset2", label: "sys.sp_constr_col_usage_rowset2", iconType: "procedure" },
          { id: "proc-sys-sp-control-plan-guide", label: "sys.sp_control_plan_guide", iconType: "procedure" },
          { id: "proc-sys-sp-copymergesnapshot", label: "sys.sp_copymergesnapshot", iconType: "procedure" },
          { id: "proc-sys-sp-copysnapshot", label: "sys.sp_copysnapshot", iconType: "procedure" },
          { id: "proc-sys-sp-copysubscription", label: "sys.sp_copysubscription", iconType: "procedure" },
          { id: "proc-sys-sp-create-plan-guide", label: "sys.sp_create_plan_guide", iconType: "procedure" },
          { id: "proc-sys-sp-create-plan-guide-from-handle", label: "sys.sp_create_plan_guide_from_handle", iconType: "procedure" },
          { id: "proc-sys-sp-create-removable", label: "sys.sp_create_removable", iconType: "procedure" },
          { id: "proc-sys-sp-create-streaming-job", label: "sys.sp_create_streaming_job", iconType: "procedure" },
          { id: "proc-sys-sp-createmergepalrole", label: "sys.sp_createmergepalrole", iconType: "procedure" },
          { id: "proc-sys-sp-createstats", label: "sys.sp_createstats", iconType: "procedure" },
          { id: "proc-sys-sp-createntpalrole", label: "sys.sp_createntpalrole", iconType: "procedure" },
          { id: "proc-sys-sp-cursor-list", label: "sys.sp_cursor_list", iconType: "procedure" },
          { id: "proc-sys-sp-cycle-errorlog", label: "sys.sp_cycle_errorlog", iconType: "procedure" },
          { id: "proc-sys-sp-data-pool-database-query-state", label: "sys.sp_data_pool_database_query_state", iconType: "procedure" },
          { id: "proc-sys-sp-data-pool-table-query-state", label: "sys.sp_data_pool_table_query_state", iconType: "procedure" },
          { id: "proc-sys-sp-data-source-objects", label: "sys.sp_data_source_objects", iconType: "procedure" },
          { id: "proc-sys-sp-data-source-table-columns", label: "sys.sp_data_source_table_columns", iconType: "procedure" },
          { id: "proc-sys-sp-databases", label: "sys.sp_databases", iconType: "procedure" },
          { id: "proc-sys-sp-datatype-info", label: "sys.sp_datatype_info", iconType: "procedure" },
          { id: "proc-sys-sp-datatype-info-100", label: "sys.sp_datatype_info_100", iconType: "procedure" },
          { id: "proc-sys-sp-datatype-info-90", label: "sys.sp_datatype_info_90", iconType: "procedure" },
          { id: "proc-sys-sp-db-ebcdic277-2", label: "sys.sp_db_ebcdic277_2", iconType: "procedure" },
          { id: "proc-sys-sp-db-increased-partitions", label: "sys.sp_db_increased_partitions", iconType: "procedure" },
          { id: "proc-sys-sp-db-selective-xml-index", label: "sys.sp_db_selective_xml_index", iconType: "procedure" },
          { id: "proc-sys-sp-db-vardecimal-storage-format", label: "sys.sp_db_vardecimal_storage_format", iconType: "procedure" },
          { id: "proc-sys-sp-dbcmptlevel", label: "sys.sp_dbcmptlevel", iconType: "procedure" },
          { id: "proc-sys-sp-dbfixedrolepermission", label: "sys.sp_dbfixedrolepermission", iconType: "procedure" },
          { id: "proc-sys-sp-dbmonitoraddmonitoring", label: "sys.sp_dbmonitoraddmonitoring", iconType: "procedure" },
          { id: "proc-sys-sp-dbmonitorchangealert", label: "sys.sp_dbmonitorchangealert", iconType: "procedure" },
          { id: "proc-sys-sp-dbmonitorchangemonitoring", label: "sys.sp_dbmonitorchangemonitoring", iconType: "procedure" },
          { id: "proc-sys-sp-dbmonitordropalert", label: "sys.sp_dbmonitordropalert", iconType: "procedure" },
          { id: "proc-sys-sp-dbmonitordropmonitoring", label: "sys.sp_dbmonitordropmonitoring", iconType: "procedure" },
          { id: "proc-sys-sp-dbmonitorhelpalert", label: "sys.sp_dbmonitorhelpalert", iconType: "procedure" },
          { id: "proc-sys-sp-dbmonitorhelpmonitoring", label: "sys.sp_dbmonitorhelpmonitoring", iconType: "procedure" },
          { id: "proc-sys-sp-dbmonitorresults", label: "sys.sp_dbmonitorresults", iconType: "procedure" },
          { id: "proc-sys-sp-dbmonitorupdate", label: "sys.sp_dbmonitorupdate", iconType: "procedure" },
          { id: "proc-sys-sp-dbremove", label: "sys.sp_dbremove", iconType: "procedure" },
          { id: "proc-sys-sp-ddopen", label: "sys.sp_ddopen", iconType: "procedure" },
          { id: "proc-sys-sp-defaultdb", label: "sys.sp_defaultdb", iconType: "procedure" },
          { id: "proc-sys-sp-defaultlanguage", label: "sys.sp_defaultlanguage", iconType: "procedure" },
          { id: "proc-sys-sp-delete-backup", label: "sys.sp_delete_backup", iconType: "procedure" },
          { id: "proc-sys-sp-delete-log-shipping-alert-job", label: "sys.sp_delete_log_shipping_alert_job", iconType: "procedure" },
          { id: "proc-sys-sp-delete-log-shipping-primary-database", label: "sys.sp_delete_log_shipping_primary_database", iconType: "procedure" },
          { id: "proc-sys-sp-delete-log-shipping-primary-secondary", label: "sys.sp_delete_log_shipping_primary_secondary", iconType: "procedure" },
          { id: "proc-sys-sp-delete-log-shipping-secondary-database", label: "sys.sp_delete_log_shipping_secondary_database", iconType: "procedure" },
          { id: "proc-sys-sp-delete-log-shipping-secondary-primary", label: "sys.sp_delete_log_shipping_secondary_primary", iconType: "procedure" },
          { id: "proc-sys-sp-deletemergeconflictrow", label: "sys.sp_deletemergeconflictrow", iconType: "procedure" },
          { id: "proc-sys-sp-deletepeerrequesthistory", label: "sys.sp_deletepeerrequesthistory", iconType: "procedure" },
          { id: "proc-sys-sp-deletetracertokenhistory", label: "sys.sp_deletetracertokenhistory", iconType: "procedure" },
          { id: "proc-sys-sp-denylogin", label: "sys.sp_denylogin", iconType: "procedure" },
          { id: "proc-sys-sp-depends", label: "sys.sp_depends", iconType: "procedure" },
          { id: "proc-sys-sp-describe-cursor", label: "sys.sp_describe_cursor", iconType: "procedure" },
          { id: "proc-sys-sp-describe-cursor-columns", label: "sys.sp_describe_cursor_columns", iconType: "procedure" },
          { id: "proc-sys-sp-describe-cursor-tables", label: "sys.sp_describe_cursor_tables", iconType: "procedure" },
          { id: "proc-sys-sp-detach-db", label: "sys.sp_detach_db", iconType: "procedure" },
          { id: "proc-sys-sp-disableagentoffload", label: "sys.sp_disableagentoffload", iconType: "procedure" },
          { id: "proc-sys-sp-discover-trident-table", label: "sys.sp_discover_trident_table", iconType: "procedure" },
          { id: "proc-sys-sp-distcounters", label: "sys.sp_distcounters", iconType: "procedure" },
          { id: "proc-sys-sp-drop-agent-parameter", label: "sys.sp_drop_agent_parameter", iconType: "procedure" },
          { id: "proc-sys-sp-drop-agent-profile", label: "sys.sp_drop_agent_profile", iconType: "procedure" },
          { id: "proc-sys-sp-drop-streaming-job", label: "sys.sp_drop_streaming_job", iconType: "procedure" },
          { id: "proc-sys-sp-drop-trident-data-location", label: "sys.sp_drop_trident_data_location", iconType: "procedure" },
          { id: "proc-sys-sp-dropanonymousagent", label: "sys.sp_dropanonymousagent", iconType: "procedure" },
          { id: "proc-sys-sp-dropanonymoussubscription", label: "sys.sp_dropanonymoussubscription", iconType: "procedure" },
          { id: "proc-sys-sp-dropapprole", label: "sys.sp_dropapprole", iconType: "procedure" },
          { id: "proc-sys-sp-droparticle", label: "sys.sp_droparticle", iconType: "procedure" },
          { id: "proc-sys-sp-dropdatatypemapping", label: "sys.sp_dropdatatypemapping", iconType: "procedure" },
          { id: "proc-sys-sp-dropdevice", label: "sys.sp_dropdevice", iconType: "procedure" },
          { id: "proc-sys-sp-dropdistpublisher", label: "sys.sp_dropdistpublisher", iconType: "procedure" },
          { id: "proc-sys-sp-dropdistributiondb", label: "sys.sp_dropdistributiondb", iconType: "procedure" },
          { id: "proc-sys-sp-dropdistributor", label: "sys.sp_dropdistributor", iconType: "procedure" },
          { id: "proc-sys-sp-dropdynamicsnapshot-job", label: "sys.sp_dropdynamicsnapshot_job", iconType: "procedure" },
          { id: "proc-sys-sp-dropextendedproc", label: "sys.sp_dropextendedproc", iconType: "procedure" },
          { id: "proc-sys-sp-dropextendedproperty", label: "sys.sp_dropextendedproperty", iconType: "procedure" },
          { id: "proc-sys-sp-droplinkedsrvlogin", label: "sys.sp_droplinkedsrvlogin", iconType: "procedure" },
          { id: "proc-sys-sp-droplogin", label: "sys.sp_droplogin", iconType: "procedure" },
          { id: "proc-sys-sp-dropmergealternatepublisher", label: "sys.sp_dropmergealternatepublisher", iconType: "procedure" },
          { id: "proc-sys-sp-dropmergearticle", label: "sys.sp_dropmergearticle", iconType: "procedure" },
          { id: "proc-sys-sp-dropmergefilter", label: "sys.sp_dropmergefilter", iconType: "procedure" },
          { id: "proc-sys-sp-dropmergelogsettings", label: "sys.sp_dropmergelogsettings", iconType: "procedure" },
          { id: "proc-sys-sp-dropmergepartition", label: "sys.sp_dropmergepartition", iconType: "procedure" },
          { id: "proc-sys-sp-dropmergepublication", label: "sys.sp_dropmergepublication", iconType: "procedure" },
          { id: "proc-sys-sp-dropmergepullsubscription", label: "sys.sp_dropmergepullsubscription", iconType: "procedure" },
          { id: "proc-sys-sp-dropmergesubscription", label: "sys.sp_dropmergesubscription", iconType: "procedure" },
          { id: "proc-sys-sp-dropmessage", label: "sys.sp_dropmessage", iconType: "procedure" },
          { id: "proc-sys-sp-droppublication", label: "sys.sp_droppublication", iconType: "procedure" },
          { id: "proc-sys-sp-droppublisher", label: "sys.sp_droppublisher", iconType: "procedure" },
          { id: "proc-sys-sp-droppullsubscription", label: "sys.sp_droppullsubscription", iconType: "procedure" },
        ],
      },
    ],
  },
  {
    id: "master-functions",
    label: "Functions",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      {
        id: "master-system-functions",
        label: "System Functions",
        iconType: "folder",
        folderColor: "#e8c44d",
        children: [
          {
            id: "master-table-valued-functions",
            label: "Table-valued Functions",
            iconType: "folder",
            folderColor: "#e8c44d",
            children: [
              { id: "fn-tv-1", label: "sys.dm_cryptographic_provider_algorithms", iconType: "function" },
              { id: "fn-tv-2", label: "sys.dm_cryptographic_provider_keys", iconType: "function" },
              { id: "fn-tv-3", label: "sys.dm_cryptographic_provider_sessions", iconType: "function" },
              { id: "fn-tv-4", label: "sys.dm_db_database_page_allocations", iconType: "function" },
              { id: "fn-tv-5", label: "sys.dm_db_incremental_stats_properties", iconType: "function" },
              { id: "fn-tv-6", label: "sys.dm_db_index_operational_stats", iconType: "function" },
              { id: "fn-tv-7", label: "sys.dm_db_index_physical_stats", iconType: "function" },
              { id: "fn-tv-8", label: "sys.dm_db_log_info", iconType: "function" },
              { id: "fn-tv-9", label: "sys.dm_db_log_stats", iconType: "function" },
              { id: "fn-tv-10", label: "sys.dm_db_missing_index_columns", iconType: "function" },
              { id: "fn-tv-11", label: "sys.dm_db_objects_disabled_on_compatibility_level_change", iconType: "function" },
              { id: "fn-tv-12", label: "sys.dm_db_page_info", iconType: "function" },
              { id: "fn-tv-13", label: "sys.dm_db_stats_histogram", iconType: "function" },
              { id: "fn-tv-14", label: "sys.dm_db_stats_properties", iconType: "function" },
              { id: "fn-tv-15", label: "sys.dm_db_stats_properties_internal", iconType: "function" },
              { id: "fn-tv-16", label: "sys.dm_db_xtp_hash_index_approx_stats", iconType: "function" },
              { id: "fn-tv-17", label: "sys.dm_exec_cached_plan_dependent_objects", iconType: "function" },
              { id: "fn-tv-18", label: "sys.dm_exec_cursors", iconType: "function" },
              { id: "fn-tv-19", label: "sys.dm_exec_describe_first_result_set", iconType: "function" },
              { id: "fn-tv-20", label: "sys.dm_exec_describe_first_result_set_for_object", iconType: "function" },
              { id: "fn-tv-21", label: "sys.dm_exec_input_buffer", iconType: "function" },
              { id: "fn-tv-22", label: "sys.dm_exec_plan_attributes", iconType: "function" },
              { id: "fn-tv-23", label: "sys.dm_exec_query_plan", iconType: "function" },
              { id: "fn-tv-24", label: "sys.dm_exec_query_plan_stats", iconType: "function" },
              { id: "fn-tv-25", label: "sys.dm_exec_query_statistics_xml", iconType: "function" },
              { id: "fn-tv-26", label: "sys.dm_exec_sql_text", iconType: "function" },
              { id: "fn-tv-27", label: "sys.dm_exec_text_query_plan", iconType: "function" },
              { id: "fn-tv-28", label: "sys.dm_exec_xml_handles", iconType: "function" },
              { id: "fn-tv-29", label: "sys.dm_fts_index_keywords", iconType: "function" },
              { id: "fn-tv-30", label: "sys.dm_fts_index_keywords_by_document", iconType: "function" },
              { id: "fn-tv-31", label: "sys.dm_fts_index_keywords_by_property", iconType: "function" },
              { id: "fn-tv-32", label: "sys.dm_fts_index_keywords_position_by_document", iconType: "function" },
              { id: "fn-tv-33", label: "sys.dm_fts_parser", iconType: "function" },
              { id: "fn-tv-34", label: "sys.dm_io_virtual_file_stats", iconType: "function" },
              { id: "fn-tv-35", label: "sys.dm_logconsumer_cachebufferrefs", iconType: "function" },
              { id: "fn-tv-36", label: "sys.dm_logconsumer_privatecachebuffers", iconType: "function" },
              { id: "fn-tv-37", label: "sys.dm_logpool_consumers", iconType: "function" },
              { id: "fn-tv-38", label: "sys.dm_logpool_sharedcachebuffers", iconType: "function" },
              { id: "fn-tv-39", label: "sys.dm_logpoolmgr_freepools", iconType: "function" },
              { id: "fn-tv-40", label: "sys.dm_logpoolmgr_respoolsize", iconType: "function" },
              { id: "fn-tv-41", label: "sys.dm_logpoolmgr_stats", iconType: "function" },
              { id: "fn-tv-42", label: "sys.dm_os_enumerate_filesystem", iconType: "function" },
              { id: "fn-tv-43", label: "sys.dm_os_file_exists", iconType: "function" },
              { id: "fn-tv-44", label: "sys.dm_os_volume_stats", iconType: "function" },
              { id: "fn-tv-45", label: "sys.dm_sql_referenced_entities", iconType: "function" },
              { id: "fn-tv-46", label: "sys.dm_sql_referencing_entities", iconType: "function" },
              { id: "fn-tv-47", label: "sys.dm_xcs_enumerate_blobdirectory", iconType: "function" },
              { id: "fn-tv-48", label: "sys.fn_builtin_permissions", iconType: "function" },
              { id: "fn-tv-49", label: "sys.fn_check_object_signatures", iconType: "function" },
              { id: "fn-tv-50", label: "sys.fn_column_store_row_groups", iconType: "function" },
              { id: "fn-tv-51", label: "sys.fn_db_backup_file_snapshots", iconType: "function" },
              { id: "fn-tv-52", label: "sys.fn_dblog_xtp", iconType: "function" },
              { id: "fn-tv-53", label: "sys.fn_dblog", iconType: "function" },
              { id: "fn-tv-54", label: "sys.fn_dump_dblog", iconType: "function" },
              { id: "fn-tv-55", label: "sys.fn_dump_dblog_xtp", iconType: "function" },
              { id: "fn-tv-56", label: "sys.fn_EnumCurrentPrincipals", iconType: "function" },
              { id: "fn-tv-57", label: "sys.fn_filedlog", iconType: "function" },
              { id: "fn-tv-58", label: "sys.fn_full_dblog", iconType: "function" },
              { id: "fn-tv-59", label: "sys.fn_get_audit_file", iconType: "function" },
              { id: "fn-tv-60", label: "sys.fn_get_sql", iconType: "function" },
              { id: "fn-tv-61", label: "sys.fn_hadr_distributed_ag_database_replica", iconType: "function" },
              { id: "fn-tv-62", label: "sys.fn_hadr_distributed_ag_replica", iconType: "function" },
              { id: "fn-tv-63", label: "sys.fn_helpcollations", iconType: "function" },
              { id: "fn-tv-64", label: "sys.fn_helpdatatypemap", iconType: "function" },
              { id: "fn-tv-65", label: "sys.fn_ledger_retrieve_digests_from_url", iconType: "function" },
              { id: "fn-tv-66", label: "sys.fn_listextendedproperty", iconType: "function" },
              { id: "fn-tv-67", label: "sys.fn_MSxe_read_event_stream", iconType: "function" },
              { id: "fn-tv-68", label: "sys.fn_my_permissions", iconType: "function" },
              { id: "fn-tv-69", label: "sys.fn_PageResCracker", iconType: "function" },
              { id: "fn-tv-70", label: "sys.fn_PhysLocCracker", iconType: "function" },
              { id: "fn-tv-71", label: "sys.fn_replgetcolfrombitmap", iconType: "function" },
              { id: "fn-tv-72", label: "sys.fn_RowDumpCracker", iconType: "function" },
              { id: "fn-tv-73", label: "sys.fn_servershareddrives", iconType: "function" },
              { id: "fn-tv-74", label: "sys.fn_sqlagent_job_history", iconType: "function" },
              { id: "fn-tv-75", label: "sys.fn_sqlagent_jobs", iconType: "function" },
              { id: "fn-tv-76", label: "sys.fn_sqlagent_jobsteps", iconType: "function" },
              { id: "fn-tv-77", label: "sys.fn_sqlagent_jobsteps_logs", iconType: "function" },
              { id: "fn-tv-78", label: "sys.fn_sqlagent_subsystems", iconType: "function" },
              { id: "fn-tv-79", label: "sys.fn_stmt_sql_handle_from_sql_stmt", iconType: "function" },
              { id: "fn-tv-80", label: "sys.fn_trace_geteventinfo", iconType: "function" },
              { id: "fn-tv-81", label: "sys.fn_trace_getfilterinfo", iconType: "function" },
              { id: "fn-tv-82", label: "sys.fn_trace_getinfo", iconType: "function" },
              { id: "fn-tv-83", label: "sys.fn_trace_gettable", iconType: "function" },
              { id: "fn-tv-84", label: "sys.fn_translate_permissions", iconType: "function" },
              { id: "fn-tv-85", label: "sys.fn_validate_plan_guide", iconType: "function" },
            ],
          },
          {
            id: "master-scalar-valued-functions",
            label: "Scalar-valued Functions",
            iconType: "folder",
            folderColor: "#e8c44d",
            children: [
              { id: "fn-sv-1", label: "sys.fn_cColvEntries_80", iconType: "function" },
              { id: "fn-sv-2", label: "sys.fn_cdc_check_parameters", iconType: "function" },
              { id: "fn-sv-3", label: "sys.fn_cdc_decrement_lsn", iconType: "function" },
              { id: "fn-sv-4", label: "sys.fn_cdc_get_column_ordinal", iconType: "function" },
              { id: "fn-sv-5", label: "sys.fn_cdc_get_max_lsn", iconType: "function" },
              { id: "fn-sv-6", label: "sys.fn_cdc_get_min_lsn", iconType: "function" },
              { id: "fn-sv-7", label: "sys.fn_cdc_has_column_changed", iconType: "function" },
              { id: "fn-sv-8", label: "sys.fn_cdc_hexstrtobin", iconType: "function" },
              { id: "fn-sv-9", label: "sys.fn_cdc_increment_lsn", iconType: "function" },
              { id: "fn-sv-10", label: "sys.fn_cdc_is_bit_set", iconType: "function" },
              { id: "fn-sv-11", label: "sys.fn_cdc_is_ddl_handling_enabled", iconType: "function" },
              { id: "fn-sv-12", label: "sys.fn_cdc_map_lsn_to_time", iconType: "function" },
              { id: "fn-sv-13", label: "sys.fn_cdc_map_time_to_lsn", iconType: "function" },
              { id: "fn-sv-14", label: "sys.fn_IsCollTracked", iconType: "function" },
              { id: "fn-sv-15", label: "sys.fn_GetCurrentPrincipal", iconType: "function" },
              { id: "fn-sv-16", label: "sys.fn_getproviderstring", iconType: "function" },
              { id: "fn-sv-17", label: "sys.fn_GetRowsetIdFromRowDump", iconType: "function" },
              { id: "fn-sv-18", label: "sys.fn_getserverportfromproviderstring", iconType: "function" },
              { id: "fn-sv-19", label: "sys.fn_hadr_backup_is_preferred_replica", iconType: "function" },
              { id: "fn-sv-20", label: "sys.fn_hadr_is_primary_replica", iconType: "function" },
              { id: "fn-sv-21", label: "sys.fn_hadr_is_same_replica", iconType: "function" },
              { id: "fn-sv-22", label: "sys.fn_IsBitSetInBitmap", iconType: "function" },
              { id: "fn-sv-23", label: "sys.fn_isrolemember", iconType: "function" },
              { id: "fn-sv-24", label: "sys.fn_MapSchemaType", iconType: "function" },
              { id: "fn-sv-25", label: "sys.fn_MSdaysnumber", iconType: "function" },
              { id: "fn-sv-26", label: "sys.fn_MSgeneration_downloadonly", iconType: "function" },
              { id: "fn-sv-27", label: "sys.fn_MSget_dynamic_filter_login", iconType: "function" },
              { id: "fn-sv-28", label: "sys.fn_MSorbitmaps", iconType: "function" },
              { id: "fn-sv-29", label: "sys.fn_MSrepl_getsvidfromdistdb", iconType: "function" },
              { id: "fn-sv-30", label: "sys.fn_MSrepl_map_resolver_clsid", iconType: "function" },
              { id: "fn-sv-31", label: "sys.fn_MStestbit", iconType: "function" },
              { id: "fn-sv-32", label: "sys.fn_MSvector_downloadonly", iconType: "function" },
              { id: "fn-sv-33", label: "sys.fn_numberOf1InBinaryAfterLoc", iconType: "function" },
              { id: "fn-sv-34", label: "sys.fn_numberOf1InVarBinary", iconType: "function" },
              { id: "fn-sv-35", label: "sys.fn_PhysLocFormatter", iconType: "function" },
              { id: "fn-sv-36", label: "sys.fn_repl_hash_binary", iconType: "function" },
              { id: "fn-sv-37", label: "sys.fn_repladjustcolumnmap", iconType: "function" },
              { id: "fn-sv-38", label: "sys.fn_repldecryptver4", iconType: "function" },
              { id: "fn-sv-39", label: "sys.fn_replformatdatetime", iconType: "function" },
              { id: "fn-sv-40", label: "sys.fn_replgetparseddlcmd", iconType: "function" },
              { id: "fn-sv-41", label: "sys.fn_replp2versiontotranid", iconType: "function" },
              { id: "fn-sv-42", label: "sys.fn_replreplacesinglequote", iconType: "function" },
              { id: "fn-sv-43", label: "sys.fn_replreplacesinglequoteplusprotectstring", iconType: "function" },
              { id: "fn-sv-44", label: "sys.fn_repluniquename", iconType: "function" },
              { id: "fn-sv-45", label: "sys.fn_replvarbintoint", iconType: "function" },
              { id: "fn-sv-46", label: "sys.fn_sqlvarbasetostr", iconType: "function" },
              { id: "fn-sv-47", label: "sys.fn_varbintohexstr", iconType: "function" },
              { id: "fn-sv-48", label: "sys.fn_varbintohexsubstring", iconType: "function" },
              { id: "fn-sv-49", label: "sys.fn_yukonsecuritymodelrequired", iconType: "function" },
            ],
          },
        ],
      },
      {
        id: "master-functions-table-valued",
        label: "Table-valued Functions",
        iconType: "folder",
        folderColor: "#e8c44d",
      },
      {
        id: "master-functions-scalar-valued",
        label: "Scalar-valued Functions",
        iconType: "folder",
        folderColor: "#e8c44d",
      },
    ],
  },
  {
    id: "master-extended-stored-procedures",
    label: "Extended Stored Procedures",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      {
        id: "master-system-extended-stored-procedures",
        label: "System Extended Stored Procedures",
        iconType: "folder",
        folderColor: "#e8c44d",
        children: [
          { id: "xproc-1", label: "sys.sp_add_trusted_assembly", iconType: "procedure" },
          { id: "xproc-2", label: "sys.sp_AddFunctionalUnitToComponent", iconType: "procedure" },
          { id: "xproc-3", label: "sys.sp_alter_nt_job_mem_configs", iconType: "procedure" },
          { id: "xproc-4", label: "sys.sp_audit_write", iconType: "procedure" },
          { id: "xproc-5", label: "sys.sp_autoindex_cancel_dta", iconType: "procedure" },
          { id: "xproc-6", label: "sys.sp_autoindex_invoke_dta", iconType: "procedure" },
          { id: "xproc-7", label: "sys.sp_availability_group_command_internal", iconType: "procedure" },
          { id: "xproc-8", label: "sys.sp_begin_parallel_nested_tran", iconType: "procedure" },
          { id: "xproc-9", label: "sys.sp_bindsession", iconType: "procedure" },
          { id: "xproc-10", label: "sys.sp_build_histogram", iconType: "procedure" },
          { id: "xproc-11", label: "sys.sp_cdc_set_scheduler_job", iconType: "procedure" },
          { id: "xproc-12", label: "sys.sp_certificate_add_issuer", iconType: "procedure" },
          { id: "xproc-13", label: "sys.sp_certificate_drop_issuer", iconType: "procedure" },
          { id: "xproc-14", label: "sys.sp_certificate_issuers", iconType: "procedure" },
          { id: "xproc-15", label: "sys.sp_change_tracking_waitforchanges", iconType: "procedure" },
          { id: "xproc-16", label: "sys.sp_cleanup_all_average_column_length_statistics", iconType: "procedure" },
          { id: "xproc-17", label: "sys.sp_cleanup_all_openrowset_statistics", iconType: "procedure" },
          { id: "xproc-18", label: "sys.sp_cleanup_all_user_data_in_master", iconType: "procedure" },
          { id: "xproc-19", label: "sys.sp_cloud_update_blob_tier", iconType: "procedure" },
          { id: "xproc-20", label: "sys.sp_collect_backend_plan", iconType: "procedure" },
          { id: "xproc-21", label: "sys.sp_commit_parallel_nested_tran", iconType: "procedure" },
          { id: "xproc-22", label: "sys.sp_configure_automatic_tuning", iconType: "procedure" },
          { id: "xproc-23", label: "sys.sp_control_dbmasterkey_password", iconType: "procedure" },
          { id: "xproc-24", label: "sys.sp_copy_data_in_batches", iconType: "procedure" },
          { id: "xproc-25", label: "sys.sp_create_asymmetric_key_from_external_key", iconType: "procedure" },
          { id: "xproc-26", label: "sys.sp_create_format_type", iconType: "procedure" },
          { id: "xproc-27", label: "sys.sp_create_format_type_synonym", iconType: "procedure" },
          { id: "xproc-28", label: "sys.sp_create_openrowset_statistics", iconType: "procedure" },
          { id: "xproc-29", label: "sys.sp_create_parser_version", iconType: "procedure" },
          { id: "xproc-30", label: "sys.sp_creatorphan", iconType: "procedure" },
          { id: "xproc-31", label: "sys.sp_cursor", iconType: "procedure" },
          { id: "xproc-32", label: "sys.sp_cursorclose", iconType: "procedure" },
          { id: "xproc-33", label: "sys.sp_cursorexecute", iconType: "procedure" },
          { id: "xproc-34", label: "sys.sp_cursorfetch", iconType: "procedure" },
          { id: "xproc-35", label: "sys.sp_cursoropen", iconType: "procedure" },
          { id: "xproc-36", label: "sys.sp_cursoroption", iconType: "procedure" },
          { id: "xproc-37", label: "sys.sp_cursorprepare", iconType: "procedure" },
          { id: "xproc-38", label: "sys.sp_cursorprepexec", iconType: "procedure" },
          { id: "xproc-39", label: "sys.sp_cursorunprepare", iconType: "procedure" },
          { id: "xproc-40", label: "sys.sp_delete_backup_file_snapshot", iconType: "procedure" },
          { id: "xproc-41", label: "sys.sp_delete_database_engine_configuration_internal", iconType: "procedure" },
          { id: "xproc-42", label: "sys.sp_delete_http_namespace_reservation", iconType: "procedure" },
          { id: "xproc-43", label: "sys.sp_describe_first_result_set", iconType: "procedure" },
          { id: "xproc-44", label: "sys.sp_describe_parameter_encryption", iconType: "procedure" },
          { id: "xproc-45", label: "sys.sp_describe_undeclared_parameters", iconType: "procedure" },
          { id: "xproc-46", label: "sys.sp_diagnostic_showplan_log_dbid", iconType: "procedure" },
          { id: "xproc-47", label: "sys.sp_drop_format_type", iconType: "procedure" },
          { id: "xproc-48", label: "sys.sp_drop_openrowset_statistics", iconType: "procedure" },
          { id: "xproc-49", label: "sys.sp_drop_parser_version", iconType: "procedure" },
          { id: "xproc-50", label: "sys.sp_drop_storage_location", iconType: "procedure" },
          { id: "xproc-51", label: "sys.sp_drop_trusted_assembly", iconType: "procedure" },
          { id: "xproc-52", label: "sys.sp_droporphans", iconType: "procedure" },
          { id: "xproc-53", label: "sys.sp_dw_physical_manifest_file_table_insert", iconType: "procedure" },
          { id: "xproc-54", label: "sys.sp_dw_physical_upsert", iconType: "procedure" },
          { id: "xproc-55", label: "sys.sp_enable_sql_debug", iconType: "procedure" },
          { id: "xproc-56", label: "sys.sp_enclave_send_keys", iconType: "procedure" },
          { id: "xproc-57", label: "sys.sp_execute", iconType: "procedure" },
          { id: "xproc-58", label: "sys.sp_execute_external_script", iconType: "procedure" },
          { id: "xproc-59", label: "sys.sp_execute_flight_query", iconType: "procedure" },
          { id: "xproc-60", label: "sys.sp_execute_remote", iconType: "procedure" },
          { id: "xproc-61", label: "sys.sp_executesql", iconType: "procedure" },
          { id: "xproc-62", label: "sys.sp_executesql_metrics", iconType: "procedure" },
          { id: "xproc-63", label: "sys.sp_external_policy_refresh", iconType: "procedure" },
          { id: "xproc-64", label: "sys.sp_fido_build_basic_histogram", iconType: "procedure" },
          { id: "xproc-65", label: "sys.sp_fido_build_histogram", iconType: "procedure" },
          { id: "xproc-66", label: "sys.sp_fido_execute_graph_request", iconType: "procedure" },
          { id: "xproc-67", label: "sys.sp_fido_get_CS_rowset_row_count", iconType: "procedure" },
          { id: "xproc-68", label: "sys.sp_fido_get_remote_storage_size", iconType: "procedure" },
          { id: "xproc-69", label: "sys.sp_fido_glm_server_execute_batch", iconType: "procedure" },
          { id: "xproc-70", label: "sys.sp_fido_glms_execute_command", iconType: "procedure" },
          { id: "xproc-71", label: "sys.sp_fido_glms_get_storage_containers", iconType: "procedure" },
          { id: "xproc-72", label: "sys.sp_fido_glms_set_storage_containers", iconType: "procedure" },
          { id: "xproc-73", label: "sys.sp_fido_glms_unregister_appname", iconType: "procedure" },
          { id: "xproc-74", label: "sys.sp_fido_indexstore_update_topology", iconType: "procedure" },
          { id: "xproc-75", label: "sys.sp_fido_indexstore_upgrade_node", iconType: "procedure" },
          { id: "xproc-76", label: "sys.sp_fido_remove_retention_policy", iconType: "procedure" },
          { id: "xproc-77", label: "sys.sp_fido_set_ddl_step", iconType: "procedure" },
          { id: "xproc-78", label: "sys.sp_fido_set_retention_policy", iconType: "procedure" },
          { id: "xproc-79", label: "sys.sp_fido_set_tran", iconType: "procedure" },
          { id: "xproc-80", label: "sys.sp_fido_setup_endpoints", iconType: "procedure" },
          { id: "xproc-81", label: "sys.sp_fido_setup_glms", iconType: "procedure" },
          { id: "xproc-82", label: "sys.sp_fido_tran_abort", iconType: "procedure" },
          { id: "xproc-83", label: "sys.sp_fido_tran_begin", iconType: "procedure" },
          { id: "xproc-84", label: "sys.sp_defaultdb", iconType: "procedure" },
          { id: "xproc-85", label: "sys.sp_defaultlanguage", iconType: "procedure" },
          { id: "xproc-86", label: "sys.sp_delete_backup", iconType: "procedure" },
          { id: "xproc-87", label: "sys.sp_delete_log_shipping_alert_job", iconType: "procedure" },
          { id: "xproc-88", label: "sys.sp_delete_log_shipping_primary_database", iconType: "procedure" },
          { id: "xproc-89", label: "sys.sp_delete_log_shipping_primary_secondary", iconType: "procedure" },
          { id: "xproc-90", label: "sys.sp_delete_log_shipping_secondary_database", iconType: "procedure" },
          { id: "xproc-91", label: "sys.sp_delete_log_shipping_secondary_primary", iconType: "procedure" },
          { id: "xproc-92", label: "sys.sp_deletemergeconflictrow", iconType: "procedure" },
          { id: "xproc-93", label: "sys.sp_deletepeerrequesthistory", iconType: "procedure" },
          { id: "xproc-94", label: "sys.sp_deletetracertokenhistory", iconType: "procedure" },
          { id: "xproc-95", label: "sys.sp_denylogin", iconType: "procedure" },
          { id: "xproc-96", label: "sys.sp_depends", iconType: "procedure" },
          { id: "xproc-97", label: "sys.sp_describe_cursor", iconType: "procedure" },
          { id: "xproc-98", label: "sys.sp_describe_cursor_columns", iconType: "procedure" },
          { id: "xproc-99", label: "sys.sp_describe_cursor_tables", iconType: "procedure" },
          { id: "xproc-100", label: "sys.sp_detach_db", iconType: "procedure" },
          { id: "xproc-101", label: "sys.sp_disableagentoffload", iconType: "procedure" },
          { id: "xproc-102", label: "sys.sp_discover_trident_table", iconType: "procedure" },
          { id: "xproc-103", label: "sys.sp_distcounters", iconType: "procedure" },
          { id: "xproc-104", label: "sys.sp_drop_agent_parameter", iconType: "procedure" },
          { id: "xproc-105", label: "sys.sp_drop_agent_profile", iconType: "procedure" },
          { id: "xproc-106", label: "sys.sp_drop_streaming_job", iconType: "procedure" },
          { id: "xproc-107", label: "sys.sp_drop_trident_data_location", iconType: "procedure" },
          { id: "xproc-108", label: "sys.sp_dropanonymousagent", iconType: "procedure" },
          { id: "xproc-109", label: "sys.sp_dropanonymoussubscription", iconType: "procedure" },
          { id: "xproc-110", label: "sys.sp_dropapprole", iconType: "procedure" },
          { id: "xproc-111", label: "sys.sp_droparticle", iconType: "procedure" },
          { id: "xproc-112", label: "sys.sp_dropdatatypemapping", iconType: "procedure" },
          { id: "xproc-113", label: "sys.sp_dropdevice", iconType: "procedure" },
          { id: "xproc-114", label: "sys.sp_droppublisher", iconType: "procedure" },
          { id: "xproc-115", label: "sys.sp_dropdistributiondb", iconType: "procedure" },
          { id: "xproc-116", label: "sys.sp_dropdistributor", iconType: "procedure" },
          { id: "xproc-117", label: "sys.sp_dropdynamicsnapshot_job", iconType: "procedure" },
          { id: "xproc-118", label: "sys.sp_dropextendedproc", iconType: "procedure" },
          { id: "xproc-119", label: "sys.sp_dropextendedproperty", iconType: "procedure" },
          { id: "xproc-120", label: "sys.sp_droplinkedsrvlogin", iconType: "procedure" },
          { id: "xproc-121", label: "sys.sp_droplogin", iconType: "procedure" },
          { id: "xproc-122", label: "sys.sp_dropmergealternatepublisher", iconType: "procedure" },
          { id: "xproc-123", label: "sys.sp_dropmergearticle", iconType: "procedure" },
          { id: "xproc-124", label: "sys.sp_dropmergefilter", iconType: "procedure" },
          { id: "xproc-125", label: "sys.sp_dropmergelogsettings", iconType: "procedure" },
          { id: "xproc-126", label: "sys.sp_dropmergepartition", iconType: "procedure" },
          { id: "xproc-127", label: "sys.sp_dropmergepublication", iconType: "procedure" },
          { id: "xproc-128", label: "sys.sp_dropmergepullsubscription", iconType: "procedure" },
          { id: "xproc-129", label: "sys.sp_dropmergesubscription", iconType: "procedure" },
          { id: "xproc-130", label: "sys.sp_dropmessage", iconType: "procedure" },
          { id: "xproc-131", label: "sys.sp_droppublication", iconType: "procedure" },
          { id: "xproc-132", label: "sys.sp_droppublisher", iconType: "procedure" },
          { id: "xproc-133", label: "sys.sp_droppullsubscription", iconType: "procedure" },
        ],
      },
    ],
  },
  { id: "master-database-triggers", label: "Database Triggers", iconType: "folder", folderColor: "#e8c44d" },
  {
    id: "master-assemblies",
    label: "Assemblies",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [{ id: "master-assembly-microsoft-types", label: "Microsoft.SqlServer.Types", iconType: "assembly" }],
  },
  {
    id: "master-types",
    label: "Types",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      {
        id: "master-system-data-types",
        label: "System Data Types",
        iconType: "folder",
        folderColor: "#e8c44d",
        children: [
          {
            id: "master-exact-numerics",
            label: "Exact Numerics",
            iconType: "folder",
            folderColor: "#e8c44d",
            children: [
              { id: "type-bit", label: "bit", iconType: "column" },
              { id: "type-tinyint", label: "tinyint", iconType: "column" },
              { id: "type-smallint", label: "smallint", iconType: "column" },
              { id: "type-int", label: "int", iconType: "column" },
              { id: "type-bigint", label: "bigint", iconType: "column" },
              { id: "type-numeric", label: "numeric", iconType: "column" },
              { id: "type-decimal", label: "decimal", iconType: "column" },
              { id: "type-smallmoney", label: "smallmoney", iconType: "column" },
              { id: "type-money", label: "money", iconType: "column" },
            ],
          },
          {
            id: "master-approximate-numerics",
            label: "Approximate Numerics",
            iconType: "folder",
            folderColor: "#e8c44d",
            children: [
              { id: "type-float", label: "float", iconType: "column" },
              { id: "type-real", label: "real", iconType: "column" },
            ],
          },
          {
            id: "master-date-time",
            label: "Date and Time",
            iconType: "folder",
            folderColor: "#e8c44d",
            children: [
              { id: "type-datetime", label: "datetime", iconType: "column" },
              { id: "type-smalldatetime", label: "smalldatetime", iconType: "column" },
              { id: "type-time", label: "time", iconType: "column" },
              { id: "type-date", label: "date", iconType: "column" },
              { id: "type-datetimeoffset", label: "datetimeoffset", iconType: "column" },
              { id: "type-datetime2", label: "datetime2", iconType: "column" },
            ],
          },
          {
            id: "master-character-strings",
            label: "Character Strings",
            iconType: "folder",
            folderColor: "#e8c44d",
            children: [
              { id: "type-char", label: "char", iconType: "column" },
              { id: "type-varchar", label: "varchar", iconType: "column" },
              { id: "type-text", label: "text", iconType: "column" },
            ],
          },
          {
            id: "master-unicode-character-strings",
            label: "Unicode Character Strings",
            iconType: "folder",
            folderColor: "#e8c44d",
            children: [
              { id: "type-nchar", label: "nchar", iconType: "column" },
              { id: "type-nvarchar", label: "nvarchar", iconType: "column" },
              { id: "type-ntext", label: "ntext", iconType: "column" },
            ],
          },
          {
            id: "master-binary-strings",
            label: "Binary Strings",
            iconType: "folder",
            folderColor: "#e8c44d",
            children: [
              { id: "type-binary", label: "binary", iconType: "column" },
              { id: "type-varbinary", label: "varbinary", iconType: "column" },
              { id: "type-image", label: "image", iconType: "column" },
            ],
          },
          {
            id: "master-other-data-types",
            label: "Other Data Types",
            iconType: "folder",
            folderColor: "#e8c44d",
            children: [
              { id: "type-sql-variant", label: "sql_variant", iconType: "column" },
              { id: "type-timestamp", label: "timestamp", iconType: "column" },
              { id: "type-uniqueidentifier", label: "uniqueidentifier", iconType: "column" },
              { id: "type-xml", label: "xml", iconType: "column" },
            ],
          },
          {
            id: "master-clr-data-types",
            label: "CLR Data Types",
            iconType: "folder",
            folderColor: "#e8c44d",
            children: [{ id: "type-hierarchyid", label: "hierarchyid", iconType: "column" }],
          },
          {
            id: "master-spatial-data-types",
            label: "Spatial Data Types",
            iconType: "folder",
            folderColor: "#e8c44d",
            children: [
              { id: "type-geometry", label: "geometry", iconType: "column" },
              { id: "type-geography", label: "geography", iconType: "column" },
            ],
          },
        ],
      },
      { id: "master-user-defined-data-types", label: "User-Defined Data Types", iconType: "folder", folderColor: "#e8c44d" },
      { id: "master-user-defined-table-types", label: "User-Defined Table Types", iconType: "folder", folderColor: "#e8c44d" },
      { id: "master-user-defined-types", label: "User-Defined Types", iconType: "folder", folderColor: "#e8c44d" },
      { id: "master-xml-schema-collections", label: "XML Schema Collections", iconType: "folder", folderColor: "#e8c44d" },
      { id: "master-rules", label: "Rules", iconType: "folder", folderColor: "#e8c44d" },
      { id: "master-defaults", label: "Defaults", iconType: "folder", folderColor: "#e8c44d" },
    ],
  },
]

const masterTableCommonChildren = (prefix: string): TreeNode[] => [
  { id: `${prefix}-keys`, label: "Keys", iconType: "folder", folderColor: "#e8c44d" },
  { id: `${prefix}-constraints`, label: "Constraints", iconType: "folder", folderColor: "#e8c44d" },
  { id: `${prefix}-triggers`, label: "Triggers", iconType: "folder", folderColor: "#e8c44d" },
  { id: `${prefix}-indexes`, label: "Indexes", iconType: "folder", folderColor: "#e8c44d" },
]

const msReplicationOptionsChildren: TreeNode[] = [
  {
    id: "msreplication-options-columns",
    label: "Columns",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      { id: "msrep-optname", label: "optname (sysname(nvarchar(128)), not null)", iconType: "column" },
      { id: "msrep-value", label: "value (bit, not null)", iconType: "column" },
      { id: "msrep-major-version", label: "major_version (int, not null)", iconType: "column" },
      { id: "msrep-minor-version", label: "minor_version (int, not null)", iconType: "column" },
      { id: "msrep-revision", label: "revision (int, not null)", iconType: "column" },
      { id: "msrep-install-failures", label: "install_failures (int, not null)", iconType: "column" },
    ],
  },
  ...masterTableCommonChildren("msreplication-options"),
  {
    id: "msreplication-options-statistics",
    label: "Statistics",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [{ id: "msreplication-options-wa", label: "_WA_Sys_00000001_7D98A078", iconType: "statistics" }],
  },
]

const sptFallbackDbChildren: TreeNode[] = [
  {
    id: "spt-fallback-db-columns",
    label: "Columns",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      { id: "spt-fallback-db-xserver-name", label: "xserver_name (varchar(30), not null)", iconType: "column" },
      { id: "spt-fallback-db-xtdtm-ins", label: "xtdtm_ins (datetime, not null)", iconType: "column" },
      { id: "spt-fallback-db-xtdtm-last-ins-upd", label: "xtdtm_last_ins_upd (datetime, not null)", iconType: "column" },
      { id: "spt-fallback-db-xfallback-dbid", label: "xfallback_dbid (smallint, null)", iconType: "column" },
      { id: "spt-fallback-db-name", label: "name (varchar(30), not null)", iconType: "column" },
      { id: "spt-fallback-db-dbid", label: "dbid (smallint, not null)", iconType: "column" },
      { id: "spt-fallback-db-status", label: "status (smallint, not null)", iconType: "column" },
      { id: "spt-fallback-db-version", label: "version (smallint, not null)", iconType: "column" },
    ],
  },
  ...masterTableCommonChildren("spt-fallback-db"),
  { id: "spt-fallback-db-statistics", label: "Statistics", iconType: "folder", folderColor: "#e8c44d" },
]

const sptFallbackDevChildren: TreeNode[] = [
  {
    id: "spt-fallback-dev-columns",
    label: "Columns",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      { id: "spt-fallback-dev-xserver-name", label: "xserver_name (varchar(30), not null)", iconType: "column" },
      { id: "spt-fallback-dev-xtdtm-ins", label: "xtdtm_ins (datetime, not null)", iconType: "column" },
      { id: "spt-fallback-dev-xtdtm-last-ins-upd", label: "xtdtm_last_ins_upd (datetime, not null)", iconType: "column" },
      { id: "spt-fallback-dev-xfallback-low", label: "xfallback_low (int, null)", iconType: "column" },
      { id: "spt-fallback-dev-xfallback-drive", label: "xfallback_drive (char(2), null)", iconType: "column" },
      { id: "spt-fallback-dev-low", label: "low (int, not null)", iconType: "column" },
      { id: "spt-fallback-dev-high", label: "high (int, not null)", iconType: "column" },
      { id: "spt-fallback-dev-status", label: "status (smallint, not null)", iconType: "column" },
      { id: "spt-fallback-dev-name", label: "name (varchar(30), not null)", iconType: "column" },
      { id: "spt-fallback-dev-phyname", label: "phyname (varchar(127), not null)", iconType: "column" },
    ],
  },
  ...masterTableCommonChildren("spt-fallback-dev"),
  { id: "spt-fallback-dev-statistics", label: "Statistics", iconType: "folder", folderColor: "#e8c44d" },
]

const sptFallbackUsgChildren: TreeNode[] = [
  {
    id: "spt-fallback-usg-columns",
    label: "Columns",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      { id: "spt-fallback-usg-xserver-name", label: "xserver_name (varchar(30), not null)", iconType: "column" },
      { id: "spt-fallback-usg-xtdtm-ins", label: "xtdtm_ins (datetime, not null)", iconType: "column" },
      { id: "spt-fallback-usg-xtdtm-last-ins-upd", label: "xtdtm_last_ins_upd (datetime, not null)", iconType: "column" },
      { id: "spt-fallback-usg-xfallback-vstart", label: "xfallback_vstart (int, null)", iconType: "column" },
      { id: "spt-fallback-usg-dbid", label: "dbid (smallint, not null)", iconType: "column" },
      { id: "spt-fallback-usg-segmap", label: "segmap (int, not null)", iconType: "column" },
      { id: "spt-fallback-usg-lstart", label: "lstart (int, not null)", iconType: "column" },
      { id: "spt-fallback-usg-sizepg", label: "sizepg (int, not null)", iconType: "column" },
      { id: "spt-fallback-usg-vstart", label: "vstart (int, not null)", iconType: "column" },
    ],
  },
  ...masterTableCommonChildren("spt-fallback-usg"),
  { id: "spt-fallback-usg-statistics", label: "Statistics", iconType: "folder", folderColor: "#e8c44d" },
]

const sptMonitorChildren: TreeNode[] = [
  {
    id: "spt-monitor-columns",
    label: "Columns",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      { id: "spt-monitor-lastrun", label: "lastrun (datetime, not null)", iconType: "column" },
      { id: "spt-monitor-cpu-busy", label: "cpu_busy (int, not null)", iconType: "column" },
      { id: "spt-monitor-io-busy", label: "io_busy (int, not null)", iconType: "column" },
      { id: "spt-monitor-idle", label: "idle (int, not null)", iconType: "column" },
      { id: "spt-monitor-pack-received", label: "pack_received (int, not null)", iconType: "column" },
      { id: "spt-monitor-pack-sent", label: "pack_sent (int, not null)", iconType: "column" },
      { id: "spt-monitor-connections", label: "connections (int, not null)", iconType: "column" },
      { id: "spt-monitor-pack-errors", label: "pack_errors (int, not null)", iconType: "column" },
      { id: "spt-monitor-total-read", label: "total_read (int, not null)", iconType: "column" },
      { id: "spt-monitor-total-write", label: "total_write (int, not null)", iconType: "column" },
      { id: "spt-monitor-total-errors", label: "total_errors (int, not null)", iconType: "column" },
    ],
  },
  ...masterTableCommonChildren("spt-monitor"),
  { id: "spt-monitor-statistics", label: "Statistics", iconType: "folder", folderColor: "#e8c44d" },
]

const sharedSystemTablesChildren: TreeNode[] = [
  { id: "shared-msreplication-options", label: "dbo.MSreplication_options", iconType: "table", children: msReplicationOptionsChildren },
  { id: "shared-spt-fallback-db", label: "dbo.spt_fallback_db", iconType: "table", children: sptFallbackDbChildren },
  { id: "shared-spt-fallback-dev", label: "dbo.spt_fallback_dev", iconType: "table", children: sptFallbackDevChildren },
  { id: "shared-spt-fallback-usg", label: "dbo.spt_fallback_usg", iconType: "table", children: sptFallbackUsgChildren },
  { id: "shared-spt-monitor", label: "dbo.spt_monitor", iconType: "table", children: sptMonitorChildren },
]

const sharedDatabaseChildren: TreeNode[] = [
  {
    id: "shared-tables",
    label: "Tables",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      {
        id: "shared-system-tables",
        label: "System Tables",
        iconType: "folder",
        folderColor: "#e8c44d",
        children: sharedSystemTablesChildren,
      },
      { id: "shared-external-tables", label: "External Tables", iconType: "folder", folderColor: "#e8c44d" },
      { id: "shared-graph-tables", label: "Graph Tables", iconType: "folder", folderColor: "#e8c44d" },
    ],
  },
  {
    id: "shared-views",
    label: "Views",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      {
        id: "shared-system-views",
        label: "System Views",
        iconType: "folder",
        folderColor: "#e8c44d",
        children: masterSystemViewsChildren,
      },
    ],
  },
  { id: "shared-synonyms", label: "Synonyms", iconType: "folder", folderColor: "#e8c44d" },
  { id: "shared-programmability", label: "Programmability", iconType: "folder", folderColor: "#e8c44d", children: masterProgrammabilityChildren },
  { id: "shared-service-broker", label: "Service Broker", iconType: "folder", folderColor: "#e8c44d", children: masterServiceBrokerChildren },
  { id: "shared-storage", label: "Storage", iconType: "folder", folderColor: "#e8c44d", children: masterStorageChildren },
  { id: "shared-security", label: "Security", iconType: "folder", folderColor: "#e8c44d", children: masterSecurityChildren },
  { id: "shared-rules", label: "Rules", iconType: "folder", folderColor: "#e8c44d" },
  { id: "shared-defaults", label: "Defaults", iconType: "folder", folderColor: "#e8c44d" },
]

const cloneTreeNodes = (nodes: TreeNode[], prefix: string): TreeNode[] =>
  nodes.map((node) => ({
    ...node,
    id: `${prefix}-${node.id}`,
    children: node.children ? cloneTreeNodes(node.children, prefix) : undefined,
  }))

const modelDatabaseChildren: TreeNode[] = [
  {
    id: "model-tables",
    label: "Tables",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      {
        id: "model-system-tables",
        label: "System Tables",
        iconType: "folder",
        folderColor: "#e8c44d",
        children: sharedSystemTablesChildren,
      },
      { id: "model-external-tables", label: "External Tables", iconType: "folder", folderColor: "#e8c44d" },
      { id: "model-graph-tables", label: "Graph Tables", iconType: "folder", folderColor: "#e8c44d" },
    ],
  },
  {
    id: "model-views",
    label: "Views",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [{ id: "model-system-views", label: "System Views", iconType: "folder", folderColor: "#e8c44d", children: masterSystemViewsChildren }],
  },
  { id: "model-synonyms", label: "Synonyms", iconType: "folder", folderColor: "#e8c44d" },
  { id: "model-programmability", label: "Programmability", iconType: "folder", folderColor: "#e8c44d", children: masterProgrammabilityChildren },
  { id: "model-service-broker", label: "Service Broker", iconType: "folder", folderColor: "#e8c44d", children: masterServiceBrokerChildren },
  { id: "model-storage", label: "Storage", iconType: "folder", folderColor: "#e8c44d", children: masterStorageChildren },
  { id: "model-security", label: "Security", iconType: "folder", folderColor: "#e8c44d", children: masterSecurityChildren },
  { id: "model-rules", label: "Rules", iconType: "folder", folderColor: "#e8c44d" },
  { id: "model-defaults", label: "Defaults", iconType: "folder", folderColor: "#e8c44d" },
]

const msdbSystemTablesChildren: TreeNode[] = [
  { id: "msdb-backupset", label: "dbo.backupset", iconType: "table" },
  { id: "msdb-backupmediafamily", label: "dbo.backupmediafamily", iconType: "table" },
  { id: "msdb-backupmediaset", label: "dbo.backupmediaset", iconType: "table" },
  { id: "msdb-restorehistory", label: "dbo.restorehistory", iconType: "table" },
  { id: "msdb-restorefile", label: "dbo.restorefile", iconType: "table" },
  { id: "msdb-restorefilegroup", label: "dbo.restorefilegroup", iconType: "table" },
  { id: "msdb-sysjobs", label: "dbo.sysjobs", iconType: "table" },
  { id: "msdb-sysjobsteps", label: "dbo.sysjobsteps", iconType: "table" },
  { id: "msdb-sysjobhistory", label: "dbo.sysjobhistory", iconType: "table" },
  { id: "msdb-syscategories", label: "dbo.syscategories", iconType: "table" },
  { id: "msdb-sysoperators", label: "dbo.sysoperators", iconType: "table" },
]

const msdbDatabaseChildren: TreeNode[] = [
  {
    id: "msdb-tables",
    label: "Tables",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      { id: "msdb-system-tables", label: "System Tables", iconType: "folder", folderColor: "#e8c44d", children: msdbSystemTablesChildren },
      { id: "msdb-external-tables", label: "External Tables", iconType: "folder", folderColor: "#e8c44d" },
    ],
  },
  {
    id: "msdb-views",
    label: "Views",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      {
        id: "msdb-system-views",
        label: "System Views",
        iconType: "folder",
        folderColor: "#e8c44d",
        children: [
          { id: "msdb-view-sysjobs-view", label: "dbo.sysjobs_view", iconType: "view" },
          { id: "msdb-view-sysjobactivity", label: "dbo.sysjobactivity", iconType: "view" },
          { id: "msdb-view-sysmail-allitems", label: "dbo.sysmail_allitems", iconType: "view" },
          { id: "msdb-view-sysmail-event-log", label: "dbo.sysmail_event_log", iconType: "view" },
          { id: "msdb-view-backupset-view", label: "dbo.backupset_view", iconType: "view" },
        ],
      },
    ],
  },
  { id: "msdb-synonyms", label: "Synonyms", iconType: "folder", folderColor: "#e8c44d" },
  { id: "msdb-programmability", label: "Programmability", iconType: "folder", folderColor: "#e8c44d", children: masterProgrammabilityChildren },
  { id: "msdb-service-broker", label: "Service Broker", iconType: "folder", folderColor: "#e8c44d", children: masterServiceBrokerChildren },
  { id: "msdb-storage", label: "Storage", iconType: "folder", folderColor: "#e8c44d", children: masterStorageChildren },
  { id: "msdb-security", label: "Security", iconType: "folder", folderColor: "#e8c44d", children: masterSecurityChildren },
  { id: "msdb-database-mail", label: "Database Mail", iconType: "folder", folderColor: "#e8c44d" },
  { id: "msdb-sql-server-agent", label: "SQL Server Agent", iconType: "folder", folderColor: "#e8c44d" },
]

const tempdbSystemTablesChildren: TreeNode[] = [
  { id: "tempdb-sysrowsets", label: "dbo.sysrowsets", iconType: "table" },
  { id: "tempdb-sysallocunits", label: "dbo.sysallocunits", iconType: "table" },
  { id: "tempdb-sysschobjs", label: "dbo.sysschobjs", iconType: "table" },
  { id: "tempdb-sysseobjvalues", label: "dbo.sysseobjvalues", iconType: "table" },
  { id: "tempdb-syscolpars", label: "dbo.syscolpars", iconType: "table" },
]

const tempdbDatabaseChildren: TreeNode[] = [
  {
    id: "tempdb-tables",
    label: "Tables",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      { id: "tempdb-system-tables", label: "System Tables", iconType: "folder", folderColor: "#e8c44d", children: tempdbSystemTablesChildren },
    ],
  },
  { id: "tempdb-temporary-tables", label: "Temporary Tables", iconType: "folder", folderColor: "#e8c44d" },
  {
    id: "tempdb-views",
    label: "Views",
    iconType: "folder",
    folderColor: "#e8c44d",
    children: [
      {
        id: "tempdb-system-views",
        label: "System Views",
        iconType: "folder",
        folderColor: "#e8c44d",
        children: [
          { id: "tempdb-view-sysobjects", label: "sys.objects", iconType: "view" },
          { id: "tempdb-view-syscolumns", label: "sys.columns", iconType: "view" },
          { id: "tempdb-view-sysindexes", label: "sys.indexes", iconType: "view" },
          { id: "tempdb-view-sysfilegroups", label: "sys.filegroups", iconType: "view" },
        ],
      },
    ],
  },
  { id: "tempdb-synonyms", label: "Synonyms", iconType: "folder", folderColor: "#e8c44d" },
  { id: "tempdb-programmability", label: "Programmability", iconType: "folder", folderColor: "#e8c44d", children: masterProgrammabilityChildren },
  { id: "tempdb-service-broker", label: "Service Broker", iconType: "folder", folderColor: "#e8c44d", children: masterServiceBrokerChildren },
  { id: "tempdb-storage", label: "Storage", iconType: "folder", folderColor: "#e8c44d", children: masterStorageChildren },
  { id: "tempdb-security", label: "Security", iconType: "folder", folderColor: "#e8c44d", children: masterSecurityChildren },
]

const createSystemDatabaseChildren = (prefix: "model" | "msdb" | "tempdb"): TreeNode[] => {
  if (prefix === "model") return cloneTreeNodes(modelDatabaseChildren, prefix)
  if (prefix === "msdb") return cloneTreeNodes(msdbDatabaseChildren, prefix)
  return cloneTreeNodes(tempdbDatabaseChildren, prefix)
}

const treeData: TreeNode[] = [
  {
    id: "server",
    label: "APON\\SQLEXPRESS (SQL Server 16.0.1175 - APON\\ASUS)",
    iconType: "server",
    children: [
      {
        id: "databases",
        label: "Databases",
        iconType: "folder",
        folderColor: "#e8c44d",
        children: [
          {
            id: "system-databases",
            label: "System Databases",
            iconType: "folder",
            folderColor: "#e8c44d",
            children: [
              {
                id: "master",
                label: "master",
                iconType: "database",
                children: [
                  {
                    id: "master-tables",
                    label: "Tables",
                    iconType: "folder",
                    folderColor: "#e8c44d",
                    children: [
                      {
                        id: "master-system-tables",
                        label: "System Tables",
                        iconType: "folder",
                        folderColor: "#e8c44d",
                        children: [
                          { id: "msreplication-options", label: "dbo.MSreplication_options", iconType: "table", children: msReplicationOptionsChildren },
                          { id: "spt-fallback-db", label: "dbo.spt_fallback_db", iconType: "table", children: sptFallbackDbChildren },
                          { id: "spt-fallback-dev", label: "dbo.spt_fallback_dev", iconType: "table", children: sptFallbackDevChildren },
                          { id: "spt-fallback-usg", label: "dbo.spt_fallback_usg", iconType: "table", children: sptFallbackUsgChildren },
                          { id: "spt-monitor", label: "dbo.spt_monitor", iconType: "table", children: sptMonitorChildren },
                        ],
                      },
                      {
                        id: "master-external-tables",
                        label: "External Tables",
                        iconType: "folder",
                        folderColor: "#e8c44d",
                      },
                      {
                        id: "master-graph-tables",
                        label: "Graph Tables",
                        iconType: "folder",
                        folderColor: "#e8c44d",
                      },
                    ],
                  },
                  {
                    id: "master-views",
                    label: "Views",
                    iconType: "folder",
                    folderColor: "#e8c44d",
                    children: [
                      {
                        id: "master-system-views",
                        label: "System Views",
                        iconType: "folder",
                        folderColor: "#e8c44d",
                        children: masterSystemViewsChildren,
                      },
                    ],
                  },
                  { id: "master-synonyms", label: "Synonyms", iconType: "folder", folderColor: "#e8c44d" },
                  { id: "master-programmability", label: "Programmability", iconType: "folder", folderColor: "#e8c44d", children: masterProgrammabilityChildren },
                  { id: "master-service-broker", label: "Service Broker", iconType: "folder", folderColor: "#e8c44d", children: masterServiceBrokerChildren },
                  { id: "master-storage", label: "Storage", iconType: "folder", folderColor: "#e8c44d", children: masterStorageChildren },
                  { id: "master-security", label: "Security", iconType: "folder", folderColor: "#e8c44d", children: masterSecurityChildren },
                ],
              },
              { id: "model", label: "model", iconType: "database", children: createSystemDatabaseChildren("model") },
              { id: "msdb", label: "msdb", iconType: "database", children: createSystemDatabaseChildren("msdb") },
              { id: "tempdb", label: "tempdb", iconType: "database", children: createSystemDatabaseChildren("tempdb") },
            ],
          },
          { id: "database-snapshots", label: "Database Snapshots", iconType: "folder", folderColor: "#e8c44d" },
          { id: "portfolio", label: "Portfolio", iconType: "database", children: mapPortfolioNodes(portfolioDatabaseChildren) },
        ],
      },
      {
        id: "security",
        label: "Security",
        iconType: "folder",
        folderColor: "#e8c44d",
        children: masterSecurityChildren,
      },
      {
        id: "server-objects",
        label: "Server Objects",
        iconType: "folder",
        folderColor: "#e8c44d",
        children: serverObjectsChildren,
      },
      {
        id: "replication",
        label: "Replication",
        iconType: "folder",
        folderColor: "#e8c44d",
        children: replicationChildren,
      },
      {
        id: "management",
        label: "Management",
        iconType: "folder",
        folderColor: "#e8c44d",
        children: managementChildren,
      },
      { id: "xevent-profiler", label: "XEvent Profiler", iconType: "folder", folderColor: "#e8c44d", children: xEventProfilerChildren },
    ],
  },
]

const getIcon = (type: string, isDark: boolean, folderColor?: string) => {
  switch (type) {
    case "server":
      return <ServerIcon isDark={isDark} />
    case "folder":
      return <FolderIcon color={folderColor || "#e8c44d"} />
    case "database":
      return <DatabaseIcon isDark={isDark} />
    case "table":
      return <TableIcon isDark={isDark} />
    case "view":
      return <ViewIcon isDark={isDark} />
    case "column":
      return <ColumnIcon isDark={isDark} isPK={false} />
    case "column-pk":
      return <ColumnIcon isDark={isDark} isPK={true} />
    case "key":
      return <KeyIcon isDark={isDark} />
    case "statistics":
      return <StatisticsIcon isDark={isDark} />
    case "security":
      return <SecurityIcon isDark={isDark} />
    case "user":
      return <UserIcon isDark={isDark} />
    case "role":
      return <RoleIcon isDark={isDark} />
    case "schema":
      return <SchemaIcon isDark={isDark} />
    case "certificate":
      return <CertificateIcon isDark={isDark} />
    case "broker-item":
      return <BrokerItemIcon isDark={isDark} />
    case "procedure":
      return <ProcedureIcon isDark={isDark} />
    case "function":
      return <FunctionIcon isDark={isDark} />
    case "assembly":
      return <AssemblyIcon isDark={isDark} />
    case "box":
      return <BoxIcon isDark={isDark} />
    case "replication":
      return <ReplicationIcon isDark={isDark} />
    case "management":
      return <ManagementIcon isDark={isDark} />
    case "profiler":
      return <ProfilerIcon isDark={isDark} />
    case "diagram":
      return <DiagramIcon isDark={isDark} />
    case "provider":
      return <LinkProviderIcon isDark={isDark} />
    case "trigger":
      return <TriggerIcon isDark={isDark} />
    case "policy":
      return <PolicyIcon isDark={isDark} />
    case "event-session":
      return <EventSessionIcon isDark={isDark} />
    case "log":
      return <LogIcon isDark={isDark} />
    case "subscription":
      return <SubscriptionIcon isDark={isDark} />
    default:
      return <BoxIcon isDark={isDark} />
  }
}

export function Sidebar({ width, onWidthChange, selectedNode, onSelectNode }: SidebarProps) {
  const { theme, focusArea, setFocusArea } = useTheme()
  const isDark = theme === "dark"
  const isFocused = focusArea === "sidebar"
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["server"]))
  const [isResizing, setIsResizing] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isPinned, setIsPinned] = useState(true)
  const [isVisible, setIsVisible] = useState(true)
  const [searchText, setSearchText] = useState("")

  // hsl(240, 25%, 42%) for focused sidebar header
  const focusedColor = "hsl(240, 25%, 42%)"

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }
      return next
    })
  }

  useEffect(() => {
    if (!isResizing) return
    const prevUserSelect = document.body.style.userSelect
    const prevCursor = document.body.style.cursor
    document.body.style.userSelect = "none"
    document.body.style.cursor = "ew-resize"
    return () => {
      document.body.style.userSelect = prevUserSelect
      document.body.style.cursor = prevCursor
    }
  }, [isResizing])

  const handleMouseDown = () => {
    setIsResizing(true)
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault()
    const minSidebarWidth = 120
    const maxSidebarWidth = Math.max(320, window.innerWidth - 320)
    const newWidth = Math.max(minSidebarWidth, Math.min(maxSidebarWidth, e.clientX))
    onWidthChange(newWidth)
  }

  const handleMouseUp = () => {
    setIsResizing(false)
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  const getNodeQuery = (node: TreeNode): string | undefined => {
    if (node.query) return node.query
    if (node.iconType === "table") return `SELECT TOP (1000) *\nFROM ${node.label};`
    if (node.iconType === "view") return `SELECT *\nFROM ${node.label};`
    if (node.iconType === "procedure") return `EXEC ${node.label};`
    return undefined
  }

  const nodeMatches = (node: TreeNode, term: string): boolean => {
    if (!term) return true
    const normalized = term.toLowerCase()
    const selfMatch =
      node.label.toLowerCase().includes(normalized) ||
      (node.dataType?.toLowerCase().includes(normalized) ?? false)
    if (selfMatch) return true
    if (!node.children?.length) return false
    return node.children.some((child) => nodeMatches(child, term))
  }

  const filterNodes = (nodes: TreeNode[], term: string): TreeNode[] =>
    nodes
      .filter((node) => nodeMatches(node, term))
      .map((node) => ({
        ...node,
        children: node.children ? filterNodes(node.children, term) : undefined,
      }))

  const renderTree = (nodes: TreeNode[], depth = 0) => {
    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0
      const isExpanded = expandedNodes.has(node.id)
      const isSelected = selectedNode === node.id
      const isColumnNode = node.iconType === "column" || node.iconType === "column-pk"
      const columnDescriptor = isColumnNode
        ? `(${node.keyType ? `${node.keyType}, ` : ""}${node.dataType ?? "text"}, ${node.nullable === false ? "not null" : "null"})`
        : null

      return (
        <div key={node.id}>
          <div
            className={`flex cursor-pointer items-center py-0 pr-2 ${
              isSelected
                ? ""
                : isDark
                  ? "hover:bg-[#2a2d2e]"
                  : "hover:bg-[#e8e8e8]"
            }`}
            style={{ paddingLeft: `${depth * 12 + 4}px` }}
            onClick={() => {
              onSelectNode(node.id, getNodeQuery(node))
              if (hasChildren) {
                toggleNode(node.id)
              }
            }}
          >
            <span className="flex h-[18px] w-4 flex-shrink-0 items-center justify-center">
              {hasChildren ? (
                isExpanded ? (
                  <ChevronDownIcon size={12} className={isDark ? "text-[#cccccc]" : "text-[#666666]"} />
                ) : (
                  <ChevronRightIcon size={12} className={isDark ? "text-[#cccccc]" : "text-[#666666]"} />
                )
              ) : (
                <span className="w-3" />
              )}
            </span>
              <div
                className={`relative -top-px inline-flex h-[18px] items-center ${
                  isSelected
                    ? isDark
                      ? isFocused
                        ? "border bg-[#626262] text-[#b3b2b1]"
                        : "border border-[#6a644f] bg-transparent text-[#d3c8a7]"
                      : isFocused
                        ? "border border-[#569dbe] bg-[#d7d7d7] text-[#1e1e1e]"
                        : "border border-[#8d846c] bg-transparent text-[#5b5545]"
                    : ""
                }`}
              style={
                isSelected && isDark && isFocused
                  ? node.id === "server"
                    ? { borderColor: "#4f92b1", boxShadow: "inset 0 1px 0 #4f92b1" }
                    : { borderColor: "#4f92b1" }
                  : undefined
              }
            >
              <span className="mr-1 flex-shrink-0">{getIcon(node.iconType, isDark, node.folderColor)}</span>
              <span
                className={`truncate whitespace-nowrap pr-[3px] text-[11px] ${
                  isSelected
                    ? isDark
                      ? "text-[#b3b2b1]"
                      : "text-[#1e1e1e]"
                    : isDark
                      ? "text-[#cccccc]"
                      : "text-[#1e1e1e]"
                }`}
              >
                {node.label}
              </span>
              {columnDescriptor ? (
                <span className={`ml-1 truncate whitespace-nowrap text-[11px] ${isDark ? "text-[#d0d0d0]" : "text-[#4f4f52]"}`}>
                  {columnDescriptor}
                </span>
              ) : null}
            </div>
          </div>
          {hasChildren && isExpanded && <div>{renderTree(node.children!, depth + 1)}</div>}
        </div>
      )
    })
  }

  return (
    <div
      className={`object-explorer-wrapper relative flex flex-col select-none ${isDark ? "bg-[#2d2d30]" : "bg-[#f3f3f3]"}`}
      style={{ width: isVisible ? `${width}px` : "24px" }}
      onMouseDown={() => setFocusArea("sidebar")}
    >
      {isVisible ? (
      <div className={`object-explorer-panel ${isDark ? "border-[#3f3f52] bg-[#1e1e1e]" : "border-[#cccccc] bg-white"}`}>
        {/* Object Explorer Header */}
        <div
          className={`object-explorer-header relative flex h-[21px] min-h-[21px] max-h-[21px] items-center justify-between px-2 py-0 ${
            isDark ? "bg-[#2d2d30] text-[#e2e2e2]" : "bg-[#eeeef2] text-[#1e1e1e]"
          }`}
          style={
            isFocused && isDark
              ? { backgroundColor: focusedColor }
              : undefined
          }
        >
          <div className="pointer-events-none absolute left-[102px] right-[48px] top-1/2 z-0 flex h-[7px] -translate-y-1/2 flex-col justify-between">
            <div className="h-px bg-repeat-x" style={{ backgroundImage: "radial-gradient(circle, #626267 0.75px, transparent 0.95px)", backgroundSize: "6px 1px" }} />
            <div className="ml-[3px] h-px bg-repeat-x" style={{ backgroundImage: "radial-gradient(circle, #626267 0.75px, transparent 0.95px)", backgroundSize: "6px 1px" }} />
            <div className="h-px bg-repeat-x" style={{ backgroundImage: "radial-gradient(circle, #626267 0.75px, transparent 0.95px)", backgroundSize: "6px 1px" }} />
          </div>
          <span
            className={`relative z-10 pr-2 ${isDark ? "text-[#e2e2e2]" : "text-[#1e1e1e]"}`}
            style={
              isFocused && isDark
                ? { backgroundColor: focusedColor }
                : undefined
            }
          >
            Object Explorer
          </span>
          <div
            className="relative z-10 flex items-center gap-1 pl-2"
            style={
              isFocused && isDark
                ? { backgroundColor: focusedColor }
                : undefined
            }
          >
            <button
              type="button"
              aria-label={isCollapsed ? "Expand Object Explorer" : "Collapse Object Explorer"}
              onClick={() => setIsCollapsed((prev) => !prev)}
              className={`${isDark ? "hover:bg-white/10" : "hover:bg-white/20"} p-0.5 ${isPinned ? "text-[#f0f0f0]" : "text-[#8e8e93]"}`}
            >
              <svg width="10" height="10" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
                <path d={isCollapsed ? "M2 1l4 3-4 3z" : "M1 2.5h6L4 6z"} />
              </svg>
            </button>
            <button
              type="button"
              aria-label={isPinned ? "Unpin Object Explorer" : "Pin Object Explorer"}
              onClick={() => setIsPinned((prev) => !prev)}
              className={`${isDark ? "text-[#d0d0d0] hover:bg-white/10" : "hover:bg-white/20"} p-0.5`}
            >
              <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M3.1 1.8h5.8c.35 0 .6.27.6.6 0 .18-.08.34-.2.46l-1.1 1.02v2.2l1.15 1.64a.52.52 0 0 1-.43.82H6.55v2.42L6 11.45l-.55-.5V8.52H3.08a.52.52 0 0 1-.43-.82L3.8 6.06v-2.2L2.7 2.84a.62.62 0 0 1-.2-.44c0-.33.27-.6.6-.6z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Close Object Explorer"
              onClick={() => setIsVisible(false)}
              className={`${isDark ? "text-[#d0d0d0] hover:bg-white/10" : "hover:bg-white/20"} p-0.5`}
            >
              <XIcon size={13} className={isDark ? "text-[#d0d0d0]" : ""} />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        {!isCollapsed && (
        <div
          className={`object-explorer-toolbar flex h-[23px] min-h-[23px] max-h-[23px] items-center px-[6px] py-0 ${
            isDark ? "bg-[#2d2d30]" : "bg-[#eeeef2]"
          }`}
          style={{ boxShadow: isDark ? "inset 0 -1px #3a3a3a" : "inset 0 -1px #cccccc" }}
        >
          <button
            type="button"
            aria-label="Connect menu"
            className={`flex h-[16px] items-center gap-[2px] px-[2px] ${
              isDark ? "text-[#cccccc] hover:bg-[#3a3a3a] hover:text-[#ededed]" : "text-[#666666] hover:bg-[#d4d4d4] hover:text-[#222222]"
            }`}
          >
            <span className="text-[12px] leading-none">Connect</span>
            <span className={`text-[9px] leading-none ${isDark ? "text-[#7f7f7f]" : "text-[#999999]"}`}>▾</span>
          </button>
          <div className={`h-[12px] w-px ${isDark ? "bg-[#3b3b3b]" : "bg-[#cfcfcf]"}`} />
          <div className="flex items-center gap-[2px]">
            <button
              type="button"
              aria-label="Connect"
              className={`flex h-[18px] w-[18px] items-center justify-center p-0 ${isDark ? "text-[#bcbcbc] hover:bg-[#3a3a3a] hover:text-[#ededed]" : "text-[#666666] hover:bg-[#d4d4d4] hover:text-[#222222]"}`}
            >
              <ConnectPlugIcon />
            </button>
            <button
              type="button"
              aria-label="Disconnect"
              className={`flex h-[18px] w-[18px] items-center justify-center p-0 ${isDark ? "hover:bg-[#3a3a3a]" : "hover:bg-[#d4d4d4]"}`}
            >
              <ConnectPlugIcon disconnected />
            </button>
            <button
              type="button"
              aria-label="Square action"
              className={`flex h-[18px] w-[18px] items-center justify-center p-0 ${isDark ? "text-[#7a7a7a] hover:bg-[#3a3a3a] hover:text-[#bfbfbf]" : "text-[#8a8a8a] hover:bg-[#d4d4d4] hover:text-[#555555]"}`}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="4.6" y="4.6" width="6.8" height="6.8" rx="0.45" fill="currentColor" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Filter connections"
              className={`flex h-[18px] w-[18px] items-center justify-center p-0 ${isDark ? "text-[#787878] hover:bg-[#3a3a3a] hover:text-[#bfbfbf]" : "text-[#979797] hover:bg-[#d4d4d4] hover:text-[#555555]"}`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3.4 4.1h9.2l-3.7 4.1v2.95l-1.8.82V8.2L3.4 4.1z" fill="currentColor" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Refresh connections"
              className={`flex h-[18px] w-[18px] items-center justify-center p-0 ${isDark ? "hover:bg-[#3a3a3a]" : "hover:bg-[#d4d4d4]"}`}
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M12.25 5.65A4.6 4.6 0 104.35 10.95" stroke="#58aef6" strokeWidth="1.45" strokeLinecap="square" />
                <path d="M10.2 3.95h2.75V6.7" stroke="#58aef6" strokeWidth="1.45" strokeLinecap="square" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Diagnostics"
              className={`flex h-[18px] w-[18px] items-center justify-center p-0 ${isDark ? "text-[#8a8a8a] hover:bg-[#3a3a3a] hover:text-[#cfcfcf]" : "text-[#979797] hover:bg-[#d4d4d4] hover:text-[#555555]"}`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M2.4 9h1.55l1.05-2.35 1.35 4.45 1.45-3.15 1 .95h1.15l1-1.85.95 1.5h1.1"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        )}

        {/* Tree View - with custom scrollbar */}
        {!isCollapsed && (
        <div className={`px-1 pb-1 pt-1 ${isDark ? "bg-[#1e1e1e]" : "bg-white"}`}>
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search objects..."
            className={`h-6 w-full border px-2 text-[11px] outline-none ${
              isDark
                ? "border-[#3a3a3a] bg-[#252526] text-[#d4d4d4] placeholder:text-[#8b8b8b]"
                : "border-[#d0d0d0] bg-white text-[#222222] placeholder:text-[#888888]"
            }`}
          />
        </div>
        )}

        {!isCollapsed && (
        <div
          className={`object-explorer-tree flex-1 overflow-auto ${isDark ? "ssms-scrollbar-dark bg-[#1e1e1e]" : "ssms-scrollbar-light bg-white"}`}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: isDark ? "#4a4a4a #252526" : "#c0c0c0 #f3f3f3",
          }}
        >
          {renderTree(filterNodes(treeData, searchText.trim()))}
        </div>
        )}

      </div>
      ) : (
      <button
        type="button"
        aria-label="Show Object Explorer"
        onClick={() => setIsVisible(true)}
        className={`ml-[6px] mt-1 flex h-6 w-4 items-center justify-center ${isDark ? "bg-[#2d2d30] text-[#d0d0d0] hover:bg-[#3a3a3a]" : "bg-[#eeeef2] text-[#666666] hover:bg-[#dddddd]"}`}
      >
        <ChevronRightIcon size={12} />
      </button>
      )}

      {/* Resize Handle */}
      {isVisible && (
      <div
        className={`group absolute right-0 top-0 flex h-full w-[6px] cursor-ew-resize items-center justify-center ${
          isDark ? "bg-[#2d2d30]" : "bg-[#f3f3f3]"
        }`}
        onMouseDown={handleMouseDown}
      >
        <svg
          width="10"
          height="22"
          viewBox="0 0 10 22"
          fill="none"
          aria-hidden="true"
          className={`${isResizing ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity ${
            isDark ? "text-[#6f6f73]" : "text-[#9a9a9a]"
          }`}
        >
          <path d="M1 11L3.5 8.5V13.5L1 11Z" fill="currentColor" />
          <rect x="4" y="4" width="1" height="14" rx="0.5" fill="currentColor" />
          <rect x="6" y="6" width="1" height="10" rx="0.5" fill="currentColor" opacity="0.7" />
          <path d="M9 11L6.5 13.5V8.5L9 11Z" fill="currentColor" />
        </svg>
      </div>
      )}

      <style jsx global>{`
        .object-explorer-wrapper {
          background: #2d2d30;
          padding: 0 0 0 6px;
          height: 100%;
          box-sizing: border-box;
        }
        .object-explorer-panel {
          border: 1px solid #3f3f52;
          background: #1e1e1e;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .object-explorer-header {
          height: 21px;
          min-height: 21px;
          max-height: 21px;
          font-size: 12px;
          line-height: 21px;
        }
        .object-explorer-toolbar {
          height: 23px;
          min-height: 23px;
          max-height: 23px;
          gap: 3px;
          line-height: 23px;
        }
        .object-explorer-tree {
          padding: 0 6px 4px 0;
        }
        .ssms-scrollbar-dark::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .ssms-scrollbar-dark::-webkit-scrollbar-track {
          background: #252526;
        }
        .ssms-scrollbar-dark::-webkit-scrollbar-thumb {
          background: #4a4a4a;
          border-radius: 0;
        }
        .ssms-scrollbar-dark::-webkit-scrollbar-thumb:hover {
          background: #5a5a5a;
        }
        .ssms-scrollbar-light::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .ssms-scrollbar-light::-webkit-scrollbar-track {
          background: #f3f3f3;
        }
        .ssms-scrollbar-light::-webkit-scrollbar-thumb {
          background: #c0c0c0;
          border-radius: 0;
        }
        .ssms-scrollbar-light::-webkit-scrollbar-thumb:hover {
          background: #a0a0a0;
        }
      `}</style>
    </div>
  )
}
