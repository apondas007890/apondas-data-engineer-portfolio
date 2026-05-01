"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { CursorPosition } from "@/app/page"
import { useTheme } from "@/app/page"

interface EditorProps {
  content: string
  onChange: (content: string) => void
  zoom: number
  onZoomChange: (zoom: number) => void
  onCursorChange: (cursor: CursorPosition) => void
}

const calculateCursor = (text: string, position: number): CursorPosition => {
  const safePos = Math.max(0, Math.min(position, text.length))
  const beforeCaret = text.slice(0, safePos)
  const line = beforeCaret.split("\n").length
  const lineStart = beforeCaret.lastIndexOf("\n") + 1
  const col = safePos - lineStart + 1
  return { line, col, ch: col }
}

export function Editor({ content, onChange, zoom, onZoomChange, onCursorChange }: EditorProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [activeLine, setActiveLine] = useState(1)
  const lineCount = useMemo(() => {
    if (content.trim().length === 0) return 0
    return content.split("\n").length
  }, [content])
  const zoomFactor = zoom / 100
  const fontSize = Math.max(8, Math.round(12 * zoomFactor))
  const lineHeight = Math.max(12, Math.round(18 * zoomFactor))

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const newContent = content.substring(0, start) + "    " + content.substring(end)
      onChange(newContent)
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 4
          textareaRef.current.selectionEnd = start + 4
        }
      }, 0)
    }
  }

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!e.ctrlKey) return
    e.preventDefault()
    const delta = e.deltaY > 0 ? -10 : 10
    onZoomChange(zoom + delta)
  }

  const emitCursor = (target: HTMLTextAreaElement) => {
    const nextCursor = calculateCursor(target.value, target.selectionStart)
    setActiveLine(nextCursor.line)
    onCursorChange(nextCursor)
  }

  useEffect(() => {
    const target = textareaRef.current
    if (!target) {
      setActiveLine(1)
      onCursorChange({ line: 1, col: 1, ch: 1 })
      return
    }
    const nextCursor = calculateCursor(target.value, target.selectionStart)
    setActiveLine(nextCursor.line)
    onCursorChange(nextCursor)
  }, [content, onCursorChange])

  return (
    <div
      className={`flex min-w-0 flex-1 overflow-hidden ${isDark ? "bg-[#1e1e1e]" : "bg-white"}`}
      onWheel={handleWheel}
    >
      {/* Line Numbers */}
      <div
        className={`relative min-w-[40px] overflow-hidden py-1 pr-2 pl-2 text-right font-mono tabular-nums select-none ${
          isDark
            ? "bg-[#1e1e1e] text-[#858585]"
            : "bg-[#f5f5f5] text-[#237893]"
        }`}
        style={{ fontSize: `${fontSize}px` }}
      >
        <div className="relative" style={{ transform: `translateY(-${scrollTop}px)` }}>
          {lineCount > 0 && (
            <span
              className="absolute top-0 right-[-8px] w-[5px] bg-[#f0e68c]"
              style={{ height: `${Math.max(activeLine, 1) * lineHeight}px` }}
            />
          )}
          {Array.from({ length: lineCount }, (_, i) => (
            <div
              key={i + 1}
              style={{ height: `${lineHeight}px`, lineHeight: `${lineHeight}px` }}
              className="relative"
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Editor Content */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onKeyUp={(e) => emitCursor(e.currentTarget)}
        onClick={(e) => emitCursor(e.currentTarget)}
        onSelect={(e) => emitCursor(e.currentTarget)}
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        className={`ssms-editor-scrollbar min-w-0 flex-1 resize-none overflow-auto p-1 font-mono outline-none ${
          isDark ? "bg-[#1e1e1e] text-[#d4d4d4] caret-white" : "bg-white text-[#000000] caret-black"
        }`}
        style={{ fontSize: `${fontSize}px`, lineHeight: `${lineHeight}px` }}
        spellCheck={false}
        wrap="off"
        placeholder="-- Write your SQL query here..."
      />
      <style jsx global>{`
        .ssms-editor-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .ssms-editor-scrollbar::-webkit-scrollbar-track {
          background: ${isDark ? "#252526" : "#f0f0f0"};
        }
        .ssms-editor-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? "#5f5f5f" : "#b7b7b7"};
          border-radius: 8px;
          border: 1px solid ${isDark ? "#252526" : "#f0f0f0"};
        }
        .ssms-editor-scrollbar::-webkit-scrollbar-corner {
          background: ${isDark ? "#252526" : "#f0f0f0"};
        }
        .ssms-editor-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: ${isDark ? "#5f5f5f #252526" : "#b7b7b7 #f0f0f0"};
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  )
}
