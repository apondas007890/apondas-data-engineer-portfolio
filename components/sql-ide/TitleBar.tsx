"use client"

import { useState } from "react"
import { Copy, Search, X } from "lucide-react"

interface TitleBarProps {
  title: string
}

export function TitleBar({ title }: TitleBarProps) {
  const [quickLaunch, setQuickLaunch] = useState("")
  const [isQuickLaunchFocused, setIsQuickLaunchFocused] = useState(false)

  return (
    <div className="flex h-[36px] items-center bg-[#2d2d30] pl-2 pr-0.5">
      <div className="mr-2 flex h-[24px] w-[24px] items-center justify-center">
        <img
          src="/ssms-app-icon.webp"
          alt="App icon"
          className="h-[22px] w-[22px] object-contain"
          draggable={false}
        />
      </div>

      <div
        className="min-w-0 flex-1 truncate pointer-events-none font-['Segoe_UI',system-ui,sans-serif] text-[13px] text-[#8f96a1] select-none"
        onMouseDown={(e) => e.preventDefault()}
      >
        {title}
      </div>

      <div className="ml-0.5 mr-0 hidden h-[32px] w-[200px] items-center border border-[#4a4a4a] bg-[#333337] pl-3 pr-1 font-['Segoe_UI',system-ui,sans-serif] transition-colors hover:border-[#8f93c8] hover:shadow-[inset_0_0_0_1px_rgba(143,147,200,0.35)] focus-within:border-[#8f93c8] focus-within:shadow-[inset_0_0_0_1px_rgba(143,147,200,0.35)] sm:flex">
        <input
          type="text"
          value={quickLaunch}
          onChange={(e) => setQuickLaunch(e.target.value)}
          onFocus={() => setIsQuickLaunchFocused(true)}
          onBlur={() => setIsQuickLaunchFocused(false)}
          placeholder={isQuickLaunchFocused ? "" : "Quick Launch (Ctrl+Q)"}
          className="min-w-0 flex-1 bg-transparent pl-0 text-[11px] text-[#e0e0e0] placeholder:text-[#9e9e9e] outline-none"
          aria-label="Quick Launch"
        />
        <button
          type="button"
          onClick={() => {}}
          className="ml-1 flex h-[24px] w-[24px] cursor-default items-center justify-center rounded-none text-[#cfcfcf] hover:bg-[#34343a] hover:text-[#e0e0e0]"
          aria-label="Search"
        >
          <Search size={14} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex items-center gap-0">
        <button type="button" onClick={() => {}} className="flex h-[32px] w-[32px] cursor-default items-center justify-center rounded-none text-[18px] leading-none text-[#c8cdd6] hover:bg-[#34343a] hover:text-[#e2e6ee]">
          _
        </button>
        <button type="button" onClick={() => {}} className="flex h-[32px] w-[32px] cursor-default items-center justify-center rounded-none text-[#c8cdd6] hover:bg-[#34343a] hover:text-[#e2e6ee]">
          <Copy size={13} strokeWidth={2.5} />
        </button>
        <button type="button" onClick={() => {}} className="flex h-[32px] w-[32px] cursor-default items-center justify-center rounded-none text-[#c8cdd6] hover:bg-[#34343a] hover:text-[#e2e6ee] active:bg-[#c42b1c] active:text-[#ffffff]">
          <X size={15} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}
