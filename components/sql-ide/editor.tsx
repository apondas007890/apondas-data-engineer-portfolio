"use client"

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import type { CursorPosition } from "@/app/page"
import { useTheme } from "@/app/page"

interface EditorProps {
  content: string
  onChange: (content: string) => void
  zoom: number
  onZoomChange: (zoom: number) => void
  onCursorChange: (cursor: CursorPosition) => void
  showPlaceholder?: boolean
  placeholderText?: string
}

const SQL_KEYWORDS = [
  "BEGIN TRANSACTION",
  "PRIMARY KEY",
  "FOREIGN KEY",
  "GROUP BY",
  "ORDER BY",
  "SMALLINT",
  "DATETIME2",
  "TRUNCATE",
  "DISTINCT",
  "DATABASE",
  "PROCEDURE",
  "FUNCTION",
  "DEFAULT",
  "INSERT",
  "DELETE",
  "COMMIT",
  "ROLLBACK",
  "DECIMAL",
  "NUMERIC",
  "VARCHAR",
  "NVARCHAR",
  "DATETIME",
  "CREATE",
  "ALTER",
  "TABLE",
  "COLUMN",
  "INDEX",
  "VIEW",
  "CHECK",
  "UNIQUE",
  "MERGE",
  "GRANT",
  "REVOKE",
  "HAVING",
  "SELECT",
  "BIGINT",
  "TINYINT",
  "NCHAR",
  "FLOAT",
  "REAL",
  "CHAR",
  "TEXT",
  "DATE",
  "TIME",
  "DROP",
  "WHERE",
  "FROM",
  "FORM",
  "THEN",
  "ELSE",
  "CASE",
  "WHEN",
  "END",
  "INT",
  "BIT",
  "TOP",
  "DENY",
  "FULL",
  "WITH",
  "ON",
  "AS",
  "INNER JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "CROSS JOIN",
  "OUTER APPLY",
  "CROSS APPLY",
  "SAVEPOINT",
  "JOIN",
]

const SQL_FUNCTION_KEYWORDS = [
  "TRY_CONVERT",
  "TRY_CAST",
  "ROW_NUMBER",
  "DENSE_RANK",
  "CONVERT",
  "FORMAT",
  "COUNT",
  "UPDATE",
  "RANK",
  "NTILE",
  "LEAD",
  "COALESCE",
  "NULLIF",
  "CAST",
  "SUM",
  "AVG",
  "MIN",
  "MAX",
  "LAG",
  "IIF",
]

const SQL_NEUTRAL_KEYWORDS = ["FIRST_VALUE", "LAST_VALUE"]

const SQL_OPERATOR_KEYWORDS = [
  "IS NOT NULL",
  "INNER JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "CROSS JOIN",
  "OUTER APPLY",
  "CROSS APPLY",
  "IS NULL",
  "NOT NULL",
  "BETWEEN",
  "EXISTS",
  "JOIN",
  "LIKE",
  "AND",
  "NOT",
  "ANY",
  "ALL",
  "IN",
  "OR",
  "*",
  "+",
  "-",
  "%",
  "(",
  ")",
  ",",
]

const KEYWORD_COLORS = {
  sql: "#4c91cb",
  func: "#c978ea",
  neutral: "#c4c4c4",
  operator: "#6d747b",
  number: "#a7bb86",
  string: "#c79171",
} as const

const buildTokenPattern = (token: string) => {
  const escapedToken = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+")
  return /[A-Z_ ]/.test(token) ? `\\b${escapedToken}\\b` : escapedToken
}

const ALL_SQL_TOKENS = [...SQL_KEYWORDS, ...SQL_FUNCTION_KEYWORDS, ...SQL_NEUTRAL_KEYWORDS, ...SQL_OPERATOR_KEYWORDS]

const keywordPattern = `(?:${ALL_SQL_TOKENS
    .slice()
    .sort((a, b) => b.length - a.length)
    .map(buildTokenPattern)
    .join("|")})`

