import { supabase } from "./client";

export const ADMIN_EMAIL = "apondas007890@gmail.com";
export const ADMIN_UID = "09dca501-2a12-491a-9990-2e73b5013572";

export type AdminAccessResult = {
  ok: boolean;
  reason?: string;
  profile?: {
    id: number;
    auth_user_id: string;
    email: string | null;
    full_name: string | null;
  };
};

const toLower = (v: string | null | undefined) => (v ?? "").trim().toLowerCase();

export async function verifyAdminAccess(): Promise<AdminAccessResult> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { ok: false, reason: "NO_SESSION" };
  }

  const user = userData.user;
  const email = toLower(user.email);
  if (user.id !== ADMIN_UID || email !== ADMIN_EMAIL) {
    return { ok: false, reason: "INVALID_ADMIN_IDENTITY" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("admin_profiles")
    .select("id,auth_user_id,email,full_name")
    .eq("auth_user_id", user.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (profileError || !profile) {
    return { ok: false, reason: "NO_ADMIN_PROFILE" };
  }

  return { ok: true, profile };
}

export async function signOutInvalidUser() {
  await supabase.auth.signOut();
}

