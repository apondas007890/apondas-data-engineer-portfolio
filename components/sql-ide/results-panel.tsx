"use client"

import { useEffect, useMemo, useState } from "react"
import { XIcon, Loader2Icon } from "lucide-react"
import { useTheme } from "@/app/page"

interface ResultsPanelProps {
  data: Record<string, string | number>[] | null
  isLoading: boolean
  onClose: () => void
}

function ResultsGridIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 11 11" aria-hidden="true">
      <path d="M1.5 1.5h8v8h-8zM1.5 4.2h8M1.5 6.8h8M4.2 1.5v8M6.8 1.5v8" fill="none" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  )
}

function MessagesIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 11 11" aria-hidden="true">
      <path d="M1.5 2.2h5.8v4.4H4L2 8.5V6.6H1.5z" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinejoin="round" />
      <path d="M4.2 3.6H8.8v4.2H6.9L5.4 9V7.8H4.2z" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinejoin="round" />
    </svg>
  )
}

function VerticalShowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 11 11" aria-hidden="true">
      <path d="M1.5 2h3.1M1.5 5.5h3.1M1.5 9h3.1" stroke="currentColor" strokeWidth="0.8" strokeLinecap="square" />
      <path d="M5.8 2h3.7M5.8 5.5h3.7M5.8 9h3.7" stroke="currentColor" strokeWidth="0.8" strokeLinecap="square" />
      <path d="M5 1.3v8.4" stroke="currentColor" strokeWidth="0.8" />
    </svg>
  )
}

