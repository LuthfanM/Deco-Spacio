import { buildPollinationsImageUrl } from "@/server/controllers/generateController";

async function generateImageResponse() {
  const seed = 12345;

  try {
    if (!process.env.POLLINATIONS_KEY) {
      throw new Error("POLLINATIONS_KEY is missing in .env.local");
    }

    const finalPrompt = "Photorealistic bedroom interior in Japandi style";
    const pollinationsUrl = buildPollinationsImageUrl(finalPrompt, seed);

    const imageResponse = await fetch(pollinationsUrl, {
      headers: {
        Authorization: `Bearer ${process.env.POLLINATIONS_KEY}`,
      },
    });

    if (!imageResponse.ok) {
      return Response.json(
        {
          status: "FAILED",
          error_message: `Image generation failed with status ${imageResponse.status}`,
        },
        { status: imageResponse.status },
      );
    }

    const contentType =
      imageResponse.headers.get("content-type") || "image/png";

    return new Response(imageResponse.body, {
      status: 200,
      headers: {
        "content-type": contentType,
      },
    });
  } catch (err) {
    console.error("AI Generation Process failed:", err);

    return Response.json(
      {
        status: "FAILED",
        error_message:
          err instanceof Error
            ? err.message
            : "Generation engine failed to yield a valid design concept. Please retry.",
      },
      { status: 500 },
    );
  }
}

export async function POST() {
  return generateImageResponse();
}
