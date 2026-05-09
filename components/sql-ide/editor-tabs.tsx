"use client"

import { XIcon } from "lucide-react"
import type { Tab } from "@/app/page"
import { useTheme } from "@/app/page"

interface EditorTabsProps {
  tabs: Tab[]
  activeTabId: string
  onTabChange: (tabId: string) => void
  onCloseTab: (tabId: string) => void
}

export function EditorTabs({ tabs, activeTabId, onTabChange, onCloseTab }: EditorTabsProps) {
  const { theme, focusArea } = useTheme()
  const isDark = theme === "dark"
  const isEditorFocused = focusArea === "editor"

  // hsl(240, 25%, 42%) = purple-ish blue for active/focused
  const activeTabBg = "hsl(240, 25%, 42%)"
  // #3f3f46 = medium dark grey for unfocused active tab
  const unfocusedActiveTabBg = "#3f3f46"

  return (
    <div
      className={`flex h-[21px] min-h-[21px] max-h-[21px] min-w-0 items-center select-none ${
        isDark ? "bg-[#2d2d30]" : "bg-[#eeeef2]"
      }`}
      style={{ height: "21px", minHeight: "21px", maxHeight: "21px", lineHeight: "21px", boxSizing: "border-box" }}
    >
      <div className="ssms-tab-scroll flex min-w-0 flex-1 overflow-x-auto overflow-y-hidden">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId
          // Determine background color based on focus state
          let bgStyle: React.CSSProperties | undefined
          if (isActive) {
            bgStyle = { backgroundColor: isEditorFocused ? activeTabBg : unfocusedActiveTabBg }
          }

          return (
            <div
              key={tab.id}
              className={`group flex h-[21px] min-h-[21px] max-h-[21px] shrink-0 cursor-pointer items-center gap-1 px-2 ${
                isDark ? "" : ""
              } ${
                isActive
                  ? isDark
                    ? "text-[#e5e5e5]"
                    : "text-white"
                  : isDark
                    ? "bg-[#2d2d2d] text-[#cccccc] hover:bg-[#2a2d2e]"
                    : "bg-[#eeeef2] text-[#1e1e1e] hover:bg-[#e5e5e5]"
              }`}
              style={{
                ...bgStyle,
                height: "21px",
                minHeight: "21px",
                maxHeight: "21px",
                lineHeight: "21px",
                boxSizing: "border-box",
              }}
              onClick={() => onTabChange(tab.id)}
            >
              <span
                className={`${
                  isActive
                    ? isDark
                      ? "text-[#e5e5e5]"
                      : "text-white"
                    : isDark
                      ? "text-[#e5e5e5]"
                      : "text-[#1e1e1e]"
                }`}
                style={{ fontSize: "11px" }}
              >
                {tab.name} - A...o (APON\ASUS (81))
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onCloseTab(tab.id)
                }}
                className={`ml-1 p-0.5 ${
                  isActive
                    ? "hover:bg-white/20"
                    : "opacity-0 group-hover:opacity-100"
                } ${isDark ? "hover:bg-[#3c3c3c]" : "hover:bg-[#d4d4d4]"}`}
              >
                <XIcon size={10} />
              </button>
            </div>
          )
        })}
      </div>
      <style jsx global>{`
        .ssms-tab-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .ssms-tab-scroll::-webkit-scrollbar-track {
          background: ${isDark ? "#252526" : "#e5e5e5"};
        }
        .ssms-tab-scroll::-webkit-scrollbar-thumb {
          background: ${isDark ? "#5f5f5f" : "#b7b7b7"};
          border-radius: 8px;
        }
        .ssms-tab-scroll {
          scrollbar-width: thin;
          scrollbar-color: ${isDark ? "#5f5f5f #252526" : "#b7b7b7 #e5e5e5"};
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  )
}
