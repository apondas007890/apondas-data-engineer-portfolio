"use client"

import { useState, useRef, useEffect } from "react"

interface OptionsWindowProps {
  onClose: () => void
}

export function OptionsWindow({ onClose }: OptionsWindowProps) {
  const [position, setPosition] = useState({ x: 150, y: 80 })
  const [isDragging, setIsDragging] = useState(false)
  const dragOffset = useRef({ x: 0, y: 0 })
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock login - just close the window
    onClose()
  }

  return (
    <div
      className="fixed z-[60] w-[400px] border border-[#3c3c3c] bg-[#2d2d30] shadow-2xl"
      style={{ left: position.x, top: position.y }}
    >
      {/* Title bar - draggable */}
      <div
        className="flex h-[28px] cursor-move items-center justify-between border-b border-[#3c3c3c] bg-[#3c3c3c] px-2"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="5" fill="#414141" stroke="#f0eff1" strokeWidth="0.5" />
            <circle cx="8" cy="8" r="2" fill="#f0eff1" />
            <rect x="7" y="1" width="2" height="3" fill="#414141" stroke="#f0eff1" strokeWidth="0.3" />
            <rect x="7" y="12" width="2" height="3" fill="#414141" stroke="#f0eff1" strokeWidth="0.3" />
          </svg>
          <span className="text-[12px] text-white">Admin Panel - Login</span>
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
      <form onSubmit={handleLogin} className="p-6">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#0e639c]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white">Administrator Login</h2>
          <p className="text-[12px] text-[#888888]">Sign in to access admin features</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-[12px] text-[#cccccc]">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="h-[32px] w-full border border-[#3c3c3c] bg-[#3c3c3c] px-3 text-[12px] text-white placeholder-[#666666] focus:border-[#007acc] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-[12px] text-[#cccccc]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="h-[32px] w-full border border-[#3c3c3c] bg-[#3c3c3c] px-3 text-[12px] text-white placeholder-[#666666] focus:border-[#007acc] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-[12px] text-[#cccccc]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-3 w-3"
              />
              Remember me
            </label>
            <button type="button" className="text-[11px] text-[#569cd6] hover:underline">
              Forgot password?
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <button
            type="submit"
            className="h-[32px] w-full bg-[#0e639c] text-[12px] font-medium text-white hover:bg-[#1177bb] focus:outline-none"
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-[32px] w-full border border-[#3c3c3c] bg-[#3c3c3c] text-[12px] text-white hover:bg-[#505050] focus:outline-none"
          >
            Cancel
          </button>
        </div>

        <div className="mt-4 border-t border-[#3c3c3c] pt-4">
          <p className="text-center text-[11px] text-[#666666]">
            Need access? Contact your database administrator.
          </p>
        </div>
      </form>
    </div>
  )
}
