import { NextRequest, NextResponse } from "next/server";
import { listCompletedImagesByUser } from "@/lib/store.local";

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 },
      );
    }

    const userImages = await listCompletedImagesByUser(userId);

    return NextResponse.json(userImages);
  } catch (error: unknown) {
    console.error("Images API failed:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unable to load your saved gallery.";

    return NextResponse.json(
      {
        error: "Images API failed",
        error_message: errorMessage,
      },
      { status: 500 },
    );
  }
}
