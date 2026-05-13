import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type SkillCategoryRow = {
  id: string;
  category_name: string | null;
  sort_order: number | null;
  created_at: string | null;
};

type SkillRow = {
  id: string;
  category_id: string;
  skill_name: string | null;
  skill_icon_key: string | null;
  skill_logo_url: string | null;
  sort_order: number | null;
  created_at: string | null;
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

    const { data: categories, error: categoriesError } = await supabase
      .from("skill_categories")
      .select("id, category_name, sort_order, created_at")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true });

    if (categoriesError) {
      return NextResponse.json(
        { error: categoriesError.message },
        { status: 500 }
      );
    }

    const categoryRows = (categories ?? []) as SkillCategoryRow[];
    const categoryIds = categoryRows.map((row) => row.id);

    let skillRows: SkillRow[] = [];
    if (categoryIds.length > 0) {
      const { data: skills, error: skillsError } = await supabase
        .from("skills")
        .select(
          "id, category_id, skill_name, skill_icon_key, skill_logo_url, sort_order, created_at"
        )
        .in("category_id", categoryIds)
        .is("deleted_at", null)
        .order("sort_order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: true });

      if (skillsError) {
        return NextResponse.json({ error: skillsError.message }, { status: 500 });
      }

      skillRows = (skills ?? []) as SkillRow[];
    }

    const grouped = categoryRows
      .filter((category) => category.id)
      .map((category) => ({
        id: category.id,
        title: (category.category_name ?? "").trim() || "Uncategorized",
        skills: skillRows
          .filter((skill) => skill.category_id === category.id)
          .map((skill) => ({
            id: skill.id,
            name: (skill.skill_name ?? "").trim(),
            iconKey: skill.skill_icon_key,
            logoUrl: skill.skill_logo_url,
          }))
          .filter((skill) => skill.name.length > 0),
      }))
      .filter((group) => group.skills.length > 0);

    return NextResponse.json({ groups: grouped });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown server error" },
      { status: 500 }
    );
  }
}
