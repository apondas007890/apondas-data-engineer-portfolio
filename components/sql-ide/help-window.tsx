"use client"

import { useState, useRef, useEffect } from "react"

interface HelpWindowProps {
  onClose: () => void
}

export function HelpWindow({ onClose }: HelpWindowProps) {
  const [position, setPosition] = useState({ x: 100, y: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.current.x,
          y: e.clientY - dragOffset.current.y,
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging])

  return (
    <div
      className="fixed z-[60] w-[520px] border border-[#3c3c3c] bg-[#2d2d30] shadow-2xl"
      style={{ left: position.x, top: position.y }}
    >
      {/* Title bar - draggable */}
      <div
        className="flex h-[28px] cursor-move items-center justify-between border-b border-[#3c3c3c] bg-[#3c3c3c] px-2"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="6" fill="#0e639c" />
            <text x="8" y="12" fontSize="10" fill="white" textAnchor="middle">?</text>
          </svg>
          <span className="text-[12px] text-white">SQL Server Help</span>
        </div>
        <button
          onClick={onClose}
          className="flex h-5 w-5 items-center justify-center text-[#999999] hover:bg-[#e81123] hover:text-white"
        >
          <svg width="10" height="10" viewBox="0 0 10 10">
            <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="max-h-[400px] overflow-auto p-4">
        <h2 className="mb-4 text-lg font-semibold text-white">SQL Query Help</h2>
        
        <div className="space-y-4 text-[12px] text-[#cccccc]">
          <section>
            <h3 className="mb-2 font-semibold text-[#569cd6]">Basic SELECT Syntax</h3>
            <pre className="rounded bg-[#1e1e1e] p-2 text-[11px]">
{`SELECT column1, column2, ...
FROM table_name
WHERE condition;`}
            </pre>
          </section>

          <section>
            <h3 className="mb-2 font-semibold text-[#569cd6]">Common Operations</h3>
            <ul className="list-inside list-disc space-y-1">
              <li><span className="text-[#ce9178]">SELECT *</span> - Select all columns</li>
              <li><span className="text-[#ce9178]">WHERE</span> - Filter results</li>
              <li><span className="text-[#ce9178]">ORDER BY</span> - Sort results</li>
              <li><span className="text-[#ce9178]">GROUP BY</span> - Group results</li>
              <li><span className="text-[#ce9178]">JOIN</span> - Combine tables</li>
            </ul>
          </section>

          <section>
            <h3 className="mb-2 font-semibold text-[#569cd6]">INSERT Statement</h3>
            <pre className="rounded bg-[#1e1e1e] p-2 text-[11px]">
{`INSERT INTO table_name (column1, column2)
VALUES (value1, value2);`}
            </pre>
          </section>

          <section>
            <h3 className="mb-2 font-semibold text-[#569cd6]">UPDATE Statement</h3>
            <pre className="rounded bg-[#1e1e1e] p-2 text-[11px]">
{`UPDATE table_name
SET column1 = value1
WHERE condition;`}
            </pre>
          </section>

          <section>
            <h3 className="mb-2 font-semibold text-[#569cd6]">DELETE Statement</h3>
            <pre className="rounded bg-[#1e1e1e] p-2 text-[11px]">
{`DELETE FROM table_name
WHERE condition;`}
            </pre>
          </section>

          <section>
            <h3 className="mb-2 font-semibold text-[#569cd6]">Keyboard Shortcuts</h3>
            <ul className="space-y-1">
              <li><kbd className="rounded bg-[#3c3c3c] px-1">F5</kbd> - Execute query</li>
              <li><kbd className="rounded bg-[#3c3c3c] px-1">Ctrl+N</kbd> - New query</li>
              <li><kbd className="rounded bg-[#3c3c3c] px-1">Ctrl+S</kbd> - Save</li>
              <li><kbd className="rounded bg-[#3c3c3c] px-1">Ctrl+Z</kbd> - Undo</li>
              <li><kbd className="rounded bg-[#3c3c3c] px-1">Ctrl+Y</kbd> - Redo</li>
            </ul>
          </section>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end border-t border-[#3c3c3c] bg-[#252526] px-4 py-2">
        <button
          onClick={onClose}
          className="h-[26px] w-[80px] border border-[#3c3c3c] bg-[#3c3c3c] text-[12px] text-white hover:bg-[#505050] focus:outline-none"
        >
          Close
        </button>
      </div>
    </div>
  )
}