const stringPattern = String.raw`'(?:''|[^'])*'`
const numberPattern = String.raw`\b\d+(?:\.\d+)?\b`

const tokenPattern = new RegExp(
  `(${stringPattern})|(${numberPattern})|(${keywordPattern})`,
  "gi"
)

const calculateCursor = (text: string, position: number): CursorPosition => {
  const safePos = Math.max(0, Math.min(position, text.length))
  const beforeCaret = text.slice(0, safePos)
  const line = beforeCaret.split("\n").length
  const lineStart = beforeCaret.lastIndexOf("\n") + 1
  const col = safePos - lineStart + 1
  return { line, col, ch: col }
}

const getLineEndPosition = (text: string, lineNumber: number): number => {
  if (lineNumber <= 1) {
    const firstNewline = text.indexOf("\n")
    return firstNewline === -1 ? text.length : firstNewline
  }

  let currentLine = 1
  let index = 0
  while (currentLine < lineNumber && index < text.length) {
    if (text[index] === "\n") {
      currentLine += 1
    }
    index += 1
  }

  const lineEnd = text.indexOf("\n", index)
  return lineEnd === -1 ? text.length : lineEnd
}

const renderHighlightedSql = (text: string) => {
  if (text.length === 0) {
    return "\u200b"
  }

  const functionKeywordSet = new Set(SQL_FUNCTION_KEYWORDS)
  const neutralKeywordSet = new Set(SQL_NEUTRAL_KEYWORDS)
  const operatorKeywordSet = new Set(SQL_OPERATOR_KEYWORDS)
  const segments: Array<{ text: string; color?: string }> = []
  let lastIndex = 0

  text.replace(tokenPattern, (match, stringMatch: string, numberMatch: string, keywordMatch: string, offset: number) => {
    if (offset > lastIndex) {
      segments.push({ text: text.slice(lastIndex, offset) })
    }
    if (stringMatch) {
      segments.push({ text: match, color: KEYWORD_COLORS.string })
    } else if (numberMatch) {
      segments.push({ text: match, color: KEYWORD_COLORS.number })
    } else if (keywordMatch) {
      const normalizedMatch = match.replace(/\s+/g, " ").toUpperCase()
      segments.push({
        text: match,
        color: neutralKeywordSet.has(normalizedMatch)
          ? KEYWORD_COLORS.neutral
          : operatorKeywordSet.has(normalizedMatch)
            ? KEYWORD_COLORS.operator
            : functionKeywordSet.has(normalizedMatch)
              ? KEYWORD_COLORS.func
              : KEYWORD_COLORS.sql,
      })
    }
    lastIndex = offset + match.length
    return match
  })

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), keyword: false })
  }

  return segments
}

