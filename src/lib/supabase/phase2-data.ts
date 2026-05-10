import { supabase } from "./client";
import { buildSafeFileName, deleteFile, deleteManyFiles, uploadFile } from "./storage";

function dataUrlToFile(dataUrl: string, fallbackName: string) {
  const [meta, b64] = dataUrl.split(",");
  const mimeMatch = meta.match(/data:(.*?);base64/);
  const mime = mimeMatch?.[1] || "image/png";
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new File([arr], fallbackName, { type: mime });
}

export async function listEducation(adminId: number) {
  const { data, error } = await supabase
    .from("education")
    .select("*, education_media(*)")
    .eq("admin_id", adminId)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function upsertEducationWithMedia(params: {
  adminId: number;
  entryId?: number;
  payload: Record<string, unknown>;
  images: string[];
}) {
  const { adminId, entryId, payload, images } = params;
  let id = entryId;

  if (id) {
    const { error } = await supabase.from("education").update(payload).eq("id", id);
    if (error) throw error;
  } else {
    const { data, error } = await supabase.from("education").insert({ ...payload, admin_id: adminId }).select("id").single();
    if (error) throw error;
    id = data.id;
  }

  const { data: existingMedia, error: mediaErr } = await supabase
    .from("education_media")
    .select("*")
    .eq("education_id", id);
  if (mediaErr) throw mediaErr;

  const existing = existingMedia ?? [];
  const existingUrls = new Set(existing.map((m) => m.file_url));
  const keepUrls = new Set(images.filter((img) => !img.startsWith("data:")));

  const toDelete = existing.filter((m) => !keepUrls.has(m.file_url));
  for (const m of toDelete) {
    await deleteFile("education-media", m.file_path);
    await supabase.from("education_media").delete().eq("id", m.id);
  }

  let sortOrder = 0;
  for (const img of images) {
    if (img.startsWith("data:")) {
      const file = dataUrlToFile(img, buildSafeFileName("education.png"));
      const path = `${id}/${buildSafeFileName(file.name)}`;
      const uploaded = await uploadFile("education-media", path, file);
      const { error } = await supabase.from("education_media").insert({
        education_id: id,
        file_url: uploaded.url,
        file_path: uploaded.path,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        file_type: "image",
        sort_order: sortOrder++,
      });
      if (error) {
        await deleteFile("education-media", uploaded.path).catch(() => {});
        throw error;
      }
    }
  }

  return id;
}

export async function deleteEducationWithMedia(id: number) {
  const { data: media, error: mediaErr } = await supabase
    .from("education_media")
    .select("id, file_path")
    .eq("education_id", id);
  if (mediaErr) throw mediaErr;

  const paths = (media ?? []).map((m) => m.file_path);
  await deleteManyFiles("education-media", paths);
  await supabase.from("education_media").delete().eq("education_id", id);
  const { error } = await supabase.from("education").delete().eq("id", id);
  if (error) throw error;
}

export async function listExperience(adminId: number) {
  const { data, error } = await supabase
    .from("experience")
    .select("*, experience_media(*)")
    .eq("admin_id", adminId)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function upsertExperienceWithMedia(params: {
  adminId: number;
  entryId?: number;
  payload: Record<string, unknown>;
  images: string[];
}) {
  const { adminId, entryId, payload, images } = params;
  let id = entryId;

  if (id) {
    const { error } = await supabase.from("experience").update(payload).eq("id", id);
    if (error) throw error;
  } else {
    const { data, error } = await supabase.from("experience").insert({ ...payload, admin_id: adminId }).select("id").single();
    if (error) throw error;
    id = data.id;
  }

  const { data: existingMedia, error: mediaErr } = await supabase
    .from("experience_media")
    .select("*")
    .eq("experience_id", id);
  if (mediaErr) throw mediaErr;

  const existing = existingMedia ?? [];
  const keepUrls = new Set(images.filter((img) => !img.startsWith("data:")));
  const toDelete = existing.filter((m) => !keepUrls.has(m.file_url));

  for (const m of toDelete) {
    await deleteFile("experience-media", m.file_path);
    await supabase.from("experience_media").delete().eq("id", m.id);
  }

  let sortOrder = 0;
  for (const img of images) {
    if (img.startsWith("data:")) {
      const file = dataUrlToFile(img, buildSafeFileName("experience.png"));
      const path = `${id}/${buildSafeFileName(file.name)}`;
      const uploaded = await uploadFile("experience-media", path, file);
      const { error } = await supabase.from("experience_media").insert({
        experience_id: id,
        file_url: uploaded.url,
        file_path: uploaded.path,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        file_type: "image",
        sort_order: sortOrder++,
      });
      if (error) {
        await deleteFile("experience-media", uploaded.path).catch(() => {});
        throw error;
      }
    }
  }

  return id;
}

export async function deleteExperienceWithMedia(id: number) {
  const { data: row } = await supabase.from("experience").select("company_logo_path").eq("id", id).single();
  if (row?.company_logo_path) {
    await deleteFile("logos", row.company_logo_path);
  }
  const { data: media, error: mediaErr } = await supabase
    .from("experience_media")
    .select("id, file_path")
    .eq("experience_id", id);
  if (mediaErr) throw mediaErr;
  const paths = (media ?? []).map((m) => m.file_path);
  await deleteManyFiles("experience-media", paths);
  await supabase.from("experience_media").delete().eq("experience_id", id);
  const { error } = await supabase.from("experience").delete().eq("id", id);
  if (error) throw error;
}

