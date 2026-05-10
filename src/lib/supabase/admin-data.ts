import { supabase } from "./client";

export type AdminProfile = {
  id: number;
  auth_user_id: string;
  full_name: string | null;
  email: string | null;
  profile_picture_url: string | null;
  profile_picture_path: string | null;
};

export type AdminDisplayProfile = {
  full_name: string | null;
  role_title: string | null;
  profile_picture_url: string | null;
};

export async function getCurrentAdminProfile() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!userData.user) throw new Error("No authenticated user found.");

  const { data, error } = await supabase
    .from("admin_profiles")
    .select("*")
    .eq("auth_user_id", userData.user.id)
    .is("deleted_at", null)
    .single();

  if (error) throw error;
  return data as AdminProfile;
}

export async function getDashboardCounts(adminId: number) {
  const [education, experience, projects, certifications, practicePlatforms, skillCategories] = await Promise.all([
    supabase.from("education").select("id").eq("admin_id", adminId).is("deleted_at", null),
    supabase.from("experience").select("id").eq("admin_id", adminId).is("deleted_at", null),
    supabase.from("projects").select("id").eq("admin_id", adminId).is("deleted_at", null),
    supabase.from("certifications").select("id").eq("admin_id", adminId).is("deleted_at", null),
    supabase.from("practice_platforms").select("id").eq("admin_id", adminId).is("deleted_at", null),
    supabase.from("skill_categories").select("id").eq("admin_id", adminId).is("deleted_at", null),
  ]);

  const categoryIds = (skillCategories.data ?? []).map((c) => c.id);
  const skills = categoryIds.length
    ? await supabase.from("skills").select("id").in("category_id", categoryIds).is("deleted_at", null)
    : { data: [] as Array<{ id: number }> };

  const platformIds = (practicePlatforms.data ?? []).map((p) => p.id);
  const challengeRows = platformIds.length
    ? await supabase
        .from("practice_challenges")
        .select("easy_count,medium_count,hard_count")
        .in("platform_id", platformIds)
        .is("deleted_at", null)
    : { data: [] as Array<{ easy_count: number | null; medium_count: number | null; hard_count: number | null }> };

  const solved_problems = (challengeRows.data ?? []).reduce((acc, row) => {
    return acc + Number(row.easy_count ?? 0) + Number(row.medium_count ?? 0) + Number(row.hard_count ?? 0);
  }, 0);

  return {
    education: education.data?.length ?? 0,
    experience: experience.data?.length ?? 0,
    projects: projects.data?.length ?? 0,
    certifications: certifications.data?.length ?? 0,
    practice_platforms: practicePlatforms.data?.length ?? 0,
    skills: skills.data?.length ?? 0,
    solved_problems,
  };
}

function parseMonthValue(value: string | number | null | undefined) {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") {
    if (value >= 1 && value <= 12) return value;
    return null;
  }
  const clean = String(value).trim().toLowerCase();
  if (!clean) return null;
  const numeric = Number(clean);
  if (!Number.isNaN(numeric) && numeric >= 1 && numeric <= 12) return numeric;
  const months = [
    "january","february","march","april","may","june",
    "july","august","september","october","november","december",
  ];
  const idx = months.findIndex((m) => m.startsWith(clean.slice(0, 3)));
  return idx >= 0 ? idx + 1 : null;
}

export async function getExperienceYearsValue(adminId: number) {
  const { data, error } = await supabase
    .from("experience")
    .select("start_month,start_year,end_month,end_year,currently_working")
    .eq("admin_id", adminId)
    .is("deleted_at", null);
  if (error) throw error;

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  let totalMonths = 0;
  for (const row of data ?? []) {
    const startYear = Number(row.start_year);
    const startMonth = parseMonthValue(row.start_month);
    if (!startYear || !startMonth) continue;

    const rawEndYear = row.currently_working ? currentYear : Number(row.end_year);
    const rawEndMonth = row.currently_working ? currentMonth : parseMonthValue(row.end_month);
    const endYear = rawEndYear || currentYear;
    const endMonth = rawEndMonth || currentMonth;

    const months = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
    if (months > 0) totalMonths += months;
  }

  if (totalMonths <= 0) return 0;
  return Number((totalMonths / 12).toFixed(1));
}

