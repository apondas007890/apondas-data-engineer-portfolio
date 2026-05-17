"use client"

import { useState, useCallback, createContext, useContext, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Topbar } from "@/components/sql-ide/topbar"
import { Sidebar } from "@/components/sql-ide/sidebar"
import { EditorTabs } from "@/components/sql-ide/editor-tabs"
import { Editor } from "@/components/sql-ide/editor"
import { ResultsPanel } from "@/components/sql-ide/results-panel"
import { StatusBar } from "@/components/sql-ide/status-bar"
import { SplashScreen } from "@/components/sql-ide/splash-screen"
import { ConnectDialog } from "@/components/sql-ide/connect-dialog"
import { supabase } from "@/src/lib/supabase/client"
import { normalizeRichTextHtml } from "@/src/lib/rich-text"

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
  const router = useRouter()
  useEffect(() => {
    document.title = "SQL Shades | SSMS Portfolio"
  }, [])
  const starterQueryTemplate = `SELECT * FROM Portfolio.about  -- Shows personal/about information
SELECT * FORM Portfolio.skills -- Shows technical skills
SELECT * FROM Portfolio.projects -- Shows portfolio projects
SELECT * FROM Portfolio.experiences -- Shows internship/work experience
SELECT * FROM Portfolio.educations  -- Shows education history
SELECT * FROM Portfolio.Certifications -- Shows certificates and achievements`
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
  const [tabShowResults, setTabShowResults] = useState<Record<string, boolean>>({})
  const [tabResultData, setTabResultData] = useState<Record<string, Record<string, string | number>[] | null>>({})
  const [sidebarWidth, setSidebarWidth] = useState(280)
  const [selectedNode, setSelectedNode] = useState<string | null>("server")
  const [tabRowCounts, setTabRowCounts] = useState<Record<string, number>>({})
  const [editorZoom, setEditorZoom] = useState(125)
  const [cursor, setCursor] = useState<CursorPosition>({ line: 1, col: 1, ch: 1 })
  const [currentDatabase, setCurrentDatabase] = useState("Portfolio")
  const [isConnected, setIsConnected] = useState(false)

  const activeTab = tabs.find((tab) => tab.id === activeTabId)
  const showResults = tabShowResults[activeTabId] ?? false
  const resultData = tabResultData[activeTabId] ?? null
  const rowCount = tabRowCounts[activeTabId] ?? 0

  const setActiveTabResult = useCallback(
    (data: Record<string, string | number>[] | null, count: number, visible: boolean) => {
      setTabResultData((prev) => ({ ...prev, [activeTabId]: data }))
      setTabRowCounts((prev) => ({ ...prev, [activeTabId]: count }))
      setTabShowResults((prev) => ({ ...prev, [activeTabId]: visible }))
    },
    [activeTabId]
  )

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

  const handleExecute = useCallback(async () => {
    const rawSql = (activeTab?.content || "").trim()
    const normalizedSql = rawSql.replace(/\s+/g, " ").trim()

    try {
      const toRichHtml = (htmlLike: unknown): string => {
        const raw = typeof htmlLike === "string" ? htmlLike : ""
        if (!raw.trim()) return "NULL"
        return normalizeRichTextHtml(raw)
      }

      if (!normalizedSql) {
        setIsExecuting(false)
        setActiveTabResult(null, 0, false)
        return
      }
      setIsExecuting(true)
      setTabShowResults((prev) => ({ ...prev, [activeTabId]: true }))

      const correctedSql = normalizedSql.replace(/\bform\b/gi, "FROM")
      const sqlWithoutTrailingSemicolon = correctedSql.replace(/;\s*$/, "")
      const statements = sqlWithoutTrailingSemicolon
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean)

      const selectCount = (sqlWithoutTrailingSemicolon.match(/\bselect\b/gi) || []).length
      if (statements.length > 1 || selectCount > 1) {
        setActiveTabResult([
          {
            Message: "Msg 102, Level 15, State 1, Line 1",
            Detail: "Only one query is allowed per execution in this SQL editor.",
            Hint: "Run one SELECT statement at a time in a single query file.",
          },
        ], 0, true)
        return
      }

      const singleQuery = statements[0] || sqlWithoutTrailingSemicolon
      const fromMatch = singleQuery.match(/\bfrom\s+([a-zA-Z0-9_.\[\]]+)/i)
      const typedObject = fromMatch?.[1]?.replace(/[\[\]]/g, "") ?? ""
      const normalizedObjectRaw = typedObject.toLowerCase()
      const normalizedObject =
        normalizedObjectRaw === "portfolio.eductaion" ||
        normalizedObjectRaw === "dbo.eductaion" ||
        normalizedObjectRaw === "eductaion" ||
        normalizedObjectRaw === "portfolio.dbo.eductaion"
          ? normalizedObjectRaw.replace("eductaion", "education")
          : normalizedObjectRaw
      const isAboutQuery = /^(portfolio\.)?(dbo\.)?about$/.test(normalizedObject)
      const isEducationQuery = /^(portfolio\.)?(dbo\.)?educations$/.test(normalizedObject)
      const isExperiencesQuery = /^(portfolio\.)?(dbo\.)?experiences$/.test(normalizedObject)
      const isProjectsQuery = /^(portfolio\.)?(dbo\.)?projects$/.test(normalizedObject)
      const isCertificationsQuery = /^(portfolio\.)?(dbo\.)?certifications$/.test(normalizedObject)
      const isSkillsQuery = /^(portfolio\.)?(dbo\.)?skills$/.test(normalizedObject)

      const isSelectAll = /^\s*select\s+\*\s+from\s+/i.test(singleQuery)

      if (!isSelectAll || (!isAboutQuery && !isEducationQuery && !isExperiencesQuery && !isProjectsQuery && !isCertificationsQuery && !isSkillsQuery)) {
        const invalidName = typedObject || "object"
        const unsupported = [
          {
            Message: "Msg 208, Level 16, State 1, Line 1",
            Detail: `Invalid object name '${invalidName}'.`,
          },
        ]
        setActiveTabResult(unsupported, 0, true)
        return
      }

      if (isAboutQuery) {
        const { data, error } = await supabase
          .from("about")
          .select("profile_picture_url,full_name,dob,role_title,bio_html,email,phone_number,whatsapp_number,location,linkedin_url,github_url,deleted_at")
          .is("deleted_at", null)
          .order("updated_at", { ascending: false })

        if (error) {
          setActiveTabResult([{ Error: error.message }], 1, true)
          return
        }

        const rows = (data || []).map((row) => ({
          image: row.profile_picture_url ?? "",
          name: row.full_name ?? "",
          dob: row.dob ?? "",
          role: row.role_title ?? "",
          bio: toRichHtml(row.bio_html),
          email: row.email ?? "",
          phone_number: row.phone_number ?? "",
          whatsapp_number: row.whatsapp_number ?? "",
          address: row.location ?? "",
          linkedin: row.linkedin_url ?? "",
          github: row.github_url ?? "",
        }))

        setActiveTabResult(rows, rows.length, true)
        return
      }

      if (isProjectsQuery) {
        const { data, error } = await supabase
          .from("projects")
          .select("id,project_title,description_html,github_url,live_url,deleted_at")
          .is("deleted_at", null)
          .order("created_at", { ascending: false })
          .order("updated_at", { ascending: false })

        if (error) {
          setActiveTabResult([{ Error: error.message }], 1, true)
          return
        }

        const projectRows = data || []
        const projectIds = projectRows.map((r) => r.id).filter(Boolean)

        let imagesByProjectId: Record<string, string[]> = {}
        let tagsByProjectId: Record<string, string[]> = {}

        if (projectIds.length > 0) {
          const { data: projectImages } = await supabase
            .from("project_images")
            .select("project_id,image_url")
            .in("project_id", projectIds)
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: true })

          imagesByProjectId = (projectImages || []).reduce<Record<string, string[]>>((acc, item) => {
            if (!item.project_id || !item.image_url) return acc
            if (!acc[item.project_id]) acc[item.project_id] = []
            acc[item.project_id].push(item.image_url)
            return acc
          }, {})

          const { data: projectTags } = await supabase
            .from("project_tags")
            .select("project_id,tag_name")
            .in("project_id", projectIds)
            .order("created_at", { ascending: true })

          tagsByProjectId = (projectTags || []).reduce<Record<string, string[]>>((acc, item) => {
            if (!item.project_id || !item.tag_name) return acc
            if (!acc[item.project_id]) acc[item.project_id] = []
            acc[item.project_id].push(item.tag_name)
            return acc
          }, {})
        }

        const projectResults = projectRows.map((row, idx) => {
          const liveUrl = typeof row.live_url === "string" ? row.live_url.trim() : ""
          return {
          id: idx + 1,
          image: (imagesByProjectId[row.id] || []).join("||"),
          project_title: row.project_title ?? "",
          tech_stack: (tagsByProjectId[row.id] || []).join(", "),
          description: toRichHtml(row.description_html),
          github_url: row.github_url ?? "",
          live_url: liveUrl.length > 0 ? liveUrl : "NULL",
          }
        })

        setActiveTabResult(projectResults, projectResults.length, true)
        return
      }

      if (isCertificationsQuery) {
        const { data, error } = await supabase
          .from("certifications")
          .select("id,certification_title,issuer,issued_date,description,verification_url,certificate_pdf_url,deleted_at,created_at,updated_at")
          .is("deleted_at", null)
          .order("created_at", { ascending: false })
          .order("updated_at", { ascending: false })

        if (error) {
          setActiveTabResult([{ Error: error.message }], 1, true)
          return
        }

        const rows = (data || []).map((row, index) => ({
          no: index + 1,
          certification_title: row.certification_title ?? "",
          issuer: row.issuer ?? "",
          issued_date: row.issued_date ?? "NULL",
          description: toRichHtml(row.description),
          verification_url: (row.verification_url ?? "").trim() || "NULL",
          certicifate: (row.certificate_pdf_url ?? "").trim() || "NULL",
        }))

        setActiveTabResult(rows, rows.length, true)
        return
      }

      if (isSkillsQuery) {
        const { data: skillsData, error: skillsError } = await supabase
          .from("skills")
          .select("id,category_id,skill_name,sort_order,created_at,deleted_at")
          .is("deleted_at", null)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true })

        if (skillsError) {
          setActiveTabResult([{ Error: skillsError.message }], 1, true)
          return
        }

        const categoryIds = Array.from(new Set((skillsData || []).map((row) => row.category_id).filter(Boolean)))
        let categoryNameById: Record<string, string> = {}
        let categoryOrderById: Record<string, number> = {}
        let categoryCreatedAtById: Record<string, string> = {}

        if (categoryIds.length > 0) {
          const { data: categoriesData } = await supabase
            .from("skill_categories")
            .select("id,category_name,sort_order,created_at")
            .in("id", categoryIds)

          categoryNameById = (categoriesData || []).reduce<Record<string, string>>((acc, row) => {
            if (!row.id) return acc
            acc[row.id] = row.category_name ?? ""
            return acc
          }, {})

          categoryOrderById = (categoriesData || []).reduce<Record<string, number>>((acc, row) => {
            if (!row.id) return acc
            acc[row.id] = Number(row.sort_order ?? Number.MAX_SAFE_INTEGER)
            return acc
          }, {})

          categoryCreatedAtById = (categoriesData || []).reduce<Record<string, string>>((acc, row) => {
            if (!row.id) return acc
            acc[row.id] = row.created_at ?? ""
            return acc
          }, {})
        }

        const groupedByCategory = (skillsData || []).reduce<
          Record<string, { names: string[]; firstCreatedAt: string }>
        >((acc, row) => {
          const categoryId = row.category_id || "unknown"
          if (!acc[categoryId]) {
            acc[categoryId] = {
              names: [],
              firstCreatedAt: row.created_at ?? "",
            }
          }
          if (row.skill_name) {
            acc[categoryId].names.push(row.skill_name)
          }
          return acc
        }, {})

        const orderedCategoryIds = Object.keys(groupedByCategory).sort((a, b) => {
          const sortA = categoryOrderById[a] ?? Number.MAX_SAFE_INTEGER
          const sortB = categoryOrderById[b] ?? Number.MAX_SAFE_INTEGER
          if (sortA !== sortB) return sortA - sortB

          const createdA = categoryCreatedAtById[a] || groupedByCategory[a]?.firstCreatedAt || ""
          const createdB = categoryCreatedAtById[b] || groupedByCategory[b]?.firstCreatedAt || ""
          if (createdA && createdB && createdA !== createdB) return createdA.localeCompare(createdB)

          return (categoryNameById[a] ?? "").localeCompare(categoryNameById[b] ?? "")
        })

        const rows = orderedCategoryIds.map((categoryId, index) => ({
          id: index + 1,
          category: categoryNameById[categoryId] ?? "",
          skills: groupedByCategory[categoryId].names.join(", "),
        }))

        setActiveTabResult(rows, rows.length, true)
        return
      }

      if (isExperiencesQuery) {
        const { data: expData, error: expError } = await supabase
          .from("experience")
          .select("id,company_name,company_website_url,location,role,description_html,start_month,start_year,end_month,end_year,sort_order,created_at,deleted_at")
          .is("deleted_at", null)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true })

        if (expError) {
          setActiveTabResult([{ Error: expError.message }], 1, true)
          return
        }

        const experienceRows = expData || []
        const experienceIds = experienceRows.map((r) => r.id).filter(Boolean)

        let mediaByExperienceId: Record<string, string[]> = {}
        if (experienceIds.length > 0) {
          const { data: mediaData } = await supabase
            .from("experience_media")
            .select("experience_id,file_url")
            .in("experience_id", experienceIds)
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: true })

          mediaByExperienceId = (mediaData || []).reduce<Record<string, string[]>>((acc, m) => {
            if (!m.experience_id || !m.file_url) return acc
            if (!acc[m.experience_id]) acc[m.experience_id] = []
            acc[m.experience_id].push(m.file_url)
            return acc
          }, {})
        }

        const monthRank: Record<string, number> = {
          january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
          july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
        }

        const rows = experienceRows.map((row) => {
          const startDate = [row.start_month, row.start_year].filter(Boolean).join(", ")
          const endDate = [row.end_month, row.end_year].filter(Boolean).join(", ")
          const endYearNum = Number(row.end_year ?? 0)
          const endMonthNum = monthRank[String(row.end_month ?? "").toLowerCase()] ?? 0
          const endSortKey = endYearNum * 100 + endMonthNum

          return {
            __endSortKey: endSortKey,
            image: (mediaByExperienceId[row.id] || []).join("||"),
            company_name: row.company_name ?? "",
            company_website: row.company_website_url ?? "",
            location: row.location ?? "",
            role: row.role ?? "",
            description: toRichHtml(row.description_html),
            start_date: startDate || "NULL",
            end_date: endDate || "NULL",
          }
        })

        const sortedRows = rows
          .sort((a, b) => b.__endSortKey - a.__endSortKey)
          .map((row, index) => ({
            id: index + 1,
            image: row.image,
            company_name: row.company_name,
            company_website: row.company_website,
            location: row.location,
            role: row.role,
            description: row.description,
            start_date: row.start_date,
            end_date: row.end_date,
          }))

        setActiveTabResult(sortedRows, sortedRows.length, true)
        return
      }

      const { data, error } = await supabase
        .from("education")
        .select("id,school_college,institution_website_url,degree,score_type,score_value,start_month,start_year,end_month,end_year,description_html,deleted_at")
        .is("deleted_at", null)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true })

      if (error) {
        setActiveTabResult([{ Error: error.message }], 1, true)
        return
      }

      const educationRows = data || []
      const educationIds = educationRows.map((r) => r.id).filter(Boolean)

      let mediaByEducationId: Record<string, string[]> = {}
      if (educationIds.length > 0) {
        const { data: mediaData } = await supabase
          .from("education_media")
          .select("education_id,file_url")
          .in("education_id", educationIds)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true })

        mediaByEducationId = (mediaData || []).reduce<Record<string, string[]>>((acc, m) => {
          if (!m.education_id || !m.file_url) return acc
          if (!acc[m.education_id]) acc[m.education_id] = []
          acc[m.education_id].push(m.file_url)
          return acc
        }, {})
      }

      const formattedEducation = educationRows.map((row, index) => {
        const images = mediaByEducationId[row.id] || []
        const start = [row.start_month, row.start_year].filter(Boolean).join(", ")
        const end = [row.end_month, row.end_year].filter(Boolean).join(", ")
        const descriptionText = toRichHtml(row.description_html)

        const monthRank: Record<string, number> = {
          january: 1, february: 2, march: 3, april: 4, may: 5, june: 6,
          july: 7, august: 8, september: 9, october: 10, november: 11, december: 12,
        }
        const endYearNum = Number(row.end_year ?? 0)
        const endMonthNum = monthRank[String(row.end_month ?? "").toLowerCase()] ?? 0
        const endSortKey = endYearNum * 100 + endMonthNum

        return {
          __endSortKey: endSortKey,
          image: images.join("||"),
          degree: row.degree ?? "",
          institute_name: row.school_college ?? "",
          institute_link: row.institution_website_url ?? "",
          result: [row.score_type, row.score_value].filter(Boolean).join(": "),
          starting: start,
          ending: end,
          description: descriptionText,
        }
      })
      const sortedEducation = formattedEducation
        .sort((a, b) => b.__endSortKey - a.__endSortKey)
        .map((row, idx) => ({
          id: idx + 1,
          image: row.image,
          degree: row.degree,
          institute_name: row.institute_name,
          institute_link: row.institute_link,
          result: row.result,
          starting: row.starting,
          ending: row.ending,
          description: row.description,
        }))

      setActiveTabResult(sortedEducation, sortedEducation.length, true)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown execution error"
      setActiveTabResult([{ Error: msg }], 1, true)
    } finally {
      setIsExecuting(false)
    }
  }, [activeTab?.content, activeTabId, setActiveTabResult])

  const handleSidebarSelect = useCallback((nodeId: string | null, _query?: string) => {
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

  const handleOptionsRedirect = useCallback(() => {
    router.push("/admin")
  }, [router])

  const handleVisualPortfolioRedirect = useCallback(() => {
    window.location.href = "/visualportfolio/home"
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
          onConnect={() => {
            setIsConnected(true)
            setShowConnectDialog(false)
          }}
          onCancel={() => {}}
          onHelp={() => {}}
          onOptions={handleOptionsRedirect}
          onVisualPortfolio={handleVisualPortfolioRedirect}
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
                  showPlaceholder={activeTabId === "1" && isConnected}
                  placeholderText={starterQueryTemplate}
                />
                {showResults && (
                  <ResultsPanel
                    data={resultData}
                    isLoading={isExecuting}
                    onClose={() =>
                      setTabShowResults((prev) => ({ ...prev, [activeTabId]: false }))
                    }
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

