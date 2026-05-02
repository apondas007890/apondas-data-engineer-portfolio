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
  const [serverTypeOpen, setServerTypeOpen] = useState(false)
  const [serverTypeHover, setServerTypeHover] = useState(0)
  const [serverNameOpen, setServerNameOpen] = useState(false)
  const [serverNameHover, setServerNameHover] = useState(0)
  const [authOpen, setAuthOpen] = useState(false)
  const [authHover, setAuthHover] = useState(0)
  const [userNameOpen, setUserNameOpen] = useState(false)
  const [userNameHover, setUserNameHover] = useState(0)
  const dragOffsetRef = useRef({ x: 0, y: 0 })
  const serverTypeRef = useRef<HTMLDivElement>(null)
  const serverNameRef = useRef<HTMLDivElement>(null)
  const authRef = useRef<HTMLDivElement>(null)
  const userNameRef = useRef<HTMLDivElement>(null)
  const serverTypeOptions = [
    "Database Engine",
    "Analysis Services",
    "Reporting Services",
    "Integration Services",
    "Azure-SSIS Integration Runtime",
  ]
  const serverNameOptions = [
    "APON\\SQLEXPRESS",
    "<Browse for more...>",
  ]
  const authOptions = [
    "Windows Authentication",
    "SQL Server Authentication",
    "Microsoft Entra MFA",
    "Microsoft Entra Password",
    "Microsoft Entra Integrated",
    "Microsoft Entra Service Principal",
    "Microsoft Entra Managed Identity",
    "Microsoft Entra Default",
  ]
  const userNameOptions = ["APON\\ASUS"]

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

  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (!serverTypeRef.current?.contains(target)) {
        setServerTypeOpen(false)
      }
      if (!serverNameRef.current?.contains(target)) {
        setServerNameOpen(false)
      }
      if (!authRef.current?.contains(target)) {
        setAuthOpen(false)
      }
      if (!userNameRef.current?.contains(target)) {
        setUserNameOpen(false)
      }
    }
    window.addEventListener("mousedown", onMouseDown)
    return () => window.removeEventListener("mousedown", onMouseDown)
  }, [])

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
            <div ref={serverTypeRef} className="connect-select-wrap">
              <button
                type="button"
                className="connect-input connect-select select-ssms connect-select-button"
                onClick={() => setServerTypeOpen((prev) => !prev)}
              >
                <span>Database Engine</span>
                <span className="connect-triangle"></span>
              </button>
              {serverTypeOpen ? (
                <div className="ssms-dropdown" role="listbox" aria-label="Server type">
                  {serverTypeOptions.map((option, index) => (
                    <button
                      key={option}
                      type="button"
                      className={`ssms-dropdown-item${index === serverTypeHover ? " is-hover" : ""}`}
                      onMouseEnter={() => setServerTypeHover(index)}
                      onClick={() => setServerTypeOpen(false)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <label>Server name:</label>
            <div ref={serverNameRef} className="connect-select-wrap">
              <button
                type="button"
                className="connect-input connect-select select-ssms connect-select-button"
                onClick={() => setServerNameOpen((prev) => !prev)}
              >
                <span>APON\SQLEXPRESS</span>
                <span className="connect-triangle"></span>
              </button>
              {serverNameOpen ? (
                <div className="ssms-dropdown" role="listbox" aria-label="Server name">
                  {serverNameOptions.map((option, index) => (
                    <button
                      key={option}
                      type="button"
                      className={`ssms-dropdown-item${index === serverNameHover ? " is-hover" : ""}`}
                      onMouseEnter={() => setServerNameHover(index)}
                      onClick={() => setServerNameOpen(false)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <label>Authentication:</label>
            <div ref={authRef} className="connect-select-wrap">
              <button
                type="button"
                className="connect-input connect-select select-ssms connect-select-button"
                onClick={() => setAuthOpen((prev) => !prev)}
              >
                <span>Windows Authentication</span>
                <span className="connect-triangle"></span>
              </button>
              {authOpen ? (
                <div className="ssms-dropdown" role="listbox" aria-label="Authentication">
                  {authOptions.map((option, index) => (
                    <button
                      key={option}
                      type="button"
                      className={`ssms-dropdown-item${index === authHover ? " is-hover" : ""}`}
                      onMouseEnter={() => setAuthHover(index)}
                      onClick={() => setAuthOpen(false)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <label className="connect-disabled-label">User name:</label>
            <div ref={userNameRef} className="connect-select-wrap username-offset">
              <button
                type="button"
                className="connect-input connect-select connect-disabled-input select-ssms connect-select-button"
                onClick={() => setUserNameOpen((prev) => !prev)}
              >
                <span>APON\ASUS</span>
                <span className="connect-triangle"></span>
              </button>
              {userNameOpen ? (
                <div className="ssms-dropdown" role="listbox" aria-label="User name">
                  {userNameOptions.map((option, index) => (
                    <button
                      key={option}
                      type="button"
                      className={`ssms-dropdown-item${index === userNameHover ? " is-hover" : ""}`}
                      onMouseEnter={() => setUserNameHover(index)}
                      onClick={() => setUserNameOpen(false)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : null}
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
