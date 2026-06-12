import type { GenerationImage } from "@/lib/db";
import { loadDB, saveDB } from "@/lib/db";
import { DEFAULT_STORAGE_BUCKET } from "@/lib/store.constants";
import { mirrorImageToSupabase, upsertLocalImage } from "@/lib/store.local";
import { getSupabase } from "@/lib/store.settings";

export type ImageUpdate = Partial<
  Pick<
    GenerationImage,
    | "final_prompt"
    | "image_url"
    | "storage_path"
    | "status"
    | "error_message"
    | "updated_at"
  >
>;

type ImageStorageUpload = {
  userId: string;
  filename: string;
  buffer: Buffer;
  contentType: string;
};

type StorageUploadResult = {
  imageUrl: string;
  storagePath: string;
};

export async function createImageRecord(
  image: GenerationImage,
): Promise<GenerationImage> {
  upsertLocalImage(image);
  await mirrorImageToSupabase(image);
  
  return image;
}

export async function updateImageRecord(
  imageId: string,
  updates: ImageUpdate,
): Promise<GenerationImage | null> {
  const payload = {
    ...updates,
    updated_at: updates.updated_at || new Date().toISOString(),
  };

  const db = loadDB();
  const recordIndex = db.images.findIndex((image) => image.id === imageId);

  if (recordIndex === -1) {
    return null;
  }

  const updatedImage: GenerationImage = {
    ...db.images[recordIndex],
    ...payload,
  };

  db.images[recordIndex] = updatedImage;
  saveDB(db);

  const supabase = getSupabase({ userId: updatedImage.user_id });

  if (!supabase) {
    return updatedImage;
  }

  const { data, error } = await supabase
    .from("images")
    .update(payload)
    .eq("id", imageId)
    .select("*")
    .maybeSingle<GenerationImage>();

  if (error) {
    console.warn("Supabase image update failed, using local JSON:", error);
    return updatedImage;
  }

  if (data) {
    upsertLocalImage(data);
    return data;
  }

  return updatedImage;
}

export async function uploadImageToStorage({
  userId,
  filename,
  buffer,
  contentType,
}: ImageStorageUpload): Promise<StorageUploadResult | null> {
  const supabase = getSupabase({ userId });

  if (!supabase) {
    return null;
  }

  const storagePath = `${userId}/${filename}`;
  const { error } = await supabase.storage
    .from(DEFAULT_STORAGE_BUCKET)
    .upload(storagePath, buffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.warn("Supabase image upload failed, using local file:", error);
    return null;
  }

  const { data } = supabase.storage
    .from(DEFAULT_STORAGE_BUCKET)
    .getPublicUrl(storagePath);

  return {
    imageUrl: data.publicUrl,
    storagePath,
  };
}
