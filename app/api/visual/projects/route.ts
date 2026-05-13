import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type ProjectRow = {
  id: string;
  project_title: string | null;
  description_html: string | null;
  github_url: string | null;
  live_url: string | null;
  sort_order: number | null;
  created_at: string | null;
};

type ProjectImageRow = {
  project_id: string;
  image_url: string | null;
  sort_order: number | null;
  created_at: string | null;
};

type ProjectTagRow = {
  project_id: string;
  tag_name: string | null;
  created_at: string | null;
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
      .from("projects")
      .select("id, project_title, description_html, github_url, live_url, sort_order, created_at")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const projects = (data ?? []) as ProjectRow[];
    const ids = projects.map((p) => p.id);

    let images: ProjectImageRow[] = [];
    let tags: ProjectTagRow[] = [];

    if (ids.length > 0) {
      const [{ data: imageData, error: imageError }, { data: tagData, error: tagError }] = await Promise.all([
        supabase
          .from("project_images")
          .select("project_id, image_url, sort_order, created_at")
          .in("project_id", ids)
          .order("sort_order", { ascending: true, nullsFirst: false })
          .order("created_at", { ascending: true }),
        supabase
          .from("project_tags")
          .select("project_id, tag_name, created_at")
          .in("project_id", ids)
          .order("created_at", { ascending: true }),
      ]);

      if (imageError) return NextResponse.json({ error: imageError.message }, { status: 500 });
      if (tagError) return NextResponse.json({ error: tagError.message }, { status: 500 });

      images = (imageData ?? []) as ProjectImageRow[];
      tags = (tagData ?? []) as ProjectTagRow[];
    }

    const mapped = projects.map((row) => ({
      id: row.id,
      title: (row.project_title ?? "").trim() || "Project",
      descriptionHtml: (row.description_html || "").trim(),
      githubUrl: (row.github_url ?? "").trim(),
      demoUrl: (row.live_url ?? "").trim(),
      image: images.find((img) => img.project_id === row.id)?.image_url || "",
      tech: tags
        .filter((tag) => tag.project_id === row.id)
        .map((tag) => (tag.tag_name ?? "").trim())
        .filter(Boolean),
    }));

    return NextResponse.json({ projects: mapped });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Unknown server error" },
      { status: 500 }
    );
  }
}

