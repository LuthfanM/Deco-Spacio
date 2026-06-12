import fs from "fs";
import path from "path";

export interface GenerationImage {
  id: string;
  user_id: string;
  prompt: string;
  final_prompt: string;
  image_url: string;
  storage_path: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  error_message: string | null;
  parent_image_id: string | null;
  seed?: number;
  room_type?: string;
  interior_style?: string;
  mood_lighting?: string;
  camera_view?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  user_id: string;
  recovery_key: string;
  created_at: string;
}

export interface DBStructure {
  images: GenerationImage[];
  users: User[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const IMAGES_DIR = path.join(DATA_DIR, "images");
const DB_FILE = path.join(DATA_DIR, "db.json");

// Ensure directories exist
export function ensureDirectoriesExist() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }
}

// Load Database 
export function loadDB(): DBStructure {
  ensureDirectoriesExist();
  if (!fs.existsSync(DB_FILE)) {
    const initialDB: DBStructure = { images: [], users: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2));
    return initialDB;
  }
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading database file, resetting:", err);
    return { images: [], users: [] };
  }
}

// Save Database
export function saveDB(db: DBStructure) {
  try {
    ensureDirectoriesExist();
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error("Error writing to database file:", err);
  }
}

// ID and Recovery Key Generators
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function generateRecoveryKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const part1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const part2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `ROOM-${part1}-${part2}`;
}

export function getImagesDirPath(): string {
  return IMAGES_DIR;
}
