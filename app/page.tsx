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
      content: "",
    },
  ])
  const [activeTabId, setActiveTabId] = useState("1")
  const [isExecuting, setIsExecuting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [resultData, setResultData] = useState<Record<string, string | number>[] | null>(null)
  const [sidebarWidth, setSidebarWidth] = useState(280)
  const [selectedNode, setSelectedNode] = useState<string | null>("server")
  const [rowCount, setRowCount] = useState(0)
  const [editorZoom, setEditorZoom] = useState(125)
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
        {
          OrderID: 1,
          ProductID: 101,
          CustomerID: 2,
          SalesPersonID: 3,
          OrderDate: "2025-01-01",
          ShipDate: "2025-01-05",
          OrderStatus: "Delivered",
          ShipAddress: "9833 Mt. Dias Blv.",
          BillAddress: "1226 Shoe St.",
          Quantity: 1,
          Sales: 10,
          CreationTime: "2025-01-01 12:34:56.0000000",
        },
        {
          OrderID: 2,
          ProductID: 102,
          CustomerID: 3,
          SalesPersonID: 3,
          OrderDate: "2025-01-05",
          ShipDate: "2025-01-10",
          OrderStatus: "Shipped",
          ShipAddress: "250 Race Court",
          BillAddress: "NULL",
          Quantity: 1,
          Sales: 15,
          CreationTime: "2025-01-05 23:22:04.0000000",
        },
        {
          OrderID: 3,
          ProductID: 101,
          CustomerID: 1,
          SalesPersonID: 5,
          OrderDate: "2025-01-10",
          ShipDate: "2025-01-25",
          OrderStatus: "Delivered",
          ShipAddress: "8157 W. Book",
          BillAddress: "8157 W. Book",
          Quantity: 2,
          Sales: 20,
          CreationTime: "2025-01-10 18:24:08.0000000",
        },
        {
          OrderID: 4,
          ProductID: 105,
          CustomerID: 1,
          SalesPersonID: 3,
          OrderDate: "2025-01-20",
          ShipDate: "2025-01-25",
          OrderStatus: "Shipped",
          ShipAddress: "5724 Victory Lane",
          BillAddress: "",
          Quantity: 2,
          Sales: 60,
          CreationTime: "2025-01-20 05:50:33.0000000",
        },
        {
          OrderID: 5,
          ProductID: 104,
          CustomerID: 2,
          SalesPersonID: 5,
          OrderDate: "2025-02-01",
          ShipDate: "2025-02-05",
          OrderStatus: "Delivered",
          ShipAddress: "NULL",
          BillAddress: "NULL",
          Quantity: 1,
          Sales: 25,
          CreationTime: "2025-02-01 14:02:41.0000000",
        },
        {
          OrderID: 6,
          ProductID: 104,
          CustomerID: 3,
          SalesPersonID: 5,
          OrderDate: "2025-02-05",
          ShipDate: "2025-02-10",
          OrderStatus: "Delivered",
          ShipAddress: "1792 Belmont Rd.",
          BillAddress: "NULL",
          Quantity: 2,
          Sales: 50,
          CreationTime: "2025-02-06 15:34:57.0000000",
        },
        {
          OrderID: 7,
          ProductID: 102,
          CustomerID: 1,
          SalesPersonID: 1,
          OrderDate: "2025-02-15",
          ShipDate: "2025-02-27",
          OrderStatus: "Delivered",
          ShipAddress: "136 Balboa Court",
          BillAddress: "",
          Quantity: 2,
          Sales: 30,
          CreationTime: "2025-02-16 06:22:01.0000000",
        },
        {
          OrderID: 8,
          ProductID: 101,
          CustomerID: 4,
          SalesPersonID: 3,
          OrderDate: "2025-02-18",
          ShipDate: "2025-02-27",
          OrderStatus: "Shipped",
          ShipAddress: "2947 Vine Lane",
          BillAddress: "4311 Clay Rd",
          Quantity: 3,
          Sales: 90,
          CreationTime: "2025-02-18 10:45:22.0000000",
        },
        {
          OrderID: 9,
          ProductID: 101,
          CustomerID: 2,
          SalesPersonID: 3,
          OrderDate: "2025-03-10",
          ShipDate: "2025-03-15",
          OrderStatus: "Shipped",
          ShipAddress: "3768 Door Way",
          BillAddress: "",
          Quantity: 2,
          Sales: 20,
          CreationTime: "2025-03-10 12:59:04.0000000",
        },
        {
          OrderID: 10,
          ProductID: 102,
          CustomerID: 3,
          SalesPersonID: 5,
          OrderDate: "2025-03-15",
          ShipDate: "2025-03-20",
          OrderStatus: "Shipped",
          ShipAddress: "NULL",
          BillAddress: "NULL",
          Quantity: 0,
          Sales: 60,
          CreationTime: "2025-03-16 23:25:15.0000000",
        },
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
        <div className="main-content flex flex-1 min-h-0 overflow-hidden">
          <Sidebar
            width={sidebarWidth}
            onWidthChange={setSidebarWidth}
            selectedNode={selectedNode}
            onSelectNode={handleSidebarSelect}
          />
          <div className={`vertical-splitter w-[10px] shrink-0 ${isDark ? "bg-[#2d2d30]" : "bg-[#e6e6e6]"} relative`} />
          <div
            className="sql-editor-area flex min-w-0 flex-1 flex-col overflow-hidden"
            onClick={() => setFocusArea("editor")}
          >
            <div className="sql-editor-panel flex min-h-0 flex-1 flex-col overflow-hidden box-border">
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
                  showPlaceholder={activeTabId === "1"}
                />
                {showResults && (
                  <ResultsPanel
                    data={resultData}
                    isLoading={isExecuting}
                    onClose={() => setShowResults(false)}
                  />
                )}
              </div>
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

        <div className={`status-gap h-[6px] shrink-0 ${isDark ? "bg-[#2d2d30]" : "bg-[#f3f3f3]"}`} />

        <div className={`global-status-bar flex h-[24px] shrink-0 select-none items-center justify-between px-2 text-[11px] ${isDark ? "bg-[#5b5794] text-white" : "bg-[#5b5794] text-white"}`}>
          <div className="flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M2 2.5h7.4L8.2 9.5H0.8z" fill="none" strokeLinejoin="miter" />
            </svg>
            <span>Ready</span>
          </div>
          <div className="flex items-center gap-6">
            <span>{`Ln ${cursor.line}`}</span>
            <span>{`Col ${cursor.col}`}</span>
            <span>{`Ch ${cursor.ch}`}</span>
            <span>INS</span>
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  )
}
