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
  const helpRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [serverTypeOpen, setServerTypeOpen] = useState(false)
  const [serverTypeHover, setServerTypeHover] = useState(0)
  const [serverNameOpen, setServerNameOpen] = useState(false)
  const [serverNameHover, setServerNameHover] = useState(0)
  const [authOpen, setAuthOpen] = useState(false)
  const [authHover, setAuthHover] = useState(0)
  const [userNameOpen, setUserNameOpen] = useState(false)
  const [userNameHover, setUserNameHover] = useState(0)
  const dragOffsetRef = useRef({ x: 0, y: 0 })
  const dialogSizeRef = useRef({ width: 480, height: 320 })
  const dragRafRef = useRef<number | null>(null)
  const pendingPositionRef = useRef({ x: 0, y: 0 })
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
      const dialogWidth = 480
      const dialogHeight = 320
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
      const maxX = Math.max(0, window.innerWidth - dialogSizeRef.current.width)
      const maxY = Math.max(0, window.innerHeight - dialogSizeRef.current.height)
      pendingPositionRef.current = {
        x: Math.min(Math.max(0, event.clientX - dragOffsetRef.current.x), maxX),
        y: Math.min(Math.max(0, event.clientY - dragOffsetRef.current.y), maxY),
      }

      if (dragRafRef.current === null) {
        dragRafRef.current = window.requestAnimationFrame(() => {
          setPosition(pendingPositionRef.current)
          dragRafRef.current = null
        })
      }
    }

    const onMouseUp = () => setDragging(false)
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
      if (dragRafRef.current !== null) {
        window.cancelAnimationFrame(dragRafRef.current)
        dragRafRef.current = null
      }
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
      if (helpOpen && helpRef.current && !helpRef.current.contains(target)) {
        setHelpOpen(false)
      }
    }
    window.addEventListener("mousedown", onMouseDown)
    return () => window.removeEventListener("mousedown", onMouseDown)
  }, [helpOpen])

  useEffect(() => {
    if (!helpOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setHelpOpen(false)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [helpOpen])

  const startDrag = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!dialogRef.current) return
    event.preventDefault()
    const rect = dialogRef.current.getBoundingClientRect()
    dialogSizeRef.current = { width: rect.width, height: rect.height }
    dragOffsetRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    setDragging(true)
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/45 backdrop-blur-[3px]">
      {!helpOpen ? (
        <div
          ref={dialogRef}
          className="connect-window absolute"
          style={{ left: `${position.x}px`, top: `${position.y}px`, width: "480px" }}
        >
          <div className="connect-titlebar" onMouseDown={startDrag} style={{ cursor: "default" }}>
            <div className="connect-title-left" style={{ cursor: "default" }}>
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
              <button onClick={() => {}}>Visual Portfolio</button>
              <button onClick={onConnect}>Connect</button>
              <button onClick={onCancel}>Cancel</button>
              <button
                onClick={() => {
                  onHelp()
                  setHelpOpen(true)
                }}
              >
                Help
              </button>
              <button onClick={onOptions}>Options &gt;&gt;</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-6">
          <div
            ref={helpRef}
            className="connect-help-window animate-[ssmsHelpIn_.16s_ease-out]"
          >
            <div className="connect-help-titlebar">
              <div className="connect-help-titlecopy">
                <span className="connect-help-title">SSMS Portfolio Guide</span>
              </div>
              <button
                type="button"
                className="connect-help-close"
                onClick={() => setHelpOpen(false)}
                aria-label="Close help"
              >
                <X size={13} strokeWidth={2} />
              </button>
            </div>

            <div className="connect-help-body">
              <section className="connect-help-section">
                <h3>Welcome</h3>
                <p>
                  This is a <span className="help-accent-blue">SQL Server</span> inspired portfolio interface built to
                  feel like a real <span className="help-accent-purple">SSMS</span> workspace while showcasing your work.
                </p>
                <p>Instead of normal navigation, visitors explore sections as if they are querying a database.</p>
              </section>

              <section className="connect-help-section">
                <h3>How to Start</h3>
                <p>
                  Click{" "}
                  <button
                    type="button"
                    className="connect-help-inline-button"
                    onClick={() => {
                      setHelpOpen(false)
                      onConnect()
                    }}
                  >
                    Connect
                  </button>{" "}
                  to enter the main SSMS interface.
                </p>
                <p>This opens the workspace with the editor, results, and Object Explorer.</p>
              </section>

              <section className="connect-help-section">
                <h3>Visual Portfolio Button</h3>
                <p>
                  Click <span className="help-accent-blue">Visual Portfolio</span> to switch from the SSMS-style workspace to the standard portfolio view, where you can browse About, Education, Experience, Skills, and Projects in a normal visual layout.
                </p>
              </section>

              <section className="connect-help-section">
                <h3>How to Query</h3>
                <div className="connect-help-code">
                  <div><span className="help-keyword">SELECT</span> * <span className="help-keyword">FROM</span> <span className="help-view">Portfolio.about</span> <span className="help-comment">-- Shows personal / about information</span></div>
                  <div><span className="help-keyword">SELECT</span> * <span className="help-keyword">FROM</span> <span className="help-view">Portfolio.educations</span> <span className="help-comment">-- Shows education history</span></div>
                  <div><span className="help-keyword">SELECT</span> * <span className="help-keyword">FROM</span> <span className="help-view">Portfolio.experiences</span> <span className="help-comment">-- Shows internship and work experience</span></div>
                  <div><span className="help-keyword">SELECT</span> * <span className="help-keyword">FROM</span> <span className="help-view">Portfolio.projects</span> <span className="help-comment">-- Shows portfolio projects</span></div>
                  <div><span className="help-keyword">SELECT</span> * <span className="help-keyword">FROM</span> <span className="help-view">Portfolio.skills</span> <span className="help-comment">-- Shows technical skills</span></div>
                  <div><span className="help-keyword">SELECT</span> * <span className="help-keyword">FROM</span> <span className="help-view">Portfolio.certifications</span> <span className="help-comment">-- Shows certificates and achievements</span></div>
                </div>
                <p className="connect-help-note">Results will appear in grid or text format depending on the selected results mode.</p>
              </section>

              <section className="connect-help-section">
                <h3>UI Behavior</h3>
                <p>Only some buttons are functional. Interactive controls show clearer hover states, while others remain for visual realism.</p>
              </section>

              <section className="connect-help-section">
                <h3>Editor Features</h3>
                <ul className="connect-help-list">
                  <li>SQL syntax highlighting</li>
                  <li>Yellow active line indicator</li>
                  <li>Results panel with Grid and Text output modes</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}
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
