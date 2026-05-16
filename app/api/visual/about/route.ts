import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "Supabase configuration is missing." }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from("about")
      .select("full_name, role_title, bio_html, profile_picture_url, linkedin_url, github_url, whatsapp_number")
      .is("deleted_at", null)
      .order("updated_at", { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      about: data
        ? {
            fullName: (data.full_name ?? "").trim(),
            roleTitle: (data.role_title ?? "").trim(),
            bioHtml: (data.bio_html ?? "").trim(),
            profilePictureUrl: (data.profile_picture_url ?? "").trim(),
            linkedinUrl: (data.linkedin_url ?? "").trim(),
            githubUrl: (data.github_url ?? "").trim(),
            whatsappNumber: (data.whatsapp_number ?? "").trim(),
          }
        : null,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown server error" },
      { status: 500 }
    );
  }
}
