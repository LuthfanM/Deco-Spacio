import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { getImagesDirPath } from "@/lib/db";

function detectImageContentType(buffer: Buffer): string {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { filename } = req.query;
  const IMAGES_DIR = getImagesDirPath();
  const safeFilename = path.basename(Array.isArray(filename) ? filename[0] : filename || "");
  const filepath = path.join(IMAGES_DIR, safeFilename);

  // Prevent directory traversal attacks
  if (!filepath.startsWith(IMAGES_DIR)) {
    return res.status(403).json({ error: "Access denied" });
  }

  if (fs.existsSync(filepath)) {
    const fileContent = fs.readFileSync(filepath);
    const contentType = detectImageContentType(fileContent);
    res.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": String(fileContent.length),
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    res.end(fileContent);
  } else {
    res.status(404).send("Design concept image not found");
  }
}
