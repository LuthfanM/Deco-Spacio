import type { DBStructure, GenerationImage, User } from "@/lib/db";
import { loadDB, saveDB } from "@/lib/db";
import { getSupabase } from "./store.settings";

export function mutateJson(mutator: (db: DBStructure) => void): DBStructure {
  const db = loadDB();
  mutator(db);
  saveDB(db);
  return db;
}

export function upsertLocalUser(user: User): void {
  mutateJson((db) => {
    const index = db.users.findIndex((item) => item.user_id === user.user_id);

    if (index === -1) {
      db.users.push(user);
      return;
    }

    db.users[index] = user;
  });
}

export function upsertLocalImage(image: GenerationImage): void {
  mutateJson((db) => {
    const index = db.images.findIndex((item) => item.id === image.id);

    if (index === -1) {
      db.images.push(image);
      return;
    }

    db.images[index] = image;
  });
}

export async function mirrorImageToSupabase(image: GenerationImage): Promise<void> {
  const supabase = getSupabase({ userId: image.user_id });
  if (!supabase) return;

  const { error } = await supabase.from("images").upsert(image, {
    onConflict: "id",
  });

  if (error) {
    console.warn("Supabase image mirror failed:", error);
  }
}


export async function mirrorUserToSupabase(user: User): Promise<void> {
  const supabase = getSupabase({ userId: user.user_id });
  if (!supabase) return;

  const { error } = await supabase.from("users").upsert(user, {
    onConflict: "user_id",
  });

  if (error) {
    console.warn("Supabase user mirror failed:", error);
  }
}