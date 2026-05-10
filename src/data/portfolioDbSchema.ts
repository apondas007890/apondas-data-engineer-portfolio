export type ExplorerNodeType =
  | "server"
  | "databaseFolder"
  | "database"
  | "folder"
  | "table"
  | "view"
  | "procedure"
  | "function"
  | "trigger"
  | "column"
  | "key"
  | "constraint"
  | "index"

export type KeyType = "PK" | "FK"

export interface PortfolioSchemaNode {
  id: string
  label: string
  type: ExplorerNodeType
  dataType?: string
  keyType?: KeyType
  nullable?: boolean
  query?: string
  children?: PortfolioSchemaNode[]
}

interface ColumnDef {
  name: string
  dataType: string
  keyType?: KeyType
  nullable?: boolean
}

const makeColumns = (tableId: string, cols: ColumnDef[]): PortfolioSchemaNode => ({
  id: `${tableId}-columns`,
  label: "Columns",
  type: "folder",
  children: cols.map((col) => ({
    id: `${tableId}-col-${col.name}`,
    label: col.name,
    type: "column",
    dataType: col.dataType,
    keyType: col.keyType,
    nullable: col.nullable ?? (col.keyType ? false : true),
  })),
})

const makeTable = (name: string, cols: ColumnDef[]): PortfolioSchemaNode => ({
  id: `table-${name}`,
  label: name,
  type: "table",
  query: `SELECT TOP (1000) *\nFROM ${name};`,
  children: [
    makeColumns(`table-${name}`, cols),
    { id: `table-${name}-keys`, label: "Keys", type: "folder" },
    { id: `table-${name}-constraints`, label: "Constraints", type: "folder" },
    { id: `table-${name}-triggers`, label: "Triggers", type: "folder" },
    { id: `table-${name}-indexes`, label: "Indexes", type: "folder" },
  ],
})

