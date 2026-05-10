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

export async function listProjects(adminId: number) {
  const { data, error } = await supabase
    .from("projects")
    .select("*, project_images(*), project_tags(*)")
    .eq("admin_id", adminId)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id as number,
    title: (row.project_title as string) ?? "Untitled Project",
    date: row.created_at
      ? new Date(row.created_at as string).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : "",
    tags: ((row.project_tags as Array<{ tag_name: string }> | null) ?? []).map((t) => t.tag_name),
    images: ((row.project_images as Array<{ image_url: string }> | null) ?? []).map((i) => i.image_url),
    description: (row.description_html as string) ?? "",
    github_url: (row.github_url as string | null) ?? "",
    live_url: (row.live_url as string | null) ?? "",
  }));
}

export async function upsertProjectWithAssets(params: {
  adminId: number;
  entryId?: number;
  payload: {
    project_title: string;
    description_html: string;
    github_url: string | null;
    live_url: string | null;
    is_featured?: boolean;
    sort_order?: number;
  };
  tags: string[];
  images: string[];
}) {
  const { adminId, entryId, payload, tags, images } = params;
  let id = entryId;

  if (id) {
    const { error } = await supabase.from("projects").update(payload).eq("id", id);
    if (error) throw error;
  } else {
    const { data, error } = await supabase
      .from("projects")
      .insert({ ...payload, admin_id: adminId })
      .select("id")
      .single();
    if (error) throw error;
    id = data.id;
  }

  const { data: existingImages, error: imgErr } = await supabase
    .from("project_images")
    .select("id, image_url, image_path")
    .eq("project_id", id);
  if (imgErr) throw imgErr;

  const keepUrls = new Set(images.filter((img) => !img.startsWith("data:")));
  const toDelete = (existingImages ?? []).filter((img) => !keepUrls.has(img.image_url));

  for (const img of toDelete) {
    await deleteFile("project-images", img.image_path);
    const { error } = await supabase.from("project_images").delete().eq("id", img.id);
    if (error) throw error;
  }

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    if (!img.startsWith("data:")) continue;

    const file = dataUrlToFile(img, buildSafeFileName("project.png"));
    const path = `${id}/${buildSafeFileName(file.name)}`;

    const uploaded = await uploadFile("project-images", path, file);
    const { error } = await supabase.from("project_images").insert({
      project_id: id,
      image_url: uploaded.url,
      image_path: uploaded.path,
      file_name: file.name,
      file_size: file.size,
      mime_type: file.type,
      sort_order: i,
    });

    if (error) {
      await deleteFile("project-images", uploaded.path).catch(() => {});
      throw error;
    }
  }

  const { error: tagDeleteErr } = await supabase.from("project_tags").delete().eq("project_id", id);
  if (tagDeleteErr) throw tagDeleteErr;

  const cleanTags = tags.map((t) => t.trim()).filter(Boolean);
  if (cleanTags.length) {
    const { error: tagInsertErr } = await supabase
      .from("project_tags")
      .insert(cleanTags.map((tag_name) => ({ project_id: id, tag_name })));
    if (tagInsertErr) throw tagInsertErr;
  }

  return id;
}