export function Editor({
  content,
  onChange,
  zoom,
  onZoomChange,
  onCursorChange,
  showPlaceholder = false,
  placeholderText = "Start your query here...",
}: EditorProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const charMeasureRef = useRef<HTMLSpanElement>(null)
  const scrollTopRef = useRef(0)
  const scrollLeftRef = useRef(0)
  const scrollFrameRef = useRef<number | null>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [activeLine, setActiveLine] = useState(1)
  const [activeColumn, setActiveColumn] = useState(1)
  const [isEditorFocused, setIsEditorFocused] = useState(false)
  const [hasSelection, setHasSelection] = useState(false)
  const [charWidth, setCharWidth] = useState(8)
  const isEmpty = content.length === 0
  const lineCount = useMemo(() => {
    if (isEmpty) return 1
    return content.split("\n").length
  }, [content, isEmpty])
  const zoomFactor = zoom / 100
  const scaleMetric = (value: number, min = 0) => Math.max(min, Math.round(value * zoomFactor))
  const fontSize = Math.max(8, Math.round(12 * zoomFactor))
  const lineHeight = Math.max(scaleMetric(17, 17), fontSize + scaleMetric(2, 2))
  const rowBoxHeight = Math.max(lineHeight, fontSize + scaleMetric(2, 2))
  const textLineHeight = lineHeight
  const gutterPaddingTop = 0
  const editorPaddingTop = 1
  const editorPaddingBottom = 0
  const activeRowTopOffset = scaleMetric(2, 1)
  const activeRowInsetX = scaleMetric(8, 6)
  const gutterLeftMarginWidth = scaleMetric(22, 22)
  const gutterNumberGap = scaleMetric(20, 20)
  const lineNumberDigits = Math.max(String(lineCount).length, 2)
  const lineNumberAreaWidth = Math.max(scaleMetric(18, 18), Math.round(lineNumberDigits * fontSize * 0.72))
  const activeBarWidth = scaleMetric(6, 6)
  const gapAfterActiveBar = 0
  const gutterWidth = gutterLeftMarginWidth + gutterNumberGap + lineNumberAreaWidth + activeBarWidth + gapAfterActiveBar + scaleMetric(6, 6)
  const activeRowLeft = activeRowInsetX + gapAfterActiveBar
  const editorTextPaddingLeft = activeRowLeft + scaleMetric(3, 3)
  const editorTextPaddingRight = scaleMetric(8, 8)
  const rowVisualTop = gutterPaddingTop + activeRowTopOffset
  const caretTopInset = scaleMetric(1, 0)
  const caretHeight = Math.max(rowBoxHeight - caretTopInset * 2, Math.max(12, fontSize))
  const numberAreaLeft = gutterLeftMarginWidth + gutterNumberGap
  const activeBarLeft = numberAreaLeft + lineNumberAreaWidth + scaleMetric(2, 2)
  const caretLeft =
    activeColumn <= 1
      ? activeRowLeft + scaleMetric(1, 1) - scrollLeft
      : editorTextPaddingLeft + (activeColumn - 1) * charWidth - scrollLeft
  const highlightedSegments = useMemo(() => renderHighlightedSql(content), [content])

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
    setHasSelection(target.selectionStart !== target.selectionEnd)
    const nextCursor = calculateCursor(target.value, target.selectionStart)
    setActiveLine(nextCursor.line)
    setActiveColumn(nextCursor.col)
    onCursorChange(nextCursor)
  }

  const moveCursorToClientPosition = (containerRect: DOMRect, clientY: number) => {
    const clickedLine = Math.max(
      1,
      Math.floor((clientY - containerRect.top + scrollTopRef.current - rowVisualTop) / lineHeight) + 1
    )
    const lineEndPosition = getLineEndPosition(content, clickedLine)
    const nextCursor = calculateCursor(content, lineEndPosition)

    setActiveLine(nextCursor.line)
    setActiveColumn(nextCursor.col)
    onCursorChange(nextCursor)
    setHasSelection(false)

    requestAnimationFrame(() => {
      const target = textareaRef.current
      if (!target) return
      target.focus()
      target.selectionStart = lineEndPosition
      target.selectionEnd = lineEndPosition
    })
  }

  const handleEditorSurfaceMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === textareaRef.current) return
    moveCursorToClientPosition(e.currentTarget.getBoundingClientRect(), e.clientY)
  }

  const handleTextareaMouseDown = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    if (!hasSelection || e.button !== 0 || e.shiftKey) return
    e.preventDefault()
    moveCursorToClientPosition(e.currentTarget.getBoundingClientRect(), e.clientY)
  }

  useEffect(() => {
    const target = textareaRef.current
    if (!target) {
      setActiveLine(1)
      setActiveColumn(1)
      onCursorChange({ line: 1, col: 1, ch: 1 })
      return
    }
    setHasSelection(target.selectionStart !== target.selectionEnd)
    const nextCursor = calculateCursor(target.value, target.selectionStart)
    setActiveLine(nextCursor.line)
    setActiveColumn(nextCursor.col)
    onCursorChange(nextCursor)
  }, [content, onCursorChange])

  useLayoutEffect(() => {
    const measureTarget = charMeasureRef.current
    if (!measureTarget) return
    const nextWidth = measureTarget.getBoundingClientRect().width
    if (nextWidth > 0) {
      setCharWidth(nextWidth)
    }
  }, [fontSize])

  useEffect(() => {
    return () => {
      if (scrollFrameRef.current !== null) {
        cancelAnimationFrame(scrollFrameRef.current)
      }
    }
  }, [])

  return (
    <div
      className={`relative flex min-w-0 flex-1 overflow-hidden ${isDark ? "bg-[#1e1e1e]" : "bg-white"}`}
      onWheel={handleWheel}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 bottom-px z-10"
        style={{
          borderTop: "1px solid #505085",
          borderRight: "1px solid #505085",
          borderBottom: "2px solid #505085",
          borderLeft: "none",
          boxSizing: "border-box",
        }}
      />
      {/* Line Numbers */}
      <div
        className={`relative overflow-hidden text-right font-mono tabular-nums select-none ${
          isDark
            ? "bg-[#1e1e1e] text-[#858585]"
            : "bg-[#f5f5f5] text-[#237893]"
        }`}
        style={{
          width: `${gutterWidth}px`,
          minWidth: `${gutterWidth}px`,
          maxWidth: `${gutterWidth}px`,
          fontSize: `${fontSize}px`,
          paddingTop: `${rowVisualTop}px`,
        }}
      >
        <div
          className={isDark ? "absolute inset-y-0 left-0 bg-[#333333]" : "absolute inset-y-0 left-0 bg-[#e9e9e9]"}
          style={{ width: `${gutterLeftMarginWidth}px` }}
        />
        <div className="pointer-events-none absolute inset-0 z-10">
          {Array.from({ length: lineCount }, (_, i) => (
            <div
              key={`active-bar-${i + 1}`}
              className="absolute bg-[#f3ec7a]"
              style={{
                top: `${rowVisualTop + i * lineHeight - scrollTop}px`,
                left: `${activeBarLeft}px`,
                width: `${activeBarWidth}px`,
                height: `${rowBoxHeight}px`,
                borderTop: i > 0 ? "1px solid #2d2d30" : "none",
                borderRight: "1px solid #4a4a4a",
                boxSizing: "border-box",
              }}
            />
          ))}
        </div>
        <div className="relative" style={{ transform: `translateY(-${scrollTop}px)` }}>
          {Array.from({ length: lineCount }, (_, i) => (
            <div
              key={i + 1}
              className="relative z-20 flex items-center justify-end"
              style={{ height: `${lineHeight}px`, lineHeight: `${lineHeight}px` }}
            >
              <span
                className="text-right"
                style={{
                  width: `${lineNumberAreaWidth}px`,
                  height: `${lineHeight}px`,
                  lineHeight: `${lineHeight}px`,
                  marginRight: `${gutterWidth - numberAreaLeft - lineNumberAreaWidth}px`,
                }}
              >
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Content */}
      <div
        className={`relative min-w-0 flex-1 overflow-hidden ${isDark ? "bg-[#1e1e1e]" : "bg-white"}`}
        onMouseDown={handleEditorSurfaceMouseDown}
      >
        {!hasSelection && (
          <div
            className="pointer-events-none absolute left-0 right-0 z-20"
            style={{
              top: `${rowVisualTop + (Math.max(activeLine, 1) - 1) * lineHeight - scrollTop}px`,
              left: `${activeRowLeft}px`,
              right: `${activeRowInsetX}px`,
              height: `${rowBoxHeight}px`,
              border: "2px solid #4a4a4a",
              boxSizing: "border-box",
            }}
          />
        )}
        {isEditorFocused && !hasSelection && (
          <div
            className="pointer-events-none absolute z-30 bg-white ssms-caret"
            style={{
              top: `${rowVisualTop + (Math.max(activeLine, 1) - 1) * lineHeight + caretTopInset - scrollTop}px`,
              left: `${caretLeft}px`,
              width: "1px",
              height: `${caretHeight}px`,
            }}
          />
        )}
        {showPlaceholder && isEmpty && (
          <div
            className={`pointer-events-none absolute font-mono whitespace-pre ${
              isDark ? "text-[#858585]" : "text-[#6b6b6b]"
            }`}
            style={{
              zIndex: 25,
              top: `${rowVisualTop - scrollTop}px`,
              left: `${editorTextPaddingLeft - scrollLeft}px`,
              fontSize: `${fontSize}px`,
              lineHeight: `${textLineHeight}px`,
            }}
          >
            {placeholderText}
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
          aria-hidden="true"
        >
          <pre
            className={`m-0 font-mono whitespace-pre ${
              isDark ? "text-[#d4d4d4]" : "text-[#000000]"
            }`}
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: `${textLineHeight}px`,
              paddingTop: `${editorPaddingTop}px`,
              paddingRight: `${editorTextPaddingRight}px`,
              paddingBottom: `${editorPaddingBottom}px`,
              paddingLeft: `${editorTextPaddingLeft}px`,
              transform: `translate(${-scrollLeft}px, ${-scrollTop}px)`,
            }}
          >
            {Array.isArray(highlightedSegments)
              ? highlightedSegments.map((segment, index) => (
                  <span key={index} style={segment.color ? { color: segment.color } : undefined}>
                    {segment.text}
                  </span>
                ))
              : highlightedSegments}
          </pre>
        </div>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => onChange(e.target.value)}
          onMouseDown={handleTextareaMouseDown}
          onKeyDown={handleKeyDown}
          onKeyUp={(e) => emitCursor(e.currentTarget)}
          onClick={(e) => emitCursor(e.currentTarget)}
          onSelect={(e) => emitCursor(e.currentTarget)}
          onFocus={() => setIsEditorFocused(true)}
          onBlur={() => {
            setIsEditorFocused(false)
            const target = textareaRef.current
            if (target) {
              setHasSelection(target.selectionStart !== target.selectionEnd)
            }
          }}
          onScroll={(e) => {
            scrollTopRef.current = e.currentTarget.scrollTop
            scrollLeftRef.current = e.currentTarget.scrollLeft
            if (scrollFrameRef.current !== null) return
            scrollFrameRef.current = requestAnimationFrame(() => {
              setScrollTop(scrollTopRef.current)
              setScrollLeft(scrollLeftRef.current)
              scrollFrameRef.current = null
            })
          }}
          className={`ssms-editor-scrollbar relative z-0 h-full w-full min-w-0 resize-none overflow-auto border-none font-mono outline-none ${
            isDark ? "bg-transparent text-transparent placeholder:text-[#d4d4d4]" : "bg-transparent text-transparent"
          }`}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: `${textLineHeight}px`,
            border: "none",
            outline: "none",
            caretColor: "transparent",
            textShadow: isDark ? "0 0 0 transparent" : "0 0 0 transparent",
            paddingTop: `${editorPaddingTop}px`,
            paddingRight: `${editorTextPaddingRight}px`,
            paddingBottom: `${editorPaddingBottom}px`,
            paddingLeft: `${editorTextPaddingLeft}px`,
          }}
          spellCheck={false}
          wrap="off"
          placeholder=""
        />
        <span
          ref={charMeasureRef}
          className="pointer-events-none absolute opacity-0"
          style={{ fontSize: `${fontSize}px`, fontFamily: "monospace" }}
        >
          0
        </span>
      </div>
      <style jsx global>{`
        .ssms-caret {
          animation: ssms-caret-blink 1s steps(1, end) infinite;
        }
        .ssms-editor-scrollbar::selection {
          background: #444466;
          color: transparent;
        }
        .ssms-editor-scrollbar::-moz-selection {
          background: #444466;
          color: transparent;
        }
        @keyframes ssms-caret-blink {
          0%, 45% {
            opacity: 1;
          }
          50%, 100% {
            opacity: 0;
          }
        }
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
