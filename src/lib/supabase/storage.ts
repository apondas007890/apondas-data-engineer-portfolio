import { supabase } from "./client";

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export function buildSafeFileName(fileName: string) {
  const safe = sanitizeFileName(fileName);
  return `${Date.now()}-${crypto.randomUUID()}-${safe}`;
}

export async function uploadFile(bucket: string, path: string, file: File) {
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

export async function deleteFile(bucket: string, path?: string | null) {
  if (!path) return;
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}

export async function deleteManyFiles(bucket: string, paths: Array<string | null | undefined>) {
  const filtered = paths.filter((p): p is string => Boolean(p));
  if (!filtered.length) return;
  const { error } = await supabase.storage.from(bucket).remove(filtered);
  if (error) throw error;
}

export async function replaceFile(bucket: string, oldPath: string | null | undefined, newPath: string, file: File) {
  const uploaded = await uploadFile(bucket, newPath, file);
  try {
    if (oldPath) {
      await deleteFile(bucket, oldPath);
    }
    return uploaded;
  } catch (error) {
    await deleteFile(bucket, newPath);
    throw error;
  }
}