export async function deleteProjectWithAssets(id: number) {
  const { data: images, error: imgErr } = await supabase
    .from("project_images")
    .select("image_path")
    .eq("project_id", id);
  if (imgErr) throw imgErr;

  await deleteManyFiles("project-images", (images ?? []).map((i) => i.image_path));

  const { error: imgDeleteErr } = await supabase.from("project_images").delete().eq("project_id", id);
  if (imgDeleteErr) throw imgDeleteErr;

  const { error: tagDeleteErr } = await supabase.from("project_tags").delete().eq("project_id", id);
  if (tagDeleteErr) throw tagDeleteErr;

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

export async function listPracticePlatforms(adminId: string | number) {
  const { data: platforms, error: pErr } = await supabase
    .from("practice_platforms")
    .select("*")
    .eq("admin_id", adminId)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (pErr) throw pErr;

  const platformIds = (platforms ?? []).map((p) => String(p.id));
  const { data: challenges, error: cErr } = platformIds.length
    ? await supabase
        .from("practice_challenges")
        .select("*")
        .in("platform_id", platformIds)
        .is("deleted_at", null)
        .order("created_at", { ascending: true })
    : { data: [], error: null as any };
  if (cErr) throw cErr;

  return (platforms ?? []).map((platform) => ({
    id: String(platform.id),
    name: (platform.platform_name as string) ?? "",
    problemSets: ((challenges as Array<Record<string, unknown>> | null) ?? [])
      .filter((c) => String(c.platform_id) === String(platform.id))
      .map((c) => ({
        id: String(c.id),
        name: (c.challenge_title as string) ?? "",
        url: (c.verification_url as string) ?? "",
        stats: {
          easy: Number(c.easy_count ?? 0),
          medium: Number(c.medium_count ?? 0),
          hard: Number(c.hard_count ?? 0),
        },
      })),
  }));
}

export async function upsertPracticePlatform(adminId: string | number, params: { id?: string; platform_name: string; sort_order?: number }) {
  const { id, platform_name, sort_order = 0 } = params;
  if (id) {
    const { error } = await supabase.from("practice_platforms").update({ platform_name, sort_order }).eq("id", id);
    if (error) throw error;
    return id;
  }

  const { data, error } = await supabase
    .from("practice_platforms")
    .insert({ admin_id: adminId, platform_name, sort_order })
    .select("id")
    .single();
  if (error) throw error;
  return String(data.id);
}

export async function upsertPracticeChallenge(platformId: string, params: {
  id?: string;
  challenge_title: string;
  verification_url: string;
  easy_count: number;
  medium_count: number;
  hard_count: number;
}) {
  const payload = {
    platform_id: platformId,
    challenge_title: params.challenge_title,
    verification_url: params.verification_url,
    easy_count: params.easy_count,
    medium_count: params.medium_count,
    hard_count: params.hard_count,
  };

  if (params.id) {
    const { error } = await supabase.from("practice_challenges").update(payload).eq("id", params.id);
    if (error) throw error;
    return params.id;
  }

  const { data, error } = await supabase.from("practice_challenges").insert(payload).select("id").single();
  if (error) throw error;
  return String(data.id);
}

export async function deletePracticeChallenge(id: string) {
  const { error } = await supabase.from("practice_challenges").delete().eq("id", id);
  if (error) throw error;
}

export async function deletePracticePlatform(id: string) {
  const { data: pRow, error: pErr } = await supabase
    .from("practice_platforms")
    .select("platform_logo_path")
    .eq("id", id)
    .single();
  if (pErr) throw pErr;

  if (pRow?.platform_logo_path) {
    await deleteFile("logos", pRow.platform_logo_path);
  }

  const { error: childErr } = await supabase.from("practice_challenges").delete().eq("platform_id", id);
  if (childErr) throw childErr;

  const { error } = await supabase.from("practice_platforms").delete().eq("id", id);
  if (error) throw error;
}

export async function listSkillCategories(adminId: number) {
  const { data, error } = await supabase
    .from("skill_categories")
    .select("*, skills(*)")
    .eq("admin_id", adminId)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;

  return data ?? [];
}

export async function upsertSkillCategory(adminId: number, params: { id?: number; category_name: string; sort_order?: number }) {
  const { id, category_name, sort_order = 0 } = params;

  if (id) {
    const { error } = await supabase.from("skill_categories").update({ category_name, sort_order }).eq("id", id);
    if (error) throw error;
    return id;
  }

  const { data, error } = await supabase
    .from("skill_categories")
    .insert({ admin_id: adminId, category_name, sort_order })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as number;
}

export async function upsertSkill(params: {
  id?: number;
  category_id: number;
  skill_name: string;
  skill_icon_key?: string | null;
  proficiency_level?: string;
  sort_order?: number;
}) {
  const payload = {
    category_id: params.category_id,
    skill_name: params.skill_name,
    skill_icon_key: params.skill_icon_key ?? null,
    proficiency_level: params.proficiency_level ?? "Intermediate",
    sort_order: params.sort_order ?? 0,
  };

  if (params.id) {
    const { error } = await supabase.from("skills").update(payload).eq("id", params.id);
    if (error) throw error;
    return params.id;
  }

  const { data, error } = await supabase.from("skills").insert(payload).select("id").single();
  if (error) throw error;
  return data.id as number;
}

export async function deleteSkill(id: number) {
  const { data: row, error: rowErr } = await supabase
    .from("skills")
    .select("skill_logo_path")
    .eq("id", id)
    .single();
  if (rowErr) throw rowErr;

  if (row?.skill_logo_path) {
    await deleteFile("logos", row.skill_logo_path);
  }

  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) throw error;
}

export async function deleteSkillCategoryWithSkills(categoryId: number) {
  const { data: skills, error: skillsErr } = await supabase
    .from("skills")
    .select("id, skill_logo_path")
    .eq("category_id", categoryId);
  if (skillsErr) throw skillsErr;

  await deleteManyFiles("logos", (skills ?? []).map((s) => s.skill_logo_path));

  const { error: childDeleteErr } = await supabase.from("skills").delete().eq("category_id", categoryId);
  if (childDeleteErr) throw childDeleteErr;

  const { error } = await supabase.from("skill_categories").delete().eq("id", categoryId);
  if (error) throw error;
}
