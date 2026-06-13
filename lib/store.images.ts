import type { GenerationImage } from "@/lib/db";
import { DEFAULT_STORAGE_BUCKET } from "@/lib/store.constants";
import { createDatabaseError, getSupabase } from "@/lib/store.settings";

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
  const supabase = getSupabase({ userId: image.user_id });
  const { data, error } = await supabase
    .from("images")
    .insert(image)
    .select("*")
    .single<GenerationImage>();

  if (error) {
    throw createDatabaseError("create image record", error);
  }

  return data;
}

export async function updateImageRecord(
  userId: string,
  imageId: string,
  updates: ImageUpdate,
): Promise<GenerationImage | null> {
  const payload = {
    ...updates,
    updated_at: updates.updated_at || new Date().toISOString(),
  };

  const supabase = getSupabase({ userId });

  const { data, error } = await supabase
    .from("images")
    .update(payload)
    .eq("id", imageId)
    .eq("user_id", userId)
    .select("*")
    .maybeSingle<GenerationImage>();

  if (error) {
    throw createDatabaseError("update image record", error);
  }

  return data;
}

export async function uploadImageToStorage({
  userId,
  filename,
  buffer,
  contentType,
}: ImageStorageUpload): Promise<StorageUploadResult> {
  const supabase = getSupabase({ userId });

  const storagePath = `${userId}/${filename}`;
  const { error } = await supabase.storage
    .from(DEFAULT_STORAGE_BUCKET)
    .upload(storagePath, buffer, {
      contentType,
      upsert: true,
    });

  if (error) {
    throw createDatabaseError("upload image to storage", error);
  }

  const { data } = supabase.storage
    .from(DEFAULT_STORAGE_BUCKET)
    .getPublicUrl(storagePath);

  return {
    imageUrl: data.publicUrl,
    storagePath,
  };
}

export async function listCompletedImagesByUser(
  userId: string,
): Promise<GenerationImage[]> {
  const supabase = getSupabase({ userId });

  const { data, error } = await supabase
    .from("images")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "COMPLETED")
    .order("created_at", { ascending: false })
    .returns<GenerationImage[]>();

  if (error) {
    throw createDatabaseError("load gallery", error);
  }

  return data || [];
}
