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

export async function mirrorImageToSupabase(
  image: GenerationImage,
): Promise<void> {
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

export async function listCompletedImagesByUser(
  userId: string,
): Promise<GenerationImage[]> {
  const localImages = loadDB()
    .images.filter(
      (img) => img.user_id === userId && img.status === "COMPLETED",
    )
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  const supabase = getSupabase({ userId });

  if (!supabase) {
    return localImages;
  }

  const { data, error } = await supabase
    .from("images")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "COMPLETED")
    .order("created_at", { ascending: false })
    .returns<GenerationImage[]>();

  if (error) {
    console.warn("Supabase gallery lookup failed, using local JSON:", error);
    if (localImages.length > 0) return localImages;
    throw error;
  }

  for (const image of data || []) {
    upsertLocalImage(image);
  }

  if ((data || []).length === 0 && localImages.length > 0) {
    await Promise.all(localImages.map((image) => mirrorImageToSupabase(image)));
  }

  return data && data.length > 0 ? data : localImages;
}
