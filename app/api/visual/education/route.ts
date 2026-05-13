import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type EducationRow = {
  id: string;
  school_college: string | null;
  institution_website_url: string | null;
  degree: string | null;
  start_month: string | null;
  start_year: number | null;
  end_month: string | null;
  end_year: number | null;
  currently_studying: boolean | null;
  score_type: string | null;
  score_value: string | null;
  description_html: string | null;
  sort_order: number | null;
  created_at: string | null;
};

type MediaRow = {
  id: string;
  education_id: string;
  file_url: string | null;
  sort_order: number | null;
  created_at: string | null;
};

const toTitleMonth = (value: string | null) => {
  if (!value) return "";
  const raw = value.trim();
  if (!raw) return "";
  return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
};

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "Supabase configuration is missing." }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from("education")
      .select("id, school_college, institution_website_url, degree, start_month, start_year, end_month, end_year, currently_studying, score_type, score_value, description_html, sort_order, created_at")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const rows = (data ?? []) as EducationRow[];
    const ids = rows.map((row) => row.id);

    let mediaRows: MediaRow[] = [];
    if (ids.length > 0) {
      const { data: media, error: mediaError } = await supabase
        .from("education_media")
        .select("id, education_id, file_url, sort_order, created_at")
        .in("education_id", ids)
        .order("sort_order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: true });
      if (mediaError) return NextResponse.json({ error: mediaError.message }, { status: 500 });
      mediaRows = (media ?? []) as MediaRow[];
    }

    const educations = rows.map((row) => {
      const start = [toTitleMonth(row.start_month), row.start_year].filter(Boolean).join(", ");
      const end = row.currently_studying
        ? "Present"
        : [toTitleMonth(row.end_month), row.end_year].filter(Boolean).join(", ");

      return {
        id: row.id,
        degree: (row.degree ?? "").trim() || "Degree",
        institution: (row.school_college ?? "").trim() || "Institution",
        websiteUrl: (row.institution_website_url ?? "").trim(),
        year: `${start || "N/A"} — ${end || "Present"}`,
        result: [row.score_type, row.score_value].filter(Boolean).join(": ").trim() || "N/A",
        descriptionHtml: (row.description_html || "").trim(),
        images: mediaRows
          .filter((m) => m.education_id === row.id)
          .map((m) => m.file_url)
          .filter((url): url is string => !!url),
      };
    });

    return NextResponse.json({ educations });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown server error" },
      { status: 500 }
    );
  }
}

