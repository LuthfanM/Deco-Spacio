import { NextRequest, NextResponse } from "next/server";
import { findUserByRecoveryKey } from "@/lib/store.local";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recoveryKey } = body;

    if (!recoveryKey) {
      return NextResponse.json(
        {
          success: false,
          error_message: "Recovery key is required.",
        },
        { status: 400 },
      );
    }

    const user = await findUserByRecoveryKey(recoveryKey);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error_message:
            "Recovery key not found. Please verify the code and try again.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      userId: user.user_id,
      recoveryKey: user.recovery_key,
    });
  } catch (error: unknown) {
    console.error("User restore API failed:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unable to restore your gallery from storage.";

    return NextResponse.json(
      {
        success: false,
        error_message: errorMessage,
      },
      { status: 500 },
    );
  }
}
