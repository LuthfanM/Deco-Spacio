import { generateId, GenerationImage } from "@/lib/db";
import {
  createImageRecord,
  updateImageRecord,
  uploadImageToStorage,
} from "@/lib/store";
import {
  buildInteriorPrompt,
  buildPollinationsImageUrl,
  cleanPromptPart,
  extensionFromImageContentType,
} from "@/server/controllers/generateController";
import { simulateApiDelay } from "@/server/server-functions";

async function generateImageResponse(req: Request) {
  if (process.env.API_OFF === "true") {
    return Response.json(
      {
        status: "Failed",
        error_message: "Service currently not available",
      },
      {
        status: 503,
      },
    );
  }

  const body = await req.json();

  const { userId, roomType, style, mood, cameraView, parentImageId } = body;

  const prompt = cleanPromptPart(body?.prompt);

  const generationType: "generate" | "edit" =
    body?.generationType === "edit" ? "edit" : "generate";

  if (!userId) {
    return Response.json(
      {
        status: "FAILED",
        error_message: "User ID is required.",
      },
      { status: 400 },
    );
  }

  const requestedSeed = Number(body?.seed);
  const simulatedDelayMs = await simulateApiDelay();

  if (simulatedDelayMs > 0) {
    return Response.json(
      {
        status: "FAILED",
        error_message: `The AI service took too long to respond. Please try again. (Simulated API delay: ${simulatedDelayMs}ms)`,
      },
      { status: 504 },
    );
  }

  const imageId = generateId("img");
  const seed =
    Number.isFinite(requestedSeed) && requestedSeed >= 0
      ? Math.floor(requestedSeed)
      : Math.floor(Math.random() * 10000000);

  const newRecord: GenerationImage = {
    id: imageId,
    user_id: userId as string,
    prompt: prompt,
    final_prompt: "Constructing prompt...",
    image_url: "",
    storage_path: "",
    status: "PROCESSING",
    error_message: null,
    parent_image_id: parentImageId || null,
    seed,
    room_type: roomType || undefined,
    interior_style: style || undefined,
    mood_lighting: mood || undefined,
    camera_view: cameraView || undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  try {
    await createImageRecord(newRecord);

    const finalPrompt = buildInteriorPrompt(
      prompt,
      roomType,
      style,
      mood,
      cameraView,
      generationType,
    );

    console.log(`Final Pollinations Prompt: ${finalPrompt}`);

    await updateImageRecord(userId, imageId, { final_prompt: finalPrompt });

    if (!process.env.POLLINATIONS_KEY) {
      throw new Error("POLLINATIONS_KEY is missing in .env.local");
    }

    const pollinationsUrl = buildPollinationsImageUrl(finalPrompt, seed);

    const imgRes = await fetch(pollinationsUrl, {
      headers: {
        Authorization: `Bearer ${process.env.POLLINATIONS_KEY}`,
      },
    });
    const imageContentType = imgRes.headers.get("content-type") || "";
    if (!imgRes.ok) {
      const errorText = await imgRes.text().catch(() => "");
      throw new Error(
        `Pollinations failed: ${imgRes.status} ${imgRes.statusText} ${errorText}`,
      );
    }
    if (!imageContentType.startsWith("image/")) {
      const errorText = await imgRes.text().catch(() => "");
      throw new Error(
        `Pollinations returned ${imageContentType || "unknown content"} instead of an image. ${errorText}`,
      );
    }

    const arrayBuffer = await imgRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const filename = `img_${imageId}.${extensionFromImageContentType(imageContentType)}`;

    const supabaseUpload = await uploadImageToStorage({
      userId: userId as string,
      filename,
      buffer,
      contentType: imageContentType,
    });

    const completedImage = await updateImageRecord(userId, imageId, {
      status: "COMPLETED",
      image_url: supabaseUpload.imageUrl,
      storage_path: supabaseUpload.storagePath,
    });

    if (completedImage) {
      return Response.json(completedImage, { status: 200 });
    }
    {
      throw new Error(
        "Unable to locate generation tracking record in database.",
      );
    }
  } catch (err) {
    console.error("AI Generation Process failed:", err);

    try {
      await updateImageRecord(userId, imageId, {
        status: "FAILED",
        error_message:
          err instanceof Error
            ? err.message
            : "An unexpected error occurred during image generation.",
      });
    } catch (dbErr) {
      console.error("Unable to persist failed generation status:", dbErr);
    }

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

export async function POST(req: Request) {
  return generateImageResponse(req);
}
