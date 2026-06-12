import { createUser, findUserById } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const userId = typeof body.userId === "string" ? body.userId : null;

    if (userId) {
      const existingUser = await findUserById(userId);

      if (existingUser) {
        return Response.json(existingUser);
      }
    }

    const newUser = await createUser();
    return Response.json(newUser);
  } catch (err) {
    console.error("User API failed:", err);

    return Response.json(
      {
        error: "User API failed",
        error_message:
          err instanceof Error
            ? err.message
            : "Unable to initialize your personal workspace.",
      },
      { status: 500 },
    );
  }
}
