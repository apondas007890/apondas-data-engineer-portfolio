import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type PracticePlatformRow = {
  id: string | number;
  platform_name: string | null;
  created_at: string | null;
  sort_order: number | null;
};

type PracticeChallengeRow = {
  id: string | number;
  platform_id: string | number;
  challenge_title: string | null;
  verification_url: string | null;
  easy_count: number | null;
  medium_count: number | null;
  hard_count: number | null;
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

    const { data: platforms, error: platformError } = await supabase
      .from("practice_platforms")
      .select("id, platform_name, created_at, sort_order")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true });

    if (platformError) {
      return NextResponse.json({ error: platformError.message }, { status: 500 });
    }

    const platformRows = (platforms ?? []) as PracticePlatformRow[];
    const platformIds = platformRows.map((row) => row.id);

    let challengeRows: PracticeChallengeRow[] = [];
    if (platformIds.length > 0) {
      const { data: challenges, error: challengeError } = await supabase
        .from("practice_challenges")
        .select("id, platform_id, challenge_title, verification_url, easy_count, medium_count, hard_count, created_at")
        .in("platform_id", platformIds)
        .is("deleted_at", null)
        .order("created_at", { ascending: true });

      if (challengeError) {
        return NextResponse.json({ error: challengeError.message }, { status: 500 });
      }

      challengeRows = (challenges ?? []) as PracticeChallengeRow[];
    }

    const rows = challengeRows.map((challenge) => {
      const platform = platformRows.find(
        (item) => String(item.id) === String(challenge.platform_id)
      );
      const easy = Number(challenge.easy_count ?? 0);
      const medium = Number(challenge.medium_count ?? 0);
      const hard = Number(challenge.hard_count ?? 0);

      return {
        id: String(challenge.id),
        platformId: String(challenge.platform_id),
        name: (platform?.platform_name ?? "").trim() || "Platform",
        challenge: (challenge.challenge_title ?? "").trim() || "Challenge",
        url: (challenge.verification_url ?? "").trim(),
        easy,
        medium,
        hard,
        total: easy + medium + hard,
      };
    });

    const total = rows.reduce(
      (acc, row) => {
        acc.easy += row.easy;
        acc.medium += row.medium;
        acc.hard += row.hard;
        acc.grand += row.total;
        return acc;
      },
      { easy: 0, medium: 0, hard: 0, grand: 0 }
    );

    return NextResponse.json({ total, platforms: rows });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown server error" },
      { status: 500 }
    );
  }
}
