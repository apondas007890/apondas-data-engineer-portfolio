import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type ExperienceRow = {
  id: string;
  company_name: string | null;
  company_website_url: string | null;
  role: string | null;
  location: string | null;
  start_month: string | null;
  start_year: number | null;
  end_month: string | null;
  end_year: number | null;
  currently_working: boolean | null;
  description_html: string | null;
  sort_order: number | null;
  created_at: string | null;
};

type ExperienceMediaRow = {
  id: string;
  experience_id: string;
  file_url: string | null;
  sort_order: number | null;
  created_at: string | null;
};

const MONTH_INDEX: Record<string, number> = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

const toTitleMonth = (value: string | null) => {
  if (!value) return "";
  const raw = value.trim();
  if (!raw) return "";
  return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
};

const monthToNumber = (value: string | null) => {
  if (!value) return -1;
  return MONTH_INDEX[value.trim().toLowerCase()] ?? -1;
};

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Supabase configuration is missing." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: experiences, error: expError } = await supabase
      .from("experience")
      .select(
        "id, company_name, company_website_url, role, location, start_month, start_year, end_month, end_year, currently_working, description_html, sort_order, created_at"
      )
      .is("deleted_at", null)
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true });

    if (expError) {
      return NextResponse.json({ error: expError.message }, { status: 500 });
    }

    const expRows = (experiences ?? []) as ExperienceRow[];
    const experienceIds = expRows.map((item) => item.id);

    let mediaRows: ExperienceMediaRow[] = [];
    if (experienceIds.length > 0) {
      const { data: media, error: mediaError } = await supabase
        .from("experience_media")
        .select("id, experience_id, file_url, sort_order, created_at")
        .in("experience_id", experienceIds)
        .order("sort_order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: true });

      if (mediaError) {
        return NextResponse.json({ error: mediaError.message }, { status: 500 });
      }

      mediaRows = (media ?? []) as ExperienceMediaRow[];
    }

    const mapped = [...expRows]
      .sort((a, b) => {
        const ay = a.end_year ?? Number.MAX_SAFE_INTEGER;
        const by = b.end_year ?? Number.MAX_SAFE_INTEGER;
        if (ay !== by) return by - ay;
        const am = monthToNumber(a.end_month);
        const bm = monthToNumber(b.end_month);
        if (am !== bm) return bm - am;
        return (b.created_at || "").localeCompare(a.created_at || "");
      })
      .map((row) => {
        const startMonth = toTitleMonth(row.start_month);
        const endMonth = row.currently_working ? "Present" : toTitleMonth(row.end_month);
        const start = [startMonth, row.start_year].filter(Boolean).join(", ");
        const end = row.currently_working
          ? "Present"
          : [endMonth, row.end_year].filter(Boolean).join(", ");

        return {
          id: row.id,
          title: (row.role ?? "").trim() || "Role",
          company: (row.company_name ?? "").trim() || "Company",
          websiteUrl: (row.company_website_url ?? "").trim(),
          location: (row.location ?? "").trim() || "Location",
          duration: `${start || "N/A"} — ${end || "Present"}`,
          images: mediaRows
            .filter((media) => media.experience_id === row.id)
            .map((media) => media.file_url)
            .filter((url): url is string => !!url),
          descriptionHtml: (row.description_html || "").trim(),
        };
      });

    return NextResponse.json({ experiences: mapped });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown server error" },
      { status: 500 }
    );
  }
}