const tables: PortfolioSchemaNode[] = [
  makeTable("dbo.admin_profiles", [
    { name: "id", dataType: "uuid", keyType: "PK" },
    { name: "auth_user_id", dataType: "uuid", keyType: "FK" },
    { name: "full_name", dataType: "text" },
    { name: "email", dataType: "text" },
    { name: "dob", dataType: "date" },
    { name: "phone_number", dataType: "text" },
    { name: "recovery_email", dataType: "text" },
    { name: "profile_picture_url", dataType: "text" },
    { name: "profile_picture_path", dataType: "text" },
    { name: "created_at", dataType: "timestamptz" },
    { name: "updated_at", dataType: "timestamptz" },
    { name: "deleted_at", dataType: "timestamptz" },
  ]),
  makeTable("dbo.about", [
    { name: "id", dataType: "uuid", keyType: "PK" },
    { name: "admin_id", dataType: "uuid", keyType: "FK" },
    { name: "full_name", dataType: "text" },
    { name: "role_title", dataType: "text" },
    { name: "email", dataType: "text" },
    { name: "phone_number", dataType: "text" },
    { name: "whatsapp_number", dataType: "text" },
    { name: "dob", dataType: "date" },
    { name: "linkedin_url", dataType: "text" },
    { name: "github_url", dataType: "text" },
    { name: "location", dataType: "text" },
    { name: "bio_html", dataType: "text" },
    { name: "profile_picture_url", dataType: "text" },
    { name: "profile_picture_path", dataType: "text" },
    { name: "created_at", dataType: "timestamptz" },
    { name: "updated_at", dataType: "timestamptz" },
    { name: "deleted_at", dataType: "timestamptz" },
  ]),
  makeTable("dbo.education", [
    { name: "id", dataType: "uuid", keyType: "PK" },
    { name: "admin_id", dataType: "uuid", keyType: "FK" },
    { name: "school_college", dataType: "text" },
    { name: "institution_website_url", dataType: "text" },
    { name: "degree", dataType: "text" },
    { name: "department", dataType: "text" },
    { name: "currently_studying", dataType: "bool" },
    { name: "start_month", dataType: "text" },
    { name: "start_year", dataType: "int4" },
    { name: "end_month", dataType: "text" },
    { name: "end_year", dataType: "int4" },
    { name: "score_type", dataType: "text" },
    { name: "score_value", dataType: "text" },
    { name: "description_html", dataType: "text" },
    { name: "sort_order", dataType: "int4" },
    { name: "created_at", dataType: "timestamptz" },
    { name: "updated_at", dataType: "timestamptz" },
    { name: "deleted_at", dataType: "timestamptz" },
  ]),
  makeTable("dbo.education_media", [
    { name: "id", dataType: "uuid", keyType: "PK" },
    { name: "education_id", dataType: "uuid", keyType: "FK" },
    { name: "file_url", dataType: "text" },
    { name: "file_path", dataType: "text" },
    { name: "file_name", dataType: "text" },
    { name: "file_size", dataType: "int8" },
    { name: "mime_type", dataType: "text" },
    { name: "file_type", dataType: "text" },
    { name: "sort_order", dataType: "int4" },
    { name: "created_at", dataType: "timestamptz" },
  ]),
  makeTable("dbo.experience", [
    { name: "id", dataType: "uuid", keyType: "PK" },
    { name: "admin_id", dataType: "uuid", keyType: "FK" },
    { name: "company_name", dataType: "text" },
    { name: "company_website_url", dataType: "text" },
    { name: "company_icon_key", dataType: "text" },
    { name: "company_logo_url", dataType: "text" },
    { name: "company_logo_path", dataType: "text" },
    { name: "role", dataType: "text" },
    { name: "location", dataType: "text" },
    { name: "currently_working", dataType: "bool" },
    { name: "start_month", dataType: "text" },
    { name: "start_year", dataType: "int4" },
    { name: "end_month", dataType: "text" },
    { name: "end_year", dataType: "int4" },
    { name: "description_html", dataType: "text" },
    { name: "sort_order", dataType: "int4" },
    { name: "created_at", dataType: "timestamptz" },
    { name: "updated_at", dataType: "timestamptz" },
    { name: "deleted_at", dataType: "timestamptz" },
  ]),
  makeTable("dbo.experience_media", [
    { name: "id", dataType: "uuid", keyType: "PK" },
    { name: "experience_id", dataType: "uuid", keyType: "FK" },
    { name: "file_url", dataType: "text" },
    { name: "file_path", dataType: "text" },
    { name: "file_name", dataType: "text" },
    { name: "file_size", dataType: "int8" },
    { name: "mime_type", dataType: "text" },
    { name: "file_type", dataType: "text" },
    { name: "sort_order", dataType: "int4" },
    { name: "created_at", dataType: "timestamptz" },
  ]),
  makeTable("dbo.resumes", [
    { name: "id", dataType: "uuid", keyType: "PK" },
    { name: "admin_id", dataType: "uuid", keyType: "FK" },
    { name: "title", dataType: "text" },
    { name: "file_url", dataType: "text" },
    { name: "file_path", dataType: "text" },
    { name: "file_name", dataType: "text" },
    { name: "file_size", dataType: "int8" },
    { name: "mime_type", dataType: "text" },
    { name: "uploaded_at", dataType: "timestamptz" },
    { name: "is_active", dataType: "bool" },
    { name: "created_at", dataType: "timestamptz" },
    { name: "updated_at", dataType: "timestamptz" },
    { name: "deleted_at", dataType: "timestamptz" },
  ]),
  makeTable("dbo.certifications", [
    { name: "id", dataType: "uuid", keyType: "PK" },
    { name: "admin_id", dataType: "uuid", keyType: "FK" },
    { name: "certification_title", dataType: "text" },
    { name: "issuer", dataType: "text" },
    { name: "issuer_icon_key", dataType: "text" },
    { name: "issuer_logo_url", dataType: "text" },
    { name: "issuer_logo_path", dataType: "text" },
    { name: "issued_date", dataType: "date" },
    { name: "description", dataType: "text" },
    { name: "verification_url", dataType: "text" },
    { name: "certificate_pdf_url", dataType: "text" },
    { name: "certificate_pdf_path", dataType: "text" },
    { name: "certificate_file_name", dataType: "text" },
    { name: "certificate_file_size", dataType: "int8" },
    { name: "certificate_mime_type", dataType: "text" },
    { name: "sort_order", dataType: "int4" },
    { name: "created_at", dataType: "timestamptz" },
    { name: "updated_at", dataType: "timestamptz" },
    { name: "deleted_at", dataType: "timestamptz" },
  ]),
  makeTable("dbo.practice_platforms", [
    { name: "id", dataType: "uuid", keyType: "PK" },
    { name: "admin_id", dataType: "uuid", keyType: "FK" },
    { name: "platform_name", dataType: "text" },
    { name: "platform_icon_key", dataType: "text" },
    { name: "platform_logo_url", dataType: "text" },
    { name: "platform_logo_path", dataType: "text" },
    { name: "sort_order", dataType: "int4" },
    { name: "created_at", dataType: "timestamptz" },
    { name: "updated_at", dataType: "timestamptz" },
    { name: "deleted_at", dataType: "timestamptz" },
  ]),
  makeTable("dbo.practice_challenges", [
    { name: "id", dataType: "uuid", keyType: "PK" },
    { name: "platform_id", dataType: "uuid", keyType: "FK" },
    { name: "challenge_title", dataType: "text" },
    { name: "verification_url", dataType: "text" },
    { name: "easy_count", dataType: "int4" },
    { name: "medium_count", dataType: "int4" },
    { name: "hard_count", dataType: "int4" },
    { name: "created_at", dataType: "timestamptz" },
    { name: "updated_at", dataType: "timestamptz" },
    { name: "deleted_at", dataType: "timestamptz" },
  ]),
  makeTable("dbo.projects", [
    { name: "id", dataType: "uuid", keyType: "PK" },
    { name: "admin_id", dataType: "uuid", keyType: "FK" },
    { name: "project_title", dataType: "text" },
    { name: "description_html", dataType: "text" },
    { name: "github_url", dataType: "text" },
    { name: "live_url", dataType: "text" },
    { name: "is_featured", dataType: "bool" },
    { name: "sort_order", dataType: "int4" },
    { name: "created_at", dataType: "timestamptz" },
    { name: "updated_at", dataType: "timestamptz" },
    { name: "deleted_at", dataType: "timestamptz" },
  ]),
  makeTable("dbo.project_images", [
    { name: "id", dataType: "uuid", keyType: "PK" },
    { name: "project_id", dataType: "uuid", keyType: "FK" },
    { name: "image_url", dataType: "text" },
    { name: "image_path", dataType: "text" },
    { name: "file_name", dataType: "text" },
    { name: "file_size", dataType: "int8" },
    { name: "mime_type", dataType: "text" },
    { name: "sort_order", dataType: "int4" },
    { name: "created_at", dataType: "timestamptz" },
  ]),
  makeTable("dbo.project_tags", [
    { name: "id", dataType: "uuid", keyType: "PK" },
    { name: "project_id", dataType: "uuid", keyType: "FK" },
    { name: "tag_name", dataType: "text" },
    { name: "created_at", dataType: "timestamptz" },
  ]),
  makeTable("dbo.skill_categories", [
    { name: "id", dataType: "uuid", keyType: "PK" },
    { name: "admin_id", dataType: "uuid", keyType: "FK" },
    { name: "category_name", dataType: "text" },
    { name: "sort_order", dataType: "int4" },
    { name: "created_at", dataType: "timestamptz" },
    { name: "updated_at", dataType: "timestamptz" },
    { name: "deleted_at", dataType: "timestamptz" },
  ]),
  makeTable("dbo.skills", [
    { name: "id", dataType: "uuid", keyType: "PK" },
    { name: "category_id", dataType: "uuid", keyType: "FK" },
    { name: "skill_name", dataType: "text" },
    { name: "skill_icon_key", dataType: "text" },
    { name: "skill_logo_url", dataType: "text" },
    { name: "skill_logo_path", dataType: "text" },
    { name: "proficiency_level", dataType: "text" },
    { name: "sort_order", dataType: "int4" },
    { name: "created_at", dataType: "timestamptz" },
    { name: "updated_at", dataType: "timestamptz" },
    { name: "deleted_at", dataType: "timestamptz" },
  ]),
]

