"use client"

import { useState, useCallback, createContext, useContext } from "react"
import { Topbar } from "@/components/sql-ide/topbar"
import { Sidebar } from "@/components/sql-ide/sidebar"
import { EditorTabs } from "@/components/sql-ide/editor-tabs"
import { Editor } from "@/components/sql-ide/editor"
import { ResultsPanel } from "@/components/sql-ide/results-panel"
import { StatusBar } from "@/components/sql-ide/status-bar"
import { SplashScreen } from "@/components/sql-ide/splash-screen"
import { ConnectDialog } from "@/components/sql-ide/connect-dialog"

export interface Tab {
  id: string
  name: string
  content: string
}

export interface CursorPosition {
  line: number
  col: number
  ch: number
}

type Theme = "dark" | "light"
type FocusArea = "sidebar" | "editor"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  focusArea: FocusArea
  setFocusArea: (area: FocusArea) => void
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {},
  focusArea: "editor",
  setFocusArea: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export default function SQLIDEPage() {
  const [showSplash, setShowSplash] = useState(true)
  const [showConnectDialog, setShowConnectDialog] = useState(false)
  const [theme, setTheme] = useState<Theme>("dark")
  const [focusArea, setFocusArea] = useState<FocusArea>("editor")
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: "1",
      name: "SQLQuery2.sql",
      content: "SELECT * FROM Users WHERE active = 1;",
    },
  ])
  const [activeTabId, setActiveTabId] = useState("1")
  const [isExecuting, setIsExecuting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [resultData, setResultData] = useState<Record<string, string | number>[] | null>(null)
  const [sidebarWidth, setSidebarWidth] = useState(280)
  const [selectedNode, setSelectedNode] = useState<string | null>("server")
  const [rowCount, setRowCount] = useState(0)
  const [editorZoom, setEditorZoom] = useState(113)
  const [cursor, setCursor] = useState<CursorPosition>({ line: 1, col: 1, ch: 1 })
  const [currentDatabase, setCurrentDatabase] = useState("Portfolio")

  const activeTab = tabs.find((tab) => tab.id === activeTabId)

  const handleNewQuery = useCallback(() => {
    const newId = String(Date.now())
    const newTab: Tab = {
      id: newId,
      name: `SQLQuery${tabs.length + 1}.sql`,
      content: "",
    }
    setTabs((prev) => [...prev, newTab])
    setActiveTabId(newId)
    setFocusArea("editor")
  }, [tabs.length])

  const handleCloseTab = useCallback(
    (tabId: string) => {
      if (tabs.length === 1) return
      const newTabs = tabs.filter((tab) => tab.id !== tabId)
      setTabs(newTabs)
      if (activeTabId === tabId) {
        setActiveTabId(newTabs[newTabs.length - 1].id)
      }
    },
    [tabs, activeTabId]
  )

  const handleTabChange = useCallback((tabId: string) => {
    setActiveTabId(tabId)
    setFocusArea("editor")
  }, [])

  const handleContentChange = useCallback(
    (content: string) => {
      setTabs((prev) => prev.map((tab) => (tab.id === activeTabId ? { ...tab, content } : tab)))
    },
    [activeTabId]
  )

  const handleExecute = useCallback(() => {
    setIsExecuting(true)
    setShowResults(true)
    setTimeout(() => {
      const results = [
        { id: 1, username: "john_doe", email: "john@example.com", active: 1, created_at: "2024-01-15" },
        { id: 2, username: "jane_smith", email: "jane@example.com", active: 1, created_at: "2024-02-20" },
        { id: 3, username: "bob_wilson", email: "bob@example.com", active: 1, created_at: "2024-03-10" },
        { id: 4, username: "alice_brown", email: "alice@example.com", active: 1, created_at: "2024-04-05" },
        { id: 5, username: "charlie_davis", email: "charlie@example.com", active: 1, created_at: "2024-05-12" },
      ]
      setResultData(results)
      setRowCount(results.length)
      setIsExecuting(false)
    }, 1500)
  }, [])

  const handleSidebarSelect = useCallback((nodeId: string | null) => {
    setSelectedNode(nodeId)
    setFocusArea("sidebar")
  }, [])

  const handleZoomChange = useCallback((nextZoom: number) => {
    const clamped = Math.max(20, Math.min(400, nextZoom))
    setEditorZoom(clamped)
  }, [])

  const handleCursorChange = useCallback((nextCursor: CursorPosition) => {
    setCursor(nextCursor)
  }, [])

  const isDark = theme === "dark"

  return (
      <ThemeContext.Provider value={{ theme, setTheme, focusArea, setFocusArea }}>
      {showSplash && (
        <SplashScreen
          onComplete={() => {
            setShowSplash(false)
            setShowConnectDialog(true)
          }}
        />
      )}
      {showConnectDialog && (
        <ConnectDialog
          onConnect={() => setShowConnectDialog(false)}
          onCancel={() => {}}
          onHelp={() => {}}
          onOptions={() => {}}
        />
      )}
      <div
        className={`sql-ide-root flex h-screen flex-col font-['Segoe_UI',system-ui,sans-serif] text-[12px] ${
          isDark ? "bg-[#2d2d30] text-[#cccccc]" : "bg-[#f3f3f3] text-[#1e1e1e]"
        }`}
      >
        <Topbar
          onNewQuery={handleNewQuery}
          onExecute={handleExecute}
          isExecuting={isExecuting}
          currentDatabase={currentDatabase}
          onDatabaseChange={setCurrentDatabase}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            width={sidebarWidth}
            onWidthChange={setSidebarWidth}
            selectedNode={selectedNode}
            onSelectNode={handleSidebarSelect}
          />
          <div 
            className="flex min-w-0 flex-1 flex-col overflow-hidden"
            onClick={() => setFocusArea("editor")}
          >
            <EditorTabs
              tabs={tabs}
              activeTabId={activeTabId}
              onTabChange={handleTabChange}
              onCloseTab={handleCloseTab}
            />
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <Editor
                content={activeTab?.content || ""}
                onChange={handleContentChange}
                zoom={editorZoom}
                onZoomChange={handleZoomChange}
                onCursorChange={handleCursorChange}
              />
              {showResults && (
                <ResultsPanel
                  data={resultData}
                  isLoading={isExecuting}
                  onClose={() => setShowResults(false)}
                />
              )}
            </div>
            <StatusBar
              rowCount={rowCount}
              currentDatabase={currentDatabase}
              zoom={editorZoom}
              onZoomChange={handleZoomChange}
              cursor={cursor}
            />
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  )
}
