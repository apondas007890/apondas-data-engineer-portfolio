import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type CertificationRow = {
  id: string;
  certification_title: string | null;
  issuer: string | null;
  issued_date: string | null;
  description: string | null;
  verification_url: string | null;
  certificate_pdf_url: string | null;
  issuer_logo_url: string | null;
  sort_order: number | null;
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
      .from("certifications")
      .select("id, certification_title, issuer, issued_date, description, verification_url, certificate_pdf_url, issuer_logo_url, sort_order, created_at")
      .is("deleted_at", null)
      .order("issued_date", { ascending: false, nullsFirst: false })
      .order("sort_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const certifications = ((data ?? []) as CertificationRow[]).map((row) => ({
      id: row.id,
      title: (row.certification_title ?? "").trim() || "Certificate",
      issuer: (row.issuer ?? "").trim() || "Issuer",
      issuedDate: row.issued_date,
      descriptionHtml: (row.description ?? "").trim(),
      verifyUrl: (row.verification_url ?? "").trim(),
      pdfUrl: (row.certificate_pdf_url ?? "").trim(),
      issuerLogoUrl: (row.issuer_logo_url ?? "").trim(),
      status: row.issued_date ? `Issued ${row.issued_date}` : "Credential available",
    }));

    return NextResponse.json({ certifications });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown server error" },
      { status: 500 }
    );
  }
}
