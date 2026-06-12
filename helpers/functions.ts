import { CameraView, GenerationImage, InteriorStyle, MoodLighting, RoomType } from "@/types/commons";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function readApiResponse<T = any>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return res.json();
  }

  const text = await res.text();
  const plainText = text
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return {
    __nonJsonResponse: true,
    error_message:
      plainText ||
      `Expected JSON response but received ${contentType || "unknown content"}.`,
  } as T;
}

function isNonJsonResponse(value: unknown): value is { error_message: string } {
  return Boolean(
    value &&
      typeof value === "object" &&
      "__nonJsonResponse" in value,
  );
}

function inferSavedControls(img: GenerationImage): {
  roomType: RoomType;
  style: InteriorStyle;
  mood: MoodLighting;
  cameraView: CameraView;
} {
  const finalPrompt = `${img.final_prompt || ""}`.toLowerCase();

  const roomType =
    img.room_type ||
    (finalPrompt.includes("living room") ? "Living Room" :
    finalPrompt.includes("kitchen") ? "Kitchen" :
    finalPrompt.includes("workspace") ? "Workspace" :
    finalPrompt.includes("bathroom") ? "Bathroom" :
    finalPrompt.includes("bedroom") ? "Bedroom" : "Other");

  const style =
    img.interior_style ||
    (finalPrompt.includes("modern luxury") ? "Modern Luxury" :
    finalPrompt.includes("scandinavian") ? "Scandinavian" :
    finalPrompt.includes("industrial") ? "Industrial" :
    finalPrompt.includes("minimalist") ? "Minimalist" :
    finalPrompt.includes("japandi") ? "Japandi" : "Other");

  const mood =
    img.mood_lighting ||
    (finalPrompt.includes("bright") ? "Bright" :
    finalPrompt.includes("cozy") ? "Cozy" :
    finalPrompt.includes("dark") || finalPrompt.includes("moody") ? "Dark" :
    finalPrompt.includes("natural") || finalPrompt.includes("daylight") ? "Natural" :
    finalPrompt.includes("warm") ? "Warm" : "Other");

  const cameraView =
    img.camera_view ||
    (finalPrompt.includes("corner view") ? "Corner view" :
    finalPrompt.includes("top-down layout") ? "Top-down layout" :
    finalPrompt.includes("straight-on view") ? "Straight-on view" :
    finalPrompt.includes("close-up detail") ? "Close-up detail" :
    finalPrompt.includes("wide angle") ? "Wide angle" : "Wide angle");

  return { roomType, style, mood, cameraView };
}

export { readApiResponse, isNonJsonResponse, inferSavedControls };
