"use client"

import { useEffect, useState } from "react"
import { XIcon, Loader2Icon, CheckCircle2Icon } from "lucide-react"
import { useTheme } from "@/app/page"

interface ResultsPanelProps {
  data: Record<string, string | number>[] | null
  isLoading: boolean
  onClose: () => void
}

export function ResultsPanel({ data, isLoading, onClose }: ResultsPanelProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [activeTab, setActiveTab] = useState<"results" | "messages">("results")
  const [panelHeight, setPanelHeight] = useState(180)
  const [isResizing, setIsResizing] = useState(false)

  useEffect(() => {
    if (!isResizing) return
    const prevUserSelect = document.body.style.userSelect
    const prevCursor = document.body.style.cursor
    document.body.style.userSelect = "none"
    document.body.style.cursor = "row-resize"
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
    const container = document.querySelector("[data-results-container]")
    if (container) {
      const rect = container.getBoundingClientRect()
      const newHeight = rect.bottom - e.clientY
      setPanelHeight(Math.max(80, Math.min(400, newHeight)))
    }
  }

  const handleMouseUp = () => {
    setIsResizing(false)
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  const columns = data && data.length > 0 ? Object.keys(data[0]) : []

  return (
    <div
      data-results-container
      className={`flex w-full min-w-0 flex-col ${isDark ? "border-t border-[#3c3c3c] bg-[#1e1e1e]" : "border-t border-[#cccccc] bg-white"}`}
      style={{ height: panelHeight }}
    >
      {/* Resize Handle */}
      <div
        className={`h-[3px] cursor-row-resize ${isResizing ? "bg-[#007acc]" : "hover:bg-[#007acc]"}`}
        onMouseDown={handleMouseDown}
      />

      {/* Tabs */}
      <div
        className={`flex h-[22px] items-center ${
          isDark ? "border-b border-[#3c3c3c] bg-[#2d2d2d]" : "border-b border-[#cccccc] bg-[#eeeef2]"
        }`}
      >
        <button
          className={`flex h-full items-center px-3 text-[11px] ${
            activeTab === "results"
              ? isDark
                ? "border-b-2 border-b-[#007acc] bg-[#1e1e1e]"
                : "border-b-2 border-b-[#007acc] bg-white"
              : isDark
                ? "hover:bg-[#3c3c3c]"
                : "hover:bg-[#e5e5e5]"
          }`}
          onClick={() => setActiveTab("results")}
        >
          Results
        </button>
        <button
          className={`flex h-full items-center px-3 text-[11px] ${
            activeTab === "messages"
              ? isDark
                ? "border-b-2 border-b-[#007acc] bg-[#1e1e1e]"
                : "border-b-2 border-b-[#007acc] bg-white"
              : isDark
                ? "hover:bg-[#3c3c3c]"
                : "hover:bg-[#e5e5e5]"
          }`}
          onClick={() => setActiveTab("messages")}
        >
          Messages
        </button>
        <div className="flex-1" />
        <button
          onClick={onClose}
          className={`mr-1 p-0.5 ${isDark ? "hover:bg-[#3c3c3c]" : "hover:bg-[#d4d4d4]"}`}
        >
          <XIcon size={10} />
        </button>
      </div>

      {/* Content */}
      <div className="ssms-results-scroll min-w-0 flex-1 overflow-auto">
        {activeTab === "results" ? (
          isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2Icon className="h-5 w-5 animate-spin text-[#007acc]" />
              <span className={`ml-2 text-[11px] ${isDark ? "text-[#888888]" : "text-[#666666]"}`}>
                Executing query...
              </span>
            </div>
          ) : data ? (
            <table className="w-full border-collapse text-[11px]">
              <thead>
                <tr className={`sticky top-0 ${isDark ? "bg-[#2d2d2d]" : "bg-[#f0f0f0]"}`}>
                  <th
                    className={`border px-2 py-0.5 text-left font-normal ${
                      isDark ? "border-[#3c3c3c] text-[#888888]" : "border-[#cccccc] text-[#666666]"
                    }`}
                  >
                    #
                  </th>
                  {columns.map((col) => (
                    <th
                      key={col}
                      className={`border px-2 py-0.5 text-left font-normal ${
                        isDark ? "border-[#3c3c3c] text-[#888888]" : "border-[#cccccc] text-[#666666]"
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={isDark ? "hover:bg-[#2a2d2e]" : "hover:bg-[#e8f4fc]"}
                  >
                    <td
                      className={`border px-2 py-0.5 ${
                        isDark ? "border-[#3c3c3c] text-[#888888]" : "border-[#cccccc] text-[#666666]"
                      }`}
                    >
                      {rowIndex + 1}
                    </td>
                    {columns.map((col) => (
                      <td
                        key={col}
                        className={`border px-2 py-0.5 ${
                          isDark ? "border-[#3c3c3c]" : "border-[#cccccc]"
                        }`}
                      >
                        {String(row[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div
              className={`flex h-full items-center justify-center text-[11px] ${
                isDark ? "text-[#888888]" : "text-[#666666]"
              }`}
            >
              No results to display. Execute a query to see results.
            </div>
          )
        ) : (
          <div className={`p-2 font-mono text-[11px] ${isDark ? "text-[#cccccc]" : "text-[#333333]"}`}>
            {isLoading ? (
              <span className={isDark ? "text-[#888888]" : "text-[#666666]"}>Executing...</span>
            ) : data ? (
              <div className={`flex items-start gap-2 border-b pb-2 ${isDark ? "border-[#3c3c3c]" : "border-[#cccccc]"}`}>
                <CheckCircle2Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#22c55e]" />
                <span className={isDark ? "text-[#cccccc]" : "text-[#333333]"}>
                  Query executed successfully.
                </span>
              </div>
            ) : (
              <span className={isDark ? "text-[#888888]" : "text-[#666666]"}>Ready</span>
            )}
          </div>
        )}
      </div>
      <style jsx global>{`
        .ssms-results-scroll::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .ssms-results-scroll::-webkit-scrollbar-track {
          background: ${isDark ? "#1e1e1e" : "#f5f5f5"};
        }
        .ssms-results-scroll::-webkit-scrollbar-thumb {
          background: ${isDark ? "#5f5f5f" : "#b7b7b7"};
          border-radius: 8px;
        }
        .ssms-results-scroll {
          scrollbar-width: thin;
          scrollbar-color: ${isDark ? "#5f5f5f #1e1e1e" : "#b7b7b7 #f5f5f5"};
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  )
}
