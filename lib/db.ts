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