export async function getCurrentAdminDisplayProfile() {
  const profile = await getCurrentAdminProfile();

  const { data: about, error } = await supabase
    .from("about")
    .select("full_name, role_title, profile_picture_url")
    .eq("admin_id", profile.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw error;

  const display: AdminDisplayProfile = {
    full_name: about?.full_name || profile.full_name || null,
    role_title: about?.role_title || "Portfolio Owner",
    profile_picture_url: about?.profile_picture_url || profile.profile_picture_url || null,
  };

  return display;
}

export type DashboardActivity = {
  title: string;
  time: string;
  kind: "success" | "live";
  area: "projects" | "experience" | "education" | "certifications";
};

function toRelativeTime(input: string | null | undefined) {
  if (!input) return "just now";
  const date = new Date(input);
  const diff = Math.max(0, Date.now() - date.getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} mins ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export async function getDashboardActivity(adminId: number): Promise<DashboardActivity[]> {
  const [projects, experience, education, certifications, about, resumes, platforms, skills] = await Promise.all([
    supabase
      .from("projects")
      .select("project_title, updated_at, created_at")
      .eq("admin_id", adminId)
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .limit(2),
    supabase
      .from("experience")
      .select("company_name, role, updated_at, created_at")
      .eq("admin_id", adminId)
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .limit(2),
    supabase
      .from("education")
      .select("school_college, degree, updated_at, created_at")
      .eq("admin_id", adminId)
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .limit(2),
    supabase
      .from("certifications")
      .select("certification_title, issuer, updated_at, created_at")
      .eq("admin_id", adminId)
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .limit(2),
    supabase
      .from("about")
      .select("full_name, role_title, updated_at, created_at")
      .eq("admin_id", adminId)
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .limit(1),
    supabase
      .from("resumes")
      .select("title, uploaded_at, updated_at, created_at")
      .eq("admin_id", adminId)
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .limit(2),
    supabase
      .from("practice_platforms")
      .select("platform_name, updated_at, created_at")
      .eq("admin_id", adminId)
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .limit(2),
    supabase
      .from("skill_categories")
      .select("id")
      .eq("admin_id", adminId)
      .is("deleted_at", null),
  ]);

  const items: Array<DashboardActivity & { sortAt: number }> = [];

  (projects.data ?? []).forEach((p) => {
    const ts = p.updated_at || p.created_at;
    items.push({
      title: `Project "${p.project_title || "Untitled"}" updated`,
      time: toRelativeTime(ts),
      kind: "success",
      area: "projects",
      sortAt: ts ? new Date(ts).getTime() : 0,
    });
  });
  (experience.data ?? []).forEach((e) => {
    const ts = e.updated_at || e.created_at;
    items.push({
      title: `${e.company_name || "Experience"} • ${e.role || "Role"} synced`,
      time: toRelativeTime(ts),
      kind: "success",
      area: "experience",
      sortAt: ts ? new Date(ts).getTime() : 0,
    });
  });
  (education.data ?? []).forEach((e) => {
    const ts = e.updated_at || e.created_at;
    items.push({
      title: `${e.school_college || "Education"} • ${e.degree || "Entry"} logged`,
      time: toRelativeTime(ts),
      kind: "live",
      area: "education",
      sortAt: ts ? new Date(ts).getTime() : 0,
    });
  });
  (certifications.data ?? []).forEach((c) => {
    const ts = c.updated_at || c.created_at;
    items.push({
      title: `${c.certification_title || "Certification"} (${c.issuer || "Issuer"}) verified`,
      time: toRelativeTime(ts),
      kind: "success",
      area: "certifications",
      sortAt: ts ? new Date(ts).getTime() : 0,
    });
  });

  (about.data ?? []).forEach((a) => {
    const ts = a.updated_at || a.created_at;
    items.push({
      title: `Profile updated${a.full_name ? ` • ${a.full_name}` : ""}`,
      time: toRelativeTime(ts),
      kind: "success",
      area: "experience",
      sortAt: ts ? new Date(ts).getTime() : 0,
    });
  });

  (resumes.data ?? []).forEach((r) => {
    const ts = r.updated_at || r.uploaded_at || r.created_at;
    items.push({
      title: `Resume "${r.title || "Untitled"}" uploaded`,
      time: toRelativeTime(ts),
      kind: "success",
      area: "certifications",
      sortAt: ts ? new Date(ts).getTime() : 0,
    });
  });

  (platforms.data ?? []).forEach((p) => {
    const ts = p.updated_at || p.created_at;
    items.push({
      title: `Practice platform "${p.platform_name || "Platform"}" synced`,
      time: toRelativeTime(ts),
      kind: "live",
      area: "education",
      sortAt: ts ? new Date(ts).getTime() : 0,
    });
  });

  const categoryIds = (skills.data ?? []).map((c) => c.id);
  if (categoryIds.length > 0) {
    const { data: skillRows } = await supabase
      .from("skills")
      .select("skill_name, updated_at, created_at")
      .in("category_id", categoryIds)
      .is("deleted_at", null)
      .order("updated_at", { ascending: false })
      .limit(3);
    (skillRows ?? []).forEach((s) => {
      const ts = s.updated_at || s.created_at;
      items.push({
        title: `Skill "${s.skill_name || "Skill"}" updated`,
        time: toRelativeTime(ts),
        kind: "live",
        area: "projects",
        sortAt: ts ? new Date(ts).getTime() : 0,
      });
    });
  }

  return items
    .sort((a, b) => b.sortAt - a.sortAt)
    .slice(0, 4)
    .map(({ sortAt: _sortAt, ...rest }) => rest);
}
