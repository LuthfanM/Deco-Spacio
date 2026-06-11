export interface GenerationImage {
  id: string;
  user_id: string;
  prompt: string;
  final_prompt: string;
  image_url: string;
  storage_path: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  error_message: string | null;
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