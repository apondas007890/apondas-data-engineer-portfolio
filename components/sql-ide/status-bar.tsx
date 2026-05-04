"use client"

import { useEffect, useRef, useState } from "react"
import type { CursorPosition } from "@/app/page"
import { useTheme } from "@/app/page"

interface StatusBarProps {
  rowCount: number
  currentDatabase: string
  zoom: number
  onZoomChange: (zoom: number) => void
  cursor: CursorPosition
}

const ZOOM_LEVELS = [20, 50, 70, 100, 113, 150, 200, 400]

export function StatusBar({ rowCount, currentDatabase, zoom, onZoomChange, cursor }: StatusBarProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [showZoomMenu, setShowZoomMenu] = useState(false)
  const zoomMenuRef = useRef<HTMLDivElement>(null)

  // hsl(240, 25%, 42%) = #505080 (purple-ish blue)
  const readyBarColor = "hsl(240, 25%, 42%)"

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (zoomMenuRef.current && !zoomMenuRef.current.contains(event.target as Node)) {
        setShowZoomMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="flex w-full flex-col">
      {/* Connection Status Bar - Khaki yellow - FULL WIDTH outside Object Explorer */}
      <div
        className="flex h-[18px] min-w-0 items-center justify-between bg-[#f0e68c] px-2 text-[11px] text-[#1e1e1e]"
      >
        <div className="flex min-w-0 items-center gap-2">
          <div className="relative flex items-center" ref={zoomMenuRef}>
            <button
              onClick={() => setShowZoomMenu((prev) => !prev)}
              className="flex items-center gap-1 px-1 text-[10px] hover:bg-black/10"
            >
              <span>{zoom} %</span>
              <span>▾</span>
            </button>
            {showZoomMenu && (
              <div
                className={`absolute bottom-full left-0 z-30 mb-1 min-w-[56px] border py-1 ${
                  isDark ? "border-[#3c3c3c] bg-[#1e1e1e] text-[#cccccc]" : "border-[#cccccc] bg-white text-[#1e1e1e]"
                }`}
              >
                {ZOOM_LEVELS.map((level) => (
                  <button
                    key={level}
                    className={`flex w-full items-center px-2 py-0.5 text-left text-[11px] ${
                      isDark ? "hover:bg-[#2a2d2e]" : "hover:bg-[#e8f4fc]"
                    }`}
                    onClick={() => {
                      onZoomChange(level)
                      setShowZoomMenu(false)
                    }}
                  >
                    {level} %
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true">
              {/* Plug pins (facing upward) */}
              <rect x="4.2" y="1.4" width="1.2" height="2.4" rx="0.2" fill="#3f3f3f" />
              <rect x="7.1" y="1.4" width="1.2" height="2.4" rx="0.2" fill="#3f3f3f" />

              {/* Plug head/body */}
              <rect x="2.6" y="3.2" width="7.4" height="5.1" rx="1" fill="#4a4a4a" />

              {/* Neck + cable */}
              <rect x="5.2" y="8.1" width="2.1" height="1.7" rx="0.4" fill="#4a4a4a" />
              <path d="M6.25 9.8v2.7" stroke="#3f3f3f" strokeWidth="1.2" strokeLinecap="round" />

              {/* Connected badge */}
              <circle cx="11.9" cy="11.5" r="3" fill="#2fb35c" />
              <path d="M10.6 11.5l0.9 0.9 1.8-2.1" stroke="#ffffff" strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="truncate">Connected. (1/1)</span>
          </div>
        </div>
        <div className="flex min-w-0 items-center overflow-hidden text-[11px] text-[#2b2b2b]">
          <span className="truncate">APON\SQLEXPRESS (16.0 RTM)</span>
          <span className="mx-3 text-[#7a7a7a]">|</span>
          <span className="truncate">APON\ASUS (70)</span>
          <span className="mx-3 text-[#7a7a7a]">|</span>
          <span className="truncate">{currentDatabase}</span>
          <span className="mx-3 text-[#7a7a7a]">|</span>
          <span className="truncate">00:00:00</span>
          <span className="mx-3 text-[#7a7a7a]">|</span>
          <span className="truncate">{rowCount} rows</span>
        </div>
      </div>

      {/* Ready Bar - Purple/Blue hsl(240, 25%, 42%) */}
      <div
        className="flex h-[20px] min-w-0 items-center justify-between px-2 text-[11px] text-white"
        style={{ backgroundColor: readyBarColor }}
      >
        <div className="flex items-center gap-2">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="2" y="2" width="12" height="12" rx="1" />
          </svg>
          <span>Ready</span>
        </div>
        <div className="flex items-center gap-6">
          <span>{`Ln ${cursor.line}`}</span>
          <span>{`Col ${cursor.col}`}</span>
          <span>{`Ch ${cursor.ch}`}</span>
          <span>INS</span>
        </div>
      </div>
    </div>
  )
}
