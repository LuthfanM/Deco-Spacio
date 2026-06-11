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

export { buildPollinationsImageUrl };
