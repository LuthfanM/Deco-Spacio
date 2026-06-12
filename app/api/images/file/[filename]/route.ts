import fs from "fs";
import path from "path";
import { getImagesDirPath } from "@/lib/db";

function detectImageContentType(buffer: Buffer): string {
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return "image/jpeg";
  }

  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png";
  }

  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }

  return "application/octet-stream";
}

type RouteContext = {
  params: Promise<{
    filename: string;
  }>;
};

export async function GET(_req: Request, context: RouteContext) {
  const { filename } = await context.params;
  const imagesDir = getImagesDirPath();
  const safeFilename = path.basename(filename || "");
  const filepath = path.join(imagesDir, safeFilename);

  if (!filepath.startsWith(imagesDir)) {
    return Response.json({ error: "Access denied" }, { status: 403 });
  }

  if (!fs.existsSync(filepath)) {
    return new Response("Design concept image not found", { status: 404 });
  }

  const fileContent = fs.readFileSync(filepath);
  const contentType = detectImageContentType(fileContent);

  return new Response(fileContent, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(fileContent.length),
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function HEAD(_req: Request, context: RouteContext) {
  const { filename } = await context.params;
  const imagesDir = getImagesDirPath();
  const safeFilename = path.basename(filename || "");
  const filepath = path.join(imagesDir, safeFilename);

  if (!filepath.startsWith(imagesDir)) {
    return new Response(null, { status: 403 });
  }

  if (!fs.existsSync(filepath)) {
    return new Response(null, { status: 404 });
  }

  const fileContent = fs.readFileSync(filepath);
  const contentType = detectImageContentType(fileContent);

  return new Response(null, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(fileContent.length),
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
