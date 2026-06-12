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
  } catch (error: any) {
    console.error("Images API failed:", error);

    return NextResponse.json(
      {
        error: "Images API failed",
        error_message: error?.message || "Unable to load your saved gallery.",
      },
      { status: 500 },
    );
  }
}