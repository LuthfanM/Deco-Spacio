import type { User } from "@/lib/db";
import { generateId, generateRecoveryKey, loadDB } from "@/lib/db";
import { mirrorUserToSupabase, upsertLocalUser } from "@/lib/store.local";
import { getSupabase } from "./store.settings";

export async function createUser(): Promise<User> {
  const newUser: User = {
    user_id: generateId("user"),
    recovery_key: generateRecoveryKey(),
    created_at: new Date().toISOString(),
  };

  upsertLocalUser(newUser);
  await mirrorUserToSupabase(newUser);
  
  return newUser;
}

export async function findUserById(userId: string): Promise<User | null> {
  const localUser =
    loadDB().users.find((user) => user.user_id === userId) || null;
  const supabase = getSupabase({ userId });

  if (!supabase) {
    return localUser;
  }

  const { data, error } = await supabase
    .from("users")
    .select("user_id,recovery_key,created_at")
    .eq("user_id", userId)
    .maybeSingle<User>();

  if (error) {
    console.warn("Supabase user lookup failed, using local JSON:", error);
    if (localUser) return localUser;
    throw error;
  }

  if (data) {
    upsertLocalUser(data);
    return data;
  }

  if (localUser) {
    await mirrorUserToSupabase(localUser);
  }

  return localUser;
}
