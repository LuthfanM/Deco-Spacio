import type { User } from "@/lib/db";
import { generateId, generateRecoveryKey } from "@/lib/db";
import { createDatabaseError, getSupabase } from "@/lib/store.settings";

export async function createUser(): Promise<User> {
  const newUser: User = {
    user_id: generateId("user"),
    recovery_key: generateRecoveryKey(),
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabase({ userId: newUser.user_id });
  const { data, error } = await supabase
    .from("users")
    .insert(newUser)
    .select("user_id,recovery_key,created_at")
    .single<User>();

  if (error) {
    throw createDatabaseError("create user session", error);
  }

  return data;
}

export async function findUserById(userId: string): Promise<User | null> {
  const supabase = getSupabase({ userId });

  const { data, error } = await supabase
    .from("users")
    .select("user_id,recovery_key,created_at")
    .eq("user_id", userId)
    .maybeSingle<User>();

  if (error) {
    throw createDatabaseError("find user session", error);
  }

  return data;
}

export async function findUserByRecoveryKey(
  recoveryKey: string,
): Promise<User | null> {
  const cleanedKey = recoveryKey.trim().toUpperCase();
  const supabase = getSupabase({ recoveryKey: cleanedKey });

  const { data, error } = await supabase
    .from("users")
    .select("user_id,recovery_key,created_at")
    .ilike("recovery_key", cleanedKey)
    .maybeSingle<User>();

  if (error) {
    throw createDatabaseError("restore user session", error);
  }

  return data;
}
