"use client"

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react"
import { X } from "lucide-react"

interface ConnectDialogProps {
  onConnect: () => void
  onCancel: () => void
  onHelp: () => void
  onOptions: () => void
}

export function ConnectDialog({ onConnect, onCancel, onHelp, onOptions }: ConnectDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragOffsetRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const centerDialog = () => {
      const dialogWidth = 560
      const dialogHeight = 370
      setPosition({
        x: Math.max(0, (window.innerWidth - dialogWidth) / 2),
        y: Math.max(0, (window.innerHeight - dialogHeight) / 2),
      })
    }
    centerDialog()
    window.addEventListener("resize", centerDialog)
    return () => window.removeEventListener("resize", centerDialog)
  }, [])

  useEffect(() => {
    if (!dragging) return

    const onMouseMove = (event: MouseEvent) => {
      const dialog = dialogRef.current
      if (!dialog) return
      const rect = dialog.getBoundingClientRect()
      const maxX = Math.max(0, window.innerWidth - rect.width)
      const maxY = Math.max(0, window.innerHeight - rect.height)
      setPosition({
        x: Math.min(Math.max(0, event.clientX - dragOffsetRef.current.x), maxX),
        y: Math.min(Math.max(0, event.clientY - dragOffsetRef.current.y), maxY),
      })
    }

    const onMouseUp = () => setDragging(false)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [dragging])

  const startDrag = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!dialogRef.current) return
    const rect = dialogRef.current.getBoundingClientRect()
    dragOffsetRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    setDragging(true)
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/45">
      <div
        ref={dialogRef}
        className="connect-window absolute"
        style={{ left: `${position.x}px`, top: `${position.y}px`, width: "560px" }}
      >
        <div className="connect-titlebar" onMouseDown={startDrag}>
          <div className="connect-title-left">
            <SsrmServerIcon />
            <span>Connect to Server</span>
          </div>
          <button type="button" className="connect-close" onClick={() => {}} aria-label="Close">
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        <div className="connect-body">
          <div className="ssms-title-wrap">
            <h2 className="ssms-title">SQL Server</h2>
            <div className="ssms-title-line"></div>
          </div>

          <div className="connect-form">
            <label>Server type:</label>
            <div className="connect-input connect-select select-ssms">
              <span>Database Engine</span>
              <span className="connect-triangle"></span>
            </div>

            <label>Server name:</label>
            <div className="connect-input connect-select select-ssms">
              <span>APON\SQLEXPRESS</span>
              <span className="connect-triangle"></span>
            </div>

            <label>Authentication:</label>
            <div className="connect-input connect-select select-ssms">
              <span>Windows Authentication</span>
              <span className="connect-triangle"></span>
            </div>

            <label className="connect-disabled-label">User name:</label>
            <div className="connect-input connect-select connect-disabled-input select-ssms username-offset">
              <span>APON\ASUS</span>
              <span className="connect-triangle"></span>
            </div>

            <label className="connect-disabled-label">Password:</label>
            <input className="connect-input connect-disabled-input" type="password" value="" readOnly disabled />
          </div>

          <label className="connect-remember">
            <input type="checkbox" disabled />
            Remember password
          </label>

          <div className="connect-actions">
            <button onClick={onConnect}>Visual Portfolio</button>
            <button onClick={onConnect}>Connect</button>
            <button onClick={onCancel}>Cancel</button>
            <button onClick={onHelp}>Help</button>
            <button onClick={onOptions}>Options &gt;&gt;</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SsrmServerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 64 64" aria-hidden="true">
      <rect x="2" y="27" width="32" height="19" rx="2.5" fill="#1f1f1f" />
      <rect x="5" y="30" width="26" height="13" fill="#f3f3f3" />
      <rect x="15" y="46" width="6" height="4" fill="#1f1f1f" />
      <rect x="10" y="50" width="16" height="3" rx="1.2" fill="#1f1f1f" />
      <path d="M34 44h14c2 0 3-1 3-3V38" fill="none" stroke="#2bb24a" strokeWidth="2.3" />
      <rect x="37" y="9" width="23" height="31" rx="3" fill="#1f1f1f" />
      <rect x="41" y="13" width="15" height="4" fill="#f3f3f3" />
      <rect x="41" y="20" width="15" height="4" fill="#f3f3f3" />
      <circle cx="53" cy="33" r="2.2" fill="#f3f3f3" />
    </svg>
  )
}