export function ResultsPanel({ data, isLoading, onClose }: ResultsPanelProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [activeTab, setActiveTab] = useState<"results" | "messages">("results")
  const [resultView, setResultView] = useState<"grid" | "vertical">("grid")
  const [selectedRow, setSelectedRow] = useState(0)
  const [selectedCol, setSelectedCol] = useState(0)
  const [hasCellSelection, setHasCellSelection] = useState(false)
  const [hasRowSelection, setHasRowSelection] = useState(false)
  const [hasColumnSelection, setHasColumnSelection] = useState(false)
  const [panelHeight, setPanelHeight] = useState(180)
  const [isResizing, setIsResizing] = useState(false)
  const [previewImages, setPreviewImages] = useState<string[] | null>(null)
  const [previewIndex, setPreviewIndex] = useState(0)
  const [slideshowTick, setSlideshowTick] = useState(0)
  const columns = data && data.length > 0 ? Object.keys(data[0]) : []
  const rowTotal = data?.length ?? 0
  const sqlErrorMessage = data?.[0]?.Message
  const sqlErrorDetail = data?.[0]?.Detail
  const hasSqlError = typeof sqlErrorMessage === "string" && sqlErrorMessage.startsWith("Msg ")
  const completionTime = useMemo(() => new Date().toISOString(), [data, isLoading])
  const showResultsGridFrame = isDark && activeTab === "results" && resultView === "grid"
  const showMessagesFrame = isDark && activeTab === "messages"
  const showResultsTextFrame = isDark && activeTab === "results" && resultView === "vertical"

  useEffect(() => {
    if (hasSqlError) {
      setActiveTab("messages")
    }
  }, [hasSqlError])

  useEffect(() => {
    if (!data || data.length === 0) {
      setSelectedRow(0)
      setSelectedCol(0)
      setHasCellSelection(false)
      setHasRowSelection(false)
      setHasColumnSelection(false)
      return
    }
    setSelectedRow((prev) => Math.min(prev, data.length - 1))
    setSelectedCol((prev) => Math.min(prev, Math.max(columns.length - 1, 0)))
    setHasCellSelection(false)
    setHasRowSelection(false)
    setHasColumnSelection(false)
  }, [data, columns.length])

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

  useEffect(() => {
    if (!previewImages || previewImages.length <= 1) return
    const timer = setInterval(() => {
      setPreviewIndex((prev) => (prev + 1) % previewImages.length)
    }, 1800)
    return () => clearInterval(timer)
  }, [previewImages])

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideshowTick((prev) => prev + 1)
    }, 1800)
    return () => clearInterval(timer)
  }, [])

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
      const parentRect = container.parentElement?.getBoundingClientRect()
      const newHeight = rect.bottom - e.clientY
      const maxHeight = parentRect ? Math.max(120, parentRect.height - 8) : Math.max(120, window.innerHeight - 100)
      setPanelHeight(Math.max(80, Math.min(maxHeight, newHeight)))
    }
  }

  const handleMouseUp = () => {
    setIsResizing(false)
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  const activeTabBorderStyle = {
    borderTopColor: "#3a3a3c",
    borderRightColor: "#3a3a3c",
    borderLeftColor: "#3a3a3c",
    borderBottomColor: "#252526",
    backgroundColor: "#2d2d30",
    color: "#ffffff",
    marginBottom: "-1px",
  } as const
  const inactiveTabBorderStyle = {
    borderTopColor: "#3a3a3c",
    borderRightColor: "#3a3a3c",
    borderBottomColor: "#3a3a3c",
    borderLeftColor: "#3a3a3c",
    backgroundColor: "#252526",
    color: "#c7c7c7",
  } as const

  return (
    <div
      data-results-container
      className={`flex w-full min-w-0 flex-col ${isDark ? "border-t border-[#3c3c3c] bg-[#252526]" : "border-t border-[#cccccc] bg-white"}`}
      style={{ height: panelHeight }}
    >
      <div
        className={`group flex h-[6px] cursor-row-resize items-center justify-center ${
          isDark ? "bg-[#252526]" : "bg-white"
        }`}
        onMouseDown={handleMouseDown}
      >
        <svg
          width="22"
          height="10"
          viewBox="0 0 22 10"
          fill="none"
          aria-hidden="true"
          className={`${isResizing ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity ${
            isDark ? "text-[#6f6f73]" : "text-[#9a9a9a]"
          }`}
        >
          <path d="M11 1L13.5 3.5H8.5L11 1Z" fill="currentColor" />
          <rect x="4" y="4" width="14" height="1" rx="0.5" fill="currentColor" />
          <rect x="6" y="6" width="10" height="1" rx="0.5" fill="currentColor" opacity="0.7" />
          <path d="M11 9L8.5 6.5H13.5L11 9Z" fill="currentColor" />
        </svg>
      </div>
      {/* Tabs */}
      <div
        className={`relative flex h-[24px] select-none items-end ${
          isDark ? "bg-[#252526]" : "border-b border-[#cccccc] bg-[#eeeef2]"
        }`}
      >
        {isDark && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
            style={{ backgroundColor: showResultsGridFrame ? "#2d2d30" : "#3a3a3c" }}
          />
        )}
        {!hasSqlError && (
        <button
          className={`relative z-10 flex h-[22px] select-none items-center gap-1 border px-2 text-[11px] ${
            !isDark && activeTab === "results" && resultView === "grid"
              ? "border-[#cccccc] bg-white text-[#1e1e1e]"
              : !isDark
                ? "border-[#cccccc] bg-[#eeeef2] text-[#666666] hover:bg-[#e5e5e5]"
                : ""
          }`}
          style={
            isDark
              ? activeTab === "results" && resultView === "grid"
                ? activeTabBorderStyle
                : inactiveTabBorderStyle
              : undefined
          }
          onClick={() => {
            setActiveTab("results")
            setResultView("grid")
          }}
        >
          <ResultsGridIcon />
          Results (Grid)
        </button>
        )}
        <button
          className={`relative z-10 flex h-[22px] select-none items-center gap-1 border border-l-0 px-2 text-[11px] ${
            !isDark && activeTab === "messages"
              ? "border-[#cccccc] bg-white text-[#1e1e1e]"
              : !isDark
                ? "border-[#cccccc] bg-[#eeeef2] text-[#666666] hover:bg-[#e5e5e5]"
                : ""
          }`}
          style={isDark ? (activeTab === "messages" ? activeTabBorderStyle : inactiveTabBorderStyle) : undefined}
          onClick={() => setActiveTab("messages")}
        >
          <MessagesIcon />
          Messages
        </button>
        {!hasSqlError && (
        <button
          className={`relative z-10 flex h-[22px] select-none items-center gap-1 border border-l-0 px-2 text-[11px] ${
            resultView === "vertical"
              ? isDark
                ? "text-[#ffffff]"
                : "border-[#cccccc] bg-white text-[#1e1e1e]"
              : isDark
                ? "text-[#cccccc] hover:bg-[#303033]"
                : "border-[#cccccc] bg-[#eeeef2] text-[#666666] hover:bg-[#e5e5e5]"
          }`}
          style={
            isDark
              ? resultView === "vertical" && activeTab === "results"
                ? activeTabBorderStyle
                : inactiveTabBorderStyle
              : undefined
          }
          onClick={() => {
            setActiveTab("results")
            setResultView("vertical")
          }}
        >
          <VerticalShowIcon />
          <span>Results (Text)</span>
        </button>
        )}
        <div className="flex-1" />
        <button
          onClick={onClose}
          className={`mb-[3px] mr-1 flex h-[16px] items-center justify-center p-0.5 ${isDark ? "hover:bg-[#3c3c3c] hover:text-white active:bg-[#c42b1c] active:text-white" : "hover:bg-[#d4d4d4] hover:text-white active:bg-[#c42b1c] active:text-white"}`}
        >
          <XIcon size={10} />
        </button>
      </div>

      {/* Content */}
      <div
        className={`relative min-w-0 flex-1 overflow-hidden ${isDark ? "bg-[#2d2d30]" : "bg-white"}`}
        style={
          isDark
            ? {
                borderTop: `1px solid ${showResultsGridFrame || showMessagesFrame || showResultsTextFrame ? "#2d2d30" : "#3a3a3c"}`,
              }
            : undefined
        }
      >
        <div
          className={`ssms-results-scroll ${
            showResultsGridFrame
              ? "absolute left-0 right-[6px] top-0 bottom-[4px] overflow-auto"
              : showMessagesFrame
                ? "absolute left-0 right-0 top-0 bottom-[4px] overflow-auto"
                : showResultsTextFrame
                  ? "absolute left-0 right-0 top-0 bottom-[4px] overflow-auto"
              : "h-full overflow-auto"
          } ${isDark ? (showMessagesFrame || showResultsTextFrame ? "bg-[#252526]" : "bg-[#2d2d30]") : "bg-white"}`}
          style={
            isDark
              ? showResultsGridFrame
                ? undefined
                : showMessagesFrame
                  ? {
                      borderStyle: "solid",
                      borderTopWidth: "1px",
                      borderRightWidth: "2px",
                      borderBottomWidth: "1.5px",
                      borderLeftWidth: "1.5px",
                      borderTopColor: "#3a3a3c",
                      borderRightColor: "#3a3a3c",
                      borderBottomColor: "#3a3a3c",
                      borderLeftColor: "#3a3a3c",
                    }
                  : showResultsTextFrame
                    ? {
                        borderStyle: "solid",
                        borderTopWidth: "1px",
                        borderRightWidth: "2px",
                        borderBottomWidth: "1.5px",
                        borderLeftWidth: "1.5px",
                        borderTopColor: "#3a3a3c",
                        borderRightColor: "#3a3a3c",
                        borderBottomColor: "#3a3a3c",
                        borderLeftColor: "#3a3a3c",
                      }
                  : undefined
              : undefined
          }
        >
        {activeTab === "results" ? (
          isLoading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2Icon className="h-5 w-5 animate-spin text-[#007acc]" />
              <span className={`ml-2 text-[11px] ${isDark ? "text-[#888888]" : "text-[#666666]"}`}>
                Executing query...
              </span>
            </div>
          ) : data ? (
            <div className="min-w-0 p-0">
            {resultView === "grid" ? (
              <div
                className="inline-block select-none"
                style={{
                  backgroundColor: isDark ? "#2d2d30" : "#ffffff",
                  paddingTop: "0",
                  paddingLeft: "0",
                  paddingRight: "0",
                  paddingBottom: "0",
                  boxSizing: "border-box",
                }}
              >
                <table
                  className="w-max border-collapse text-[11px]"
                  style={isDark ? { borderColor: "#575759" } : undefined}
                >
                  <thead>
                    <tr className={`sticky top-0 ${isDark ? "bg-[#2d2d30]" : "bg-[#f0f0f0]"}`}>
                      <th
                        className={`min-w-[28px] border px-[7px] py-0 text-left font-normal ${
                          isDark ? "border-[#69696a] text-[#d4d4d4]" : "border-[#cccccc] text-[#666666]"
                        }`}
                        style={
                          isDark
                            ? {
                                lineHeight: "18px",
                                borderTopColor: "#979799",
                                borderLeftColor: "#979799",
                                borderRightColor: "#979799",
                                borderBottomColor: "#69696a",
                              }
                            : { lineHeight: "18px" }
                        }
                      />
                      {columns.map((col, colIndex) => (
                        <th
                          key={col}
                          className={`border px-[7px] py-0 text-left font-normal ${
                            isDark ? "border-[#69696a] text-[#d4d4d4]" : "border-[#cccccc] text-[#666666]"
                          }`}
                          style={
                            isDark
                              ? {
                                  lineHeight: "18px",
                                  borderTopColor: "#979799",
                                  borderLeftColor: "#979799",
                                  borderRightColor: "#979799",
                                  borderBottomColor: "#69696a",
                                }
                              : { lineHeight: "18px" }
                          }
                          onClick={() => {
                            setSelectedCol(colIndex)
                            setHasColumnSelection(true)
                            setHasRowSelection(false)
                            setHasCellSelection(false)
                          }}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, rowIndex) => (
                      <tr key={rowIndex} className={`cursor-default ${isDark ? "hover:bg-transparent" : "hover:bg-[#e8f4fc]"}`}>
                      <td
                        className={`min-w-[28px] border px-[7px] py-0 ${
                          isDark ? "border-[#69696a] text-[#d4d4d4]" : "border-[#cccccc] text-[#666666]"
                        }`}
                        onClick={() => {
                          setSelectedRow(rowIndex)
                          setHasRowSelection(true)
                          setHasCellSelection(false)
                          setHasColumnSelection(false)
                        }}
                        style={isDark ? { lineHeight: "20px", borderColor: "#69696a" } : { lineHeight: "20px" }}
                      >
                        {rowIndex + 1}
                      </td>
                        {columns.map((col, colIndex) => (
                          <td
                            key={col}
                            className={`border px-[7px] py-0 ${
                              isDark ? "border-[#69696a] text-[#f0f0f0]" : "border-[#cccccc]"
                            }`}
                            onClick={() => {
                              setSelectedRow(rowIndex)
                              setSelectedCol(colIndex)
                              setHasCellSelection(true)
                              setHasRowSelection(false)
                              setHasColumnSelection(false)
                            }}
                            style={(() => {
                              const cellValue = String(row[col])
                              const isNullLike = cellValue === "NULL"
                              const normalizedCol = col.toLowerCase()
                              const isBioColumn = normalizedCol === "bio" || normalizedCol === "description"
                              const baseCellStyle = isBioColumn
                                ? {
                                    whiteSpace: "pre-line" as const,
                                    maxWidth: "300px",
                                    minWidth: "180px",
                                    lineHeight: "16px",
                                    verticalAlign: "top" as const,
                                    paddingTop: "2px",
                                    paddingBottom: "2px",
                                    wordBreak: "break-word" as const,
                                  }
                                : {}

                              if (colIndex === selectedCol && hasColumnSelection) {
                                return isDark
                                  ? { ...baseCellStyle, backgroundColor: "#6767ab", color: "#ffffff", lineHeight: isBioColumn ? "16px" : "20px", borderColor: "#69696a" }
                                  : { ...baseCellStyle, backgroundColor: "#ececff", lineHeight: isBioColumn ? "16px" : "20px" }
                              }

                              if (rowIndex === selectedRow && hasRowSelection) {
                                return isDark
                                  ? { ...baseCellStyle, backgroundColor: "#6767ab", color: "#ffffff", lineHeight: isBioColumn ? "16px" : "20px", borderColor: "#69696a" }
                                  : { ...baseCellStyle, backgroundColor: "#ececff", lineHeight: isBioColumn ? "16px" : "20px" }
                              }

                              if (rowIndex === selectedRow && colIndex === selectedCol) {
                                const selectedColor = hasCellSelection ? "#6767ab" : "#333355"
                                return isDark
                                  ? { ...baseCellStyle, backgroundColor: selectedColor, color: "#ffffff", lineHeight: isBioColumn ? "16px" : "20px", borderColor: "#69696a" }
                                  : { ...baseCellStyle, backgroundColor: "#ececff", lineHeight: isBioColumn ? "16px" : "20px" }
                              }

                              if (isNullLike) {
                                return isDark
                                  ? { ...baseCellStyle, backgroundColor: "#333355", color: "#f0f0f0", lineHeight: isBioColumn ? "16px" : "20px", borderColor: "#69696a" }
                                  : { ...baseCellStyle, backgroundColor: "#ececff", lineHeight: isBioColumn ? "16px" : "20px" }
                              }

                              return isDark
                                ? { ...baseCellStyle, lineHeight: isBioColumn ? "16px" : "20px", borderColor: "#69696a" }
                                : { ...baseCellStyle, lineHeight: isBioColumn ? "16px" : "20px" }
                            })()}
                          >
                            {(() => {
                              const key = col.toLowerCase()
                              const value = String(row[col]).trim()
                              const isLinkField =
                                key === "linkedin" ||
                                key === "github" ||
                                key === "institute_link" ||
                                key === "company_website" ||
                                key === "company_website_url" ||
                                key === "githublink" ||
                                key === "liveurl" ||
                                key === "github_url" ||
                                key === "live_url" ||
                                key === "verification_url" ||
                                key === "certicifate(pdf)" ||
                                key === "certicifate"
                              const isWhatsAppField = key === "whatsapp_number"

                              if (key === "image" && value) {
                                const images = value.split("||").map((v) => v.trim()).filter(Boolean)
                                return (
                                  <button
                                    type="button"
                                    className="text-[#4aa7ff] underline hover:text-[#78beff]"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setPreviewImages(images)
                                      setPreviewIndex(0)
                                    }}
                                  >
                                    image
                                  </button>
                                )
                              }

                              if (isLinkField && value && value !== "NULL") {
                                const isInstituteLink = key === "institute_link"
                                const linkLabel =
                                  key === "certicifate"
                                    ? "pdf"
                                    : key === "verification_url"
                                      ? "verify"
                                      : value
                                return (
                                  <a
                                    href={value}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#4aa7ff] underline hover:text-[#78beff]"
                                    style={
                                      isInstituteLink
                                        ? {
                                            display: "inline-block",
                                            maxWidth: "280px",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            verticalAlign: "bottom",
                                          }
                                        : undefined
                                    }
                                    title={value}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {linkLabel}
                                  </a>
                                )
                              }

                              if (isWhatsAppField && value) {
                                const whatsappHref = value.startsWith("http")
                                  ? value
                                  : `https://wa.me/${value.replace(/[^\d]/g, "")}`

                                return (
                                  <a
                                    href={whatsappHref}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#25D366] underline hover:text-[#46e07f]"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {value}
                                  </a>
                                )
                              }

                              return value
                            })()}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div
                className={`font-mono text-[11px] leading-5 ${isDark ? "bg-[#252526]" : "text-[#333333]"}`}
                style={{ paddingTop: "16px", paddingLeft: "40px", paddingRight: "20px", paddingBottom: "16px" }}
              >
                {data.map((row, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="mb-4 pb-4 last:mb-0 last:pb-0"
                    style={isDark && rowIndex < data.length - 1 ? { borderBottom: "1px solid #3c3c3c" } : undefined}
                  >
                    {columns.map((col) => {
                      const rawValue = row[col]
                      const value = String(rawValue)
                      const isNullLike = value === "NULL"
                      const key = col.toLowerCase()
                              const isImage = key === "image"
                      const isGitOrLinked =
                        key === "github" ||
                        key === "linkedin" ||
                        key === "institute_link" ||
                        key === "company_website" ||
                        key === "company_website_url" ||
                        key === "githublink" ||
                        key === "liveurl" ||
                        key === "github_url" ||
                        key === "live_url" ||
                        key === "verification_url" ||
                        key === "certicifate(pdf)" ||
                        key === "certicifate"
                      const isWhatsApp = key === "whatsapp_number"

                      return (
                        <div key={`${rowIndex}-${col}`} className="grid grid-cols-[136px_minmax(0,1fr)] gap-x-4">
                          <span className={isDark ? "text-[#dcdcdc]" : undefined}>{col}:</span>
                          <span
                            className={
                              isNullLike && isDark
                                ? "inline-block w-fit bg-[#444466] px-1 text-[#ffffff]"
                                : isDark
                                  ? "text-[#ffffff]"
                                  : undefined
                            }
                          >
                            {isImage && value ? (
                              (() => {
                                const images = value.split("||").map((v) => v.trim()).filter(Boolean)
                                const thumb = images.length > 0 ? images[slideshowTick % images.length] : ""
                                if (!thumb) return null
                                return (
                              <button
                                type="button"
                                className="inline-block rounded border border-white/20 p-1 hover:border-white/40"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setPreviewImages(images)
                                  setPreviewIndex(0)
                                }}
                              >
                                <img
                                  src={thumb}
                                  alt="profile"
                                  className="h-[132px] w-[104px] rounded object-cover"
                                />
                              </button>
                                )
                              })()
                            ) : isGitOrLinked && value && value !== "NULL" ? (
                              <a
                                href={value}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#4aa7ff] underline hover:text-[#78beff]"
                              >
                                {key === "certicifate" ? "pdf" : key === "verification_url" ? "verify" : value}
                              </a>
                            ) : isWhatsApp && value ? (
                              <a
                                href={value.startsWith("http") ? value : `https://wa.me/${value.replace(/[^\d]/g, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#25D366] underline hover:text-[#46e07f]"
                              >
                                {value}
                              </a>
                            ) : (
                              <span style={{ whiteSpace: key === "description" || key === "bio" ? "pre-line" : "normal" }}>
                                {value}
                              </span>
                            )}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            )}
            </div>
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
          <div className={`px-10 py-4 font-mono text-[11px] ${isDark ? "bg-[#252526] text-[#cccccc]" : "text-[#333333]"}`}>
            {isLoading ? (
              <span className={isDark ? "text-[#888888]" : "text-[#666666]"}>Executing...</span>
            ) : data ? (
              <div className="space-y-5">
                {hasSqlError ? (
                  <>
                    <div className="space-y-1">
                      <div className="text-[#ff5f56]">{sqlErrorMessage}</div>
                      {typeof sqlErrorDetail === "string" ? <div className="text-[#ff5f56]">{sqlErrorDetail}</div> : null}
                    </div>
                    <div>
                      <span className={isDark ? "text-[#d4d4d4]" : "text-[#333333]"}>Completion time: </span>
                      <span className={isDark ? "text-[#d4d4d4]" : "text-[#333333]"}>{completionTime}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={isDark ? "text-[#d4d4d4]" : "text-[#333333]"}>{`(${rowTotal} rows returned)`}</div>
                    <div>
                      <span className={isDark ? "text-[#d4d4d4]" : "text-[#333333]"}>Execution time: </span>
                      <span className={isDark ? "text-[#d4d4d4]" : "text-[#333333]"}>{completionTime}</span>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <span className={isDark ? "text-[#888888]" : "text-[#666666]"}>Ready</span>
            )}
          </div>
        )}
        </div>
      </div>
      {previewImages && previewImages.length > 0 && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/75"
          onClick={() => setPreviewImages(null)}
        >
          <img
            src={previewImages[previewIndex]}
            alt="preview"
            className="max-h-[80vh] max-w-[80vw] rounded-lg border border-white/20 object-contain shadow-2xl"
          />
        </div>
      )}
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

