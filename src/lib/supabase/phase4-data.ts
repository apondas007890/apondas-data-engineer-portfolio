import { supabase } from "./client";
import { buildSafeFileName, deleteFile, uploadFile } from "./storage";

export type CertificationRow = {
  id: number;
  certification_title: string;
  issuer: string;
  issued_date: string | null;
  description: string | null;
  verification_url: string | null;
  certificate_pdf_url: string | null;
  certificate_pdf_path: string | null;
  issuer_logo_url: string | null;
  issuer_logo_path: string | null;
  issuer_icon_key: string | null;
  sort_order: number | null;
  created_at: string | null;
};

export async function listCertifications(adminId: number) {
  const { data, error } = await supabase
    .from("certifications")
    .select("*")
    .eq("admin_id", adminId)
    .is("deleted_at", null)
    .order("issued_date", { ascending: false, nullsFirst: false })
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as CertificationRow[];
}

export async function upsertCertification(params: {
  adminId: number;
  certId?: number;
  payload: {
    certification_title: string;
    issuer: string;
    issued_date: string | null;
    verification_url: string | null;
    description?: string | null;
    sort_order?: number;
    issuer_icon_key?: string | null;
  };
  pdfFile?: File | null;
  issuerLogoFile?: File | null;
}) {
  const { adminId, certId, payload, pdfFile, issuerLogoFile } = params;
  let id = certId;

  if (id) {
    const { error } = await supabase.from("certifications").update(payload).eq("id", id);
    if (error) throw error;
  } else {
    const { data, error } = await supabase
      .from("certifications")
      .insert({ ...payload, admin_id: adminId })
      .select("id")
      .single();
    if (error) throw error;
    id = data.id;
  }

  const { data: existing, error: existingErr } = await supabase
    .from("certifications")
    .select("certificate_pdf_path, issuer_logo_path")
    .eq("id", id)
    .single();
  if (existingErr) throw existingErr;

  let uploadedPdf: { path: string; url: string } | null = null;
  let uploadedLogo: { path: string; url: string } | null = null;

  try {
    if (pdfFile) {
      const path = `${id}/${buildSafeFileName(pdfFile.name)}`;
      uploadedPdf = await uploadFile("certificates", path, pdfFile);
    }

    if (issuerLogoFile) {
      const path = `issuer/${id}/${buildSafeFileName(issuerLogoFile.name)}`;
      uploadedLogo = await uploadFile("logos", path, issuerLogoFile);
    }

    const nextPatch: Record<string, unknown> = {};
    if (uploadedPdf) {
      nextPatch.certificate_pdf_url = uploadedPdf.url;
      nextPatch.certificate_pdf_path = uploadedPdf.path;
      nextPatch.certificate_file_name = pdfFile?.name ?? null;
      nextPatch.certificate_file_size = pdfFile?.size ?? null;
      nextPatch.certificate_mime_type = pdfFile?.type ?? null;
    }
    if (uploadedLogo) {
      nextPatch.issuer_logo_url = uploadedLogo.url;
      nextPatch.issuer_logo_path = uploadedLogo.path;
    }

    if (Object.keys(nextPatch).length > 0) {
      const { error: patchErr } = await supabase.from("certifications").update(nextPatch).eq("id", id);
      if (patchErr) throw patchErr;
    }

    if (uploadedPdf && existing?.certificate_pdf_path) {
      await deleteFile("certificates", existing.certificate_pdf_path);
    }
    if (uploadedLogo && existing?.issuer_logo_path) {
      await deleteFile("logos", existing.issuer_logo_path);
    }

    return id;
  } catch (error) {
    if (uploadedPdf) {
      await deleteFile("certificates", uploadedPdf.path).catch(() => {});
    }
    if (uploadedLogo) {
      await deleteFile("logos", uploadedLogo.path).catch(() => {});
    }
    throw error;
  }
}

export async function deleteCertification(certId: number) {
  const { data, error } = await supabase
    .from("certifications")
    .select("certificate_pdf_path, issuer_logo_path")
    .eq("id", certId)
    .single();
  if (error) throw error;

  if (data?.certificate_pdf_path) {
    await deleteFile("certificates", data.certificate_pdf_path);
  }
  if (data?.issuer_logo_path) {
    await deleteFile("logos", data.issuer_logo_path);
  }

  const { error: delErr } = await supabase.from("certifications").delete().eq("id", certId);
  if (delErr) throw delErr;
}
