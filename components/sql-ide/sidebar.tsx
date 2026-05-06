"use client"

import { useEffect, useState } from "react"
import { useTheme } from "@/app/page"
import { ChevronDownIcon, ChevronRightIcon, XIcon } from "lucide-react"

interface SidebarProps {
  width: number
  onWidthChange: (width: number) => void
  selectedNode: string | null
  onSelectNode: (node: string | null) => void
}

// Server icon with green connection indicator - #414141 fill with #f0eff1 inner details
const ServerIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <rect x="2" y="2" width="12" height="4" rx="0.5" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" />
    <rect x="2" y="7" width="12" height="4" rx="0.5" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" />
    <circle cx="4" cy="4" r="0.8" fill={isDark ? "#f0eff1" : "#414141"} />
    <circle cx="4" cy="9" r="0.8" fill={isDark ? "#f0eff1" : "#414141"} />
    {/* Green connection indicator */}
    <circle cx="13" cy="12" r="2.5" fill="#22c55e" />
  </svg>
)

const FolderIcon = ({ color = "#e8c44d" }: { color?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <path d="M1.5 3C1.5 2.44772 1.94772 2 2.5 2H6L7.5 4H13.5C14.0523 4 14.5 4.44772 14.5 5V12C14.5 12.5523 14.0523 13 13.5 13H2.5C1.94772 13 1.5 12.5523 1.5 12V3Z" fill={color} />
  </svg>
)

const DatabaseIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <ellipse cx="8" cy="4" rx="5" ry="2" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" />
    <path d="M3 4v8c0 1.1 2.24 2 5 2s5-.9 5-2V4" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" />
    <path d="M3 7c0 1.1 2.24 2 5 2s5-.9 5-2" stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" fill="none" />
    <path d="M3 10c0 1.1 2.24 2 5 2s5-.9 5-2" stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" fill="none" />
  </svg>
)

const TableIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <rect x="2" y="2" width="12" height="12" rx="1" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" />
    <line x1="2" y1="5" x2="14" y2="5" stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.8" />
    <line x1="6" y1="5" x2="6" y2="14" stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" />
    <line x1="10" y1="5" x2="10" y2="14" stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" />
  </svg>
)

const ViewIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <rect x="2" y="3" width="12" height="10" rx="1" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" />
    <circle cx="8" cy="8" r="3" fill={isDark ? "#f0eff1" : "#414141"} />
    <circle cx="8" cy="8" r="1.5" fill={isDark ? "#414141" : "#f0eff1"} />
  </svg>
)

// Column icon with vertical bars - properly aligned
const ColumnIcon = ({ isDark, isPK = false }: { isDark: boolean; isPK?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    {isPK ? (
      <>
        {/* Key icon for primary key */}
        <circle cx="5" cy="5" r="3" fill="#c9a227" stroke="#c9a227" strokeWidth="0.5" />
        <circle cx="5" cy="5" r="1.2" fill={isDark ? "#414141" : "#f0eff1"} />
        <path d="M7 7l5 5M10 10l2-2" stroke="#c9a227" strokeWidth="1.5" fill="none" />
      </>
    ) : (
      <>
        {/* Standard column icon */}
        <rect x="3" y="3" width="3" height="10" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.4" />
        <rect x="7" y="3" width="3" height="10" fill={isDark ? "#4a4a4a" : "#e0e0e0"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.4" />
        <rect x="11" y="3" width="2" height="10" fill={isDark ? "#555555" : "#d0d0d0"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.4" />
      </>
    )}
  </svg>
)

const KeyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <circle cx="5" cy="6" r="3" fill="#c9a227" />
    <path d="M7 8l6 6M11 12l2-2" stroke="#c9a227" strokeWidth="2" fill="none" />
  </svg>
)

const StatisticsIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <rect x="2" y="9" width="3" height="5" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.3" />
    <rect x="6.5" y="6" width="3" height="8" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.3" />
    <rect x="11" y="3" width="3" height="11" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.3" />
  </svg>
)

const SecurityIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <path d="M8 1L2 4v4c0 4 2.5 6.5 6 7.5 3.5-1 6-3.5 6-7.5V4L8 1z" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" />
    <path d="M6 8l2 2 3-4" stroke="#22c55e" strokeWidth="1.5" fill="none" />
  </svg>
)

const BoxIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <rect x="2" y="2" width="12" height="12" rx="1" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" />
  </svg>
)

const ReplicationIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <circle cx="4" cy="8" r="2.5" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" />
    <circle cx="12" cy="8" r="2.5" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" />
    <path d="M6.5 8h3" stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="1" />
    <path d="M8 6l2 2-2 2" fill={isDark ? "#f0eff1" : "#414141"} />
  </svg>
)

const ManagementIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <circle cx="8" cy="8" r="5" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" />
    <circle cx="8" cy="8" r="2" fill={isDark ? "#f0eff1" : "#414141"} />
    <rect x="7" y="1" width="2" height="3" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.3" />
    <rect x="7" y="12" width="2" height="3" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.3" />
    <rect x="1" y="7" width="3" height="2" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.3" />
    <rect x="12" y="7" width="3" height="2" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.3" />
  </svg>
)

const ProfilerIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <rect x="2" y="2" width="12" height="12" rx="1" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" />
    <path d="M4 10l2-3 2 2 4-5" stroke="#22c55e" strokeWidth="1.5" fill="none" />
  </svg>
)

const DiagramIcon = ({ isDark }: { isDark: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
    <rect x="2" y="2" width="5" height="4" rx="0.5" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" />
    <rect x="9" y="10" width="5" height="4" rx="0.5" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" />
    <path d="M4.5 6v4h7V10" stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.8" fill="none" />
  </svg>
)

interface TreeNode {
  id: string
  label: string
  iconType: "server" | "folder" | "database" | "table" | "view" | "column" | "column-pk" | "key" | "statistics" | "security" | "box" | "replication" | "management" | "profiler" | "diagram"
  folderColor?: string
  children?: TreeNode[]
}

const treeData: TreeNode[] = [
  {
    id: "server",
    label: "APON\\SQLEXPRESS (SQL Server 16.0.1175 - APON\\ASUS)",
    iconType: "server",
    children: [
      {
        id: "databases",
        label: "Databases",
        iconType: "folder",
        folderColor: "#e8c44d",
        children: [
          {
            id: "system-databases",
            label: "System Databases",
            iconType: "folder",
            folderColor: "#e8c44d",
            children: [
              { id: "master", label: "master", iconType: "database" },
              { id: "model", label: "model", iconType: "database" },
              { id: "msdb", label: "msdb", iconType: "database" },
              { id: "tempdb", label: "tempdb", iconType: "database" },
            ],
          },
          { id: "database-snapshots", label: "Database Snapshots", iconType: "folder", folderColor: "#e8c44d" },
          { id: "adventureworks", label: "AdventureWorksDW2022", iconType: "database" },
          {
            id: "datawarehouse",
            label: "DataWarehouse",
            iconType: "database",
            children: [
              { id: "dw-diagrams", label: "Database Diagrams", iconType: "folder", folderColor: "#e8c44d" },
              {
                id: "dw-tables",
                label: "Tables",
                iconType: "folder",
                folderColor: "#e8c44d",
                children: [
                  { id: "system-tables", label: "System Tables", iconType: "folder", folderColor: "#e8c44d" },
                  { id: "file-tables", label: "FileTables", iconType: "folder", folderColor: "#e8c44d" },
                  { id: "external-tables", label: "External Tables", iconType: "folder", folderColor: "#e8c44d" },
                  { id: "graph-tables", label: "Graph Tables", iconType: "folder", folderColor: "#e8c44d" },
                  {
                    id: "bronze-crm-cust",
                    label: "bronze.crm_cust_info",
                    iconType: "table",
                    children: [
                      {
                        id: "cust-columns",
                        label: "Columns",
                        iconType: "folder",
                        folderColor: "#e8c44d",
                        children: [
                          { id: "cst_id", label: "cst_id (int, null)", iconType: "column" },
                          { id: "cst_key", label: "cst_key (nvarchar(50), null)", iconType: "column" },
                          { id: "cst_firstname", label: "cst_firstname (nvarchar(50), null)", iconType: "column" },
                          { id: "cst_lastname", label: "cst_lastname (nvarchar(50), null)", iconType: "column" },
                          { id: "cst_marital", label: "cst_marital_status (nvarchar(50), null)", iconType: "column" },
                          { id: "cst_gndr", label: "cst_gndr (nvarchar(50), null)", iconType: "column" },
                          { id: "cst_create_date", label: "cst_create_date (date, null)", iconType: "column" },
                        ],
                      },
                      { id: "cust-keys", label: "Keys", iconType: "folder", folderColor: "#e8c44d" },
                      { id: "cust-constraints", label: "Constraints", iconType: "folder", folderColor: "#e8c44d" },
                      { id: "cust-triggers", label: "Triggers", iconType: "folder", folderColor: "#e8c44d" },
                      { id: "cust-indexes", label: "Indexes", iconType: "folder", folderColor: "#e8c44d" },
                      {
                        id: "cust-statistics",
                        label: "Statistics",
                        iconType: "folder",
                        folderColor: "#e8c44d",
                        children: [
                          { id: "stat1", label: "_WA_Sys_00000001_5AEE82B9", iconType: "statistics" },
                          { id: "stat2", label: "_WA_Sys_00000002_5AEE82B9", iconType: "statistics" },
                          { id: "stat3", label: "_WA_Sys_00000005_5AEE82B9", iconType: "statistics" },
                          { id: "stat4", label: "_WA_Sys_00000006_5AEE82B9", iconType: "statistics" },
                          { id: "stat5", label: "_WA_Sys_00000007_5AEE82B9", iconType: "statistics" },
                        ],
                      },
                    ],
                  },
                  { id: "bronze-prd", label: "bronze.crm_prd_info", iconType: "table" },
                  { id: "bronze-sales", label: "bronze.crm_sales_details", iconType: "table" },
                  {
                    id: "dbo-dimgeography",
                    label: "dbo.DimGeography",
                    iconType: "table",
                    children: [
                      {
                        id: "geo-columns",
                        label: "Columns",
                        iconType: "folder",
                        folderColor: "#e8c44d",
                        children: [
                          { id: "geo-key", label: "GeographyKey (PK, int, not null)", iconType: "column-pk" },
                          { id: "geo-city", label: "City (nvarchar(30), null)", iconType: "column" },
                          { id: "geo-state-code", label: "StateProvinceCode (nvarchar(3), null)", iconType: "column" },
                          { id: "geo-state-name", label: "StateProvinceName (nvarchar(50), null)", iconType: "column" },
                          { id: "geo-country-code", label: "CountryRegionCode (nvarchar(3), null)", iconType: "column" },
                          { id: "geo-eng-country", label: "EnglishCountryRegionName (nvarchar(50), null)", iconType: "column" },
                          { id: "geo-spa-country", label: "SpanishCountryRegionName (nvarchar(50), null)", iconType: "column" },
                          { id: "geo-fre-country", label: "FrenchCountryRegionName (nvarchar(50), null)", iconType: "column" },
                          { id: "geo-postal", label: "PostalCode (nvarchar(15), null)", iconType: "column" },
                          { id: "geo-sales-key", label: "SalesTerritoryKey (FK, int, null)", iconType: "column-pk" },
                          { id: "geo-ip", label: "IpAddressLocator (nvarchar(15), null)", iconType: "column" },
                        ],
                      },
                      { id: "geo-keys", label: "Keys", iconType: "folder", folderColor: "#e8c44d" },
                    ],
                  },
                  { id: "silver-cust", label: "silver.crm_cust_info", iconType: "table" },
                  { id: "silver-prd", label: "silver.crm_prd_info", iconType: "table" },
                  { id: "silver-sales", label: "silver.crm_sales_details", iconType: "table" },
                ],
              },
              {
                id: "dw-views",
                label: "Views",
                iconType: "folder",
                folderColor: "#e8c44d",
                children: [
                  { id: "dw-system-views", label: "System Views", iconType: "folder", folderColor: "#e8c44d" },
                  { id: "gold-dim-customers", label: "gold.dim_customers", iconType: "view" },
                  { id: "gold-dim-products", label: "gold.dim_products", iconType: "view" },
                  { id: "gold-fact-sales", label: "gold.fact_sales", iconType: "view" },
                ],
              },
            ],
          },
          { id: "mydatabase", label: "MyDatabase", iconType: "database" },
          { id: "portfolio", label: "Portfolio", iconType: "database" },
          { id: "practicedb", label: "PracticeDB", iconType: "database" },
          { id: "salesdb", label: "SalesDB", iconType: "database" },
        ],
      },
      {
        id: "security",
        label: "Security",
        iconType: "folder",
        folderColor: "#e8c44d",
      },
      {
        id: "server-objects",
        label: "Server Objects",
        iconType: "folder",
        folderColor: "#e8c44d",
      },
      {
        id: "replication",
        label: "Replication",
        iconType: "folder",
        folderColor: "#e8c44d",
      },
      {
        id: "management",
        label: "Management",
        iconType: "folder",
        folderColor: "#e8c44d",
      },
      { id: "xevent-profiler", label: "XEvent Profiler", iconType: "folder", folderColor: "#e8c44d" },
    ],
  },
]

const getIcon = (type: string, isDark: boolean, folderColor?: string) => {
  switch (type) {
    case "server":
      return <ServerIcon isDark={isDark} />
    case "folder":
      return <FolderIcon color={folderColor || "#e8c44d"} />
    case "database":
      return <DatabaseIcon isDark={isDark} />
    case "table":
      return <TableIcon isDark={isDark} />
    case "view":
      return <ViewIcon isDark={isDark} />
    case "column":
      return <ColumnIcon isDark={isDark} isPK={false} />
    case "column-pk":
      return <ColumnIcon isDark={isDark} isPK={true} />
    case "key":
      return <KeyIcon />
    case "statistics":
      return <StatisticsIcon isDark={isDark} />
    case "security":
      return <SecurityIcon isDark={isDark} />
    case "box":
      return <BoxIcon isDark={isDark} />
    case "replication":
      return <ReplicationIcon isDark={isDark} />
    case "management":
      return <ManagementIcon isDark={isDark} />
    case "profiler":
      return <ProfilerIcon isDark={isDark} />
    case "diagram":
      return <DiagramIcon isDark={isDark} />
    default:
      return <BoxIcon isDark={isDark} />
  }
}

export function Sidebar({ width, onWidthChange, selectedNode, onSelectNode }: SidebarProps) {
  const { theme, focusArea } = useTheme()
  const isDark = theme === "dark"
  const isFocused = focusArea === "sidebar"
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["server", "databases"]))
  const [isResizing, setIsResizing] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isPinned, setIsPinned] = useState(true)
  const [isVisible, setIsVisible] = useState(true)

  // hsl(240, 25%, 42%) for focused sidebar header
  const focusedColor = "hsl(240, 25%, 42%)"

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }
      return next
    })
  }

  useEffect(() => {
    if (!isResizing) return
    const prevUserSelect = document.body.style.userSelect
    const prevCursor = document.body.style.cursor
    document.body.style.userSelect = "none"
    document.body.style.cursor = "ew-resize"
    return () => {
      document.body.style.userSelect = prevUserSelect
      document.body.style.cursor = prevCursor
    }
  }, [isResizing])

  const handleMouseDown = () => {
    setIsResizing(true)
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault()
    const minSidebarWidth = 120
    const maxSidebarWidth = Math.max(320, window.innerWidth - 320)
    const newWidth = Math.max(minSidebarWidth, Math.min(maxSidebarWidth, e.clientX))
    onWidthChange(newWidth)
  }

  const handleMouseUp = () => {
    setIsResizing(false)
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  const renderTree = (nodes: TreeNode[], depth = 0) => {
    return nodes.map((node) => {
      const hasChildren = node.children && node.children.length > 0
      const isExpanded = expandedNodes.has(node.id)
      const isSelected = selectedNode === node.id

      return (
        <div key={node.id}>
          <div
            className={`flex cursor-pointer items-center py-[1px] pr-2 ${
              isSelected
                ? isDark
                  ? "bg-[#094771]"
                  : "bg-[#cce8ff]"
                : isDark
                  ? "hover:bg-[#2a2d2e]"
                  : "hover:bg-[#e8e8e8]"
            }`}
            style={{ paddingLeft: `${depth * 12 + 4}px` }}
            onClick={() => {
              onSelectNode(node.id)
              if (hasChildren) {
                toggleNode(node.id)
              }
            }}
          >
            <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center">
              {hasChildren ? (
                isExpanded ? (
                  <ChevronDownIcon size={12} className={isDark ? "text-[#cccccc]" : "text-[#666666]"} />
                ) : (
                  <ChevronRightIcon size={12} className={isDark ? "text-[#cccccc]" : "text-[#666666]"} />
                )
              ) : (
                <span className="w-3" />
              )}
            </span>
            <span className="mr-1 flex-shrink-0">{getIcon(node.iconType, isDark, node.folderColor)}</span>
            <span className={`truncate whitespace-nowrap text-[11px] ${isDark ? "text-[#cccccc]" : "text-[#1e1e1e]"}`}>
              {node.label}
            </span>
          </div>
          {hasChildren && isExpanded && <div>{renderTree(node.children!, depth + 1)}</div>}
        </div>
      )
    })
  }

  return (
    <div
      className={`object-explorer-wrapper relative flex flex-col ${isDark ? "bg-[#2d2d30]" : "bg-[#f3f3f3]"}`}
      style={{ width: isVisible ? `${width}px` : "24px" }}
    >
      {isVisible ? (
      <div className={`object-explorer-panel ${isDark ? "border-[#3f3f52] bg-[#1e1e1e]" : "border-[#cccccc] bg-white"}`}>
        {/* Object Explorer Header */}
        <div
          className={`object-explorer-header relative flex h-[21px] min-h-[21px] max-h-[21px] items-center justify-between px-2 py-0 ${
            isDark ? "bg-[#2d2d30] text-[#e2e2e2]" : "bg-[#eeeef2] text-[#1e1e1e]"
          }`}
          style={
            isFocused && isDark
              ? { backgroundColor: focusedColor }
              : undefined
          }
        >
          <div className="pointer-events-none absolute left-[102px] right-[48px] top-1/2 z-0 flex h-[7px] -translate-y-1/2 flex-col justify-between">
            <div className="h-px bg-repeat-x" style={{ backgroundImage: "radial-gradient(circle, #626267 0.75px, transparent 0.95px)", backgroundSize: "6px 1px" }} />
            <div className="ml-[3px] h-px bg-repeat-x" style={{ backgroundImage: "radial-gradient(circle, #626267 0.75px, transparent 0.95px)", backgroundSize: "6px 1px" }} />
            <div className="h-px bg-repeat-x" style={{ backgroundImage: "radial-gradient(circle, #626267 0.75px, transparent 0.95px)", backgroundSize: "6px 1px" }} />
          </div>
          <span className={`relative z-10 pr-2 ${isDark ? "bg-[#2d2d30] text-[#e2e2e2]" : "bg-[#eeeef2] text-[#1e1e1e]"}`}>
            Object Explorer
          </span>
          <div className={`relative z-10 flex items-center gap-1 pl-2 ${isDark ? "bg-[#2d2d30]" : "bg-[#eeeef2]"}`}>
            <button
              type="button"
              aria-label={isCollapsed ? "Expand Object Explorer" : "Collapse Object Explorer"}
              onClick={() => setIsCollapsed((prev) => !prev)}
              className={`${isDark ? "hover:bg-white/10" : "hover:bg-white/20"} p-0.5 ${isPinned ? "text-[#f0f0f0]" : "text-[#8e8e93]"}`}
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
                <path d={isCollapsed ? "M2 1l4 3-4 3z" : "M1 2.5h6L4 6z"} />
              </svg>
            </button>
            <button
              type="button"
              aria-label={isPinned ? "Unpin Object Explorer" : "Pin Object Explorer"}
              onClick={() => setIsPinned((prev) => !prev)}
              className={`${isDark ? "text-[#d0d0d0] hover:bg-white/10" : "hover:bg-white/20"} p-0.5`}
            >
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
                <path
                  d="M2 2.2h5M4.5 2.2v3.6M3.1 4.1h2.8M4.5 5.8v1.7"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="square"
                />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Close Object Explorer"
              onClick={() => setIsVisible(false)}
              className={`${isDark ? "text-[#d0d0d0] hover:bg-white/10" : "hover:bg-white/20"} p-0.5`}
            >
              <XIcon size={11} className={isDark ? "text-[#d0d0d0]" : ""} />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        {!isCollapsed && (
        <div
          className={`object-explorer-toolbar flex h-[21px] min-h-[21px] max-h-[21px] items-center px-[6px] py-0 ${
            isDark ? "bg-[#2d2d30]" : "bg-[#eeeef2]"
          }`}
          style={{ boxShadow: isDark ? "inset 0 -1px #3a3a3a" : "inset 0 -1px #cccccc" }}
        >
          <span className={`text-[12px] ${isDark ? "text-[#cccccc]" : "text-[#666666]"}`}>Connect</span>
          <span className={`text-[10px] ${isDark ? "text-[#666666]" : "text-[#999999]"}`}>▾</span>
          <div className="mx-1 h-3 w-px bg-[#3c3c3c]" />
          {/* Toolbar icons */}
          <button className={`p-0.5 ${isDark ? "hover:bg-[#3c3c3c]" : "hover:bg-[#d4d4d4]"}`}>
            <svg width="12" height="12" viewBox="0 0 16 16"><rect x="3" y="3" width="10" height="10" rx="1" fill={isDark ? "#414141" : "#f0eff1"} stroke={isDark ? "#f0eff1" : "#414141"} strokeWidth="0.5" /></svg>
          </button>
          <button className={`p-0.5 ${isDark ? "hover:bg-[#3c3c3c]" : "hover:bg-[#d4d4d4]"}`}>
            <svg width="12" height="12" viewBox="0 0 16 16"><rect x="2" y="5" width="12" height="2" fill="#c9a227" /><rect x="7" y="2" width="2" height="12" fill="#c9a227" /></svg>
          </button>
          <div className="mx-1 h-3 w-px bg-[#3c3c3c]" />
          <button className={`p-0.5 ${isDark ? "hover:bg-[#3c3c3c]" : "hover:bg-[#d4d4d4]"}`}>
            <svg width="12" height="12" viewBox="0 0 16 16"><path d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4z" fill="none" stroke="#22c55e" strokeWidth="1.5" /><path d="M5 8l2 2 4-4" stroke="#22c55e" strokeWidth="1.5" fill="none" /></svg>
          </button>
          <button className={`p-0.5 ${isDark ? "hover:bg-[#3c3c3c]" : "hover:bg-[#d4d4d4]"}`}>
            <svg width="12" height="12" viewBox="0 0 16 16"><path d="M3 3l10 10M13 3L3 13" stroke="#ef4444" strokeWidth="1.5" /></svg>
          </button>
        </div>
        )}

        {/* Tree View - with custom scrollbar */}
        {!isCollapsed && (
        <div
          className={`object-explorer-tree flex-1 overflow-auto ${isDark ? "ssms-scrollbar-dark bg-[#1e1e1e]" : "ssms-scrollbar-light bg-white"}`}
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: isDark ? "#4a4a4a #252526" : "#c0c0c0 #f3f3f3",
          }}
        >
          {renderTree(treeData)}
        </div>
        )}

      </div>
      ) : (
      <button
        type="button"
        aria-label="Show Object Explorer"
        onClick={() => setIsVisible(true)}
        className={`ml-[6px] mt-1 flex h-6 w-4 items-center justify-center ${isDark ? "bg-[#2d2d30] text-[#d0d0d0] hover:bg-[#3a3a3a]" : "bg-[#eeeef2] text-[#666666] hover:bg-[#dddddd]"}`}
      >
        <ChevronRightIcon size={12} />
      </button>
      )}

      {/* Resize Handle */}
      {isVisible && (
      <div
        className={`absolute right-0 top-0 h-full w-1 cursor-ew-resize ${isResizing ? "bg-[#007acc]" : "hover:bg-[#007acc]"}`}
        onMouseDown={handleMouseDown}
      />
      )}

      <style jsx global>{`
        .object-explorer-wrapper {
          background: #2d2d30;
          padding: 0 0 0 6px;
          height: 100%;
          box-sizing: border-box;
        }
        .object-explorer-panel {
          border: 1px solid #3f3f52;
          background: #1e1e1e;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .object-explorer-header {
          height: 21px;
          min-height: 21px;
          max-height: 21px;
          font-size: 12px;
          line-height: 21px;
        }
        .object-explorer-toolbar {
          height: 21px;
          min-height: 21px;
          max-height: 21px;
          gap: 6px;
          line-height: 21px;
        }
        .object-explorer-tree {
          padding: 4px 6px;
        }
        .ssms-scrollbar-dark::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .ssms-scrollbar-dark::-webkit-scrollbar-track {
          background: #252526;
        }
        .ssms-scrollbar-dark::-webkit-scrollbar-thumb {
          background: #4a4a4a;
          border-radius: 0;
        }
        .ssms-scrollbar-dark::-webkit-scrollbar-thumb:hover {
          background: #5a5a5a;
        }
        .ssms-scrollbar-light::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .ssms-scrollbar-light::-webkit-scrollbar-track {
          background: #f3f3f3;
        }
        .ssms-scrollbar-light::-webkit-scrollbar-thumb {
          background: #c0c0c0;
          border-radius: 0;
        }
        .ssms-scrollbar-light::-webkit-scrollbar-thumb:hover {
          background: #a0a0a0;
        }
      `}</style>
    </div>
  )
}
