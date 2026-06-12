import { DEFAULT_POLLINATIONS_IMAGE_BASE_URL } from "@/server/server-constants";

function buildPollinationsImageUrl(finalPrompt: string, seed: number): string {
  const baseUrl =
    process.env.POLLINATIONS_IMAGE_BASE_URL ||
    DEFAULT_POLLINATIONS_IMAGE_BASE_URL;

  const url = new URL(
    `${baseUrl.replace(/\/$/, "")}/${encodeURIComponent(finalPrompt)}`,
  );

  url.searchParams.set("width", process.env.POLLINATIONS_WIDTH || "1024");
  url.searchParams.set("height", process.env.POLLINATIONS_HEIGHT || "800");
  url.searchParams.set("seed", String(seed));
  url.searchParams.set("model", process.env.POLLINATIONS_MODEL || "flux");
  url.searchParams.set("nologo", process.env.POLLINATIONS_NO_LOGO || "true");
  url.searchParams.set("enhance", process.env.POLLINATIONS_ENHANCE || "false");

  if (process.env.POLLINATIONS_REFERRER) {
    url.searchParams.set("referrer", process.env.POLLINATIONS_REFERRER);
  }

  return url.toString();
}

function cleanPromptPart(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ");
}

function buildInteriorPrompt(
  prompt: string,
  roomType?: string,
  style?: string,
  mood?: string,
  cameraView?: string,
  generationType: "generate" | "edit" = "generate",
): string {
  const selectedRoom = cleanPromptPart(roomType);
  const selectedStyle = cleanPromptPart(style);
  const selectedMood = cleanPromptPart(mood);
  const selectedCameraView = cleanPromptPart(cameraView);
  const coreIdea = cleanPromptPart(prompt);

  const roomPhrase =
    selectedRoom && selectedRoom !== "Other"
      ? `${selectedRoom.toLowerCase()} interior`
      : "interior space";

  const stylePhrase =
    selectedStyle && selectedStyle !== "Other"
      ? `${selectedStyle} style`
      : "user-requested interior style";

  const moodPhrase = getMoodPrompt(selectedMood);
  const cameraPhrase = getCameraPrompt(selectedCameraView);

  return [
    generationType === "edit"
      ? `Edit the existing ${roomPhrase} image according to the user brief.`
      : `Photorealistic ${roomPhrase}.`,

    coreIdea ? `User brief, highest priority: ${coreIdea}.` : "",

    `Room type: ${roomPhrase}.`,
    `Design style: ${stylePhrase}.`,
    `Lighting and atmosphere: ${moodPhrase}.`,
    `Camera and composition: ${cameraPhrase}.`,
    `Keep the room spatially believable, realistic in scale, and visually coherent.`,
    `Respect all requested objects, people, animals, mess, condition, mood, and layout from the user brief.`,
    `Avoid text, watermark, logo, distorted faces, extra limbs, and unrelated objects.`,
  ]
    .filter(Boolean)
    .join(" ");
}

function getMoodPrompt(mood?: string): string {
  const selectedMood = cleanPromptPart(mood);
  const value = selectedMood.toLowerCase();

  if (value.includes("warm")) {
    return "warm ambient lighting, soft shadows, natural cozy glow";
  }

  if (value.includes("bright")) {
    return "bright airy lighting, clean soft daylight, low harshness";
  }

  if (value.includes("cozy")) {
    return "cozy intimate lighting, warm practical lamps, gentle shadows";
  }

  if (value.includes("dark")) {
    return "dark moody lighting, low-key shadows, cinematic but still realistic";
  }

  if (value.includes("natural")) {
    return "natural daylight, realistic window light, soft architectural shadows";
  }

  if (selectedMood && selectedMood !== "Other") {
    return selectedMood;
  }

  return "realistic balanced lighting";
}

function getCameraPrompt(cameraView?: string): string {
  const selectedCameraView = cleanPromptPart(cameraView);
  const value = selectedCameraView.toLowerCase();

  if (value.includes("wide")) {
    return "wide angle room view, showing most of the room clearly";
  }

  if (value.includes("corner")) {
    return "corner view, diagonal perspective showing depth and layout";
  }

  if (value.includes("top")) {
    return "top-down overhead layout view, plan-like composition";
  }

  if (value.includes("straight")) {
    return "straight-on front-facing view, balanced composition";
  }

  if (value.includes("close")) {
    return "close-up detail view, focused on materials, decor, and objects";
  }

  if (selectedCameraView && selectedCameraView !== "Other") {
    return selectedCameraView;
  }

  return "professional interior photography composition";
}

function extensionFromImageContentType(contentType: string): "jpg" | "png" | "webp" {
  if (contentType.includes("image/png")) return "png";
  if (contentType.includes("image/webp")) return "webp";
  return "jpg";
}

export {
  buildPollinationsImageUrl,
  buildInteriorPrompt,
  getMoodPrompt,
  getCameraPrompt,
  extensionFromImageContentType,
  cleanPromptPart
};