const views = [
  "dbo.vw_about_profile",
  "dbo.vw_education",
  "dbo.vw_experience",
  "dbo.vw_certifications",
  "dbo.vw_projects_with_tags",
  "dbo.vw_skills_grouped",
  "dbo.vw_practice_summary",
].map<PortfolioSchemaNode>((name) => ({
  id: `view-${name}`,
  label: name,
  type: "view",
  query: `SELECT *\nFROM ${name};`,
}))

const procedures = [
  "dbo.sp_GetPortfolioOverview",
  "dbo.sp_GetProjectsWithTags",
  "dbo.sp_GetSkillsGrouped",
  "dbo.sp_GetPracticeSummary",
].map<PortfolioSchemaNode>((name) => ({
  id: `proc-${name}`,
  label: name,
  type: "procedure",
  query: `EXEC ${name};`,
}))

const functions = ["dbo.fn_TotalSolved", "dbo.fn_FormatDate"].map<PortfolioSchemaNode>((name) => ({
  id: `fn-${name}`,
  label: name,
  type: "function",
  query: `SELECT ${name}();`,
}))

const triggers = [
  "trg_about_updated_at",
  "trg_education_updated_at",
  "trg_experience_updated_at",
  "trg_projects_updated_at",
  "trg_skills_updated_at",
].map<PortfolioSchemaNode>((name) => ({
  id: `trg-${name}`,
  label: name,
  type: "trigger",
}))

export const portfolioDatabaseChildren: PortfolioSchemaNode[] = [
  { id: "portfolio-diagrams", label: "Database Diagrams", type: "folder" },
  {
    id: "portfolio-tables",
    label: "Tables",
    type: "folder",
    children: tables,
  },
  {
    id: "portfolio-views",
    label: "Views",
    type: "folder",
    children: views,
  },
  { id: "portfolio-synonyms", label: "Synonyms", type: "folder" },
  {
    id: "portfolio-programmability",
    label: "Programmability",
    type: "folder",
    children: [
      { id: "portfolio-procs", label: "Stored Procedures", type: "folder", children: procedures },
      { id: "portfolio-functions", label: "Functions", type: "folder", children: functions },
      { id: "portfolio-db-triggers", label: "Database Triggers", type: "folder", children: triggers },
      { id: "portfolio-types", label: "Types", type: "folder" },
    ],
  },
  {
    id: "portfolio-security",
    label: "Security",
    type: "folder",
    children: [
      { id: "portfolio-users", label: "Users", type: "folder" },
      { id: "portfolio-roles", label: "Roles", type: "folder" },
      { id: "portfolio-schemas", label: "Schemas", type: "folder" },
    ],
  },
]
