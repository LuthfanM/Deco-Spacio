import type { User } from "@/lib/db";
import { generateId, generateRecoveryKey, loadDB } from "@/lib/db";
import { mirrorUserToSupabase, upsertLocalUser } from "@/lib/store.local";

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
  return loadDB().users.find((user) => user.user_id === userId) || null;
}
