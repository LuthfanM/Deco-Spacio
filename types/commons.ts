export type KnownRoomType =
  | "Bedroom"
  | "Living Room"
  | "Kitchen"
  | "Workspace"
  | "Bathroom"
  | "Other";

export type RoomType = KnownRoomType | (string & {});

export type KnownInteriorStyle =
  | "Minimalist"
  | "Japandi"
  | "Scandinavian"
  | "Industrial"
  | "Modern Luxury"
  | "Other";

export type InteriorStyle = KnownInteriorStyle | (string & {});

export type KnownMoodLighting =
  | "Warm"
  | "Bright"
  | "Cozy"
  | "Dark"
  | "Natural"
  | "Other";

export type MoodLighting = KnownMoodLighting | (string & {});

export type KnownCameraView =
  | "Wide angle"
  | "Corner view"
  | "Top-down layout"
  | "Straight-on view"
  | "Close-up detail"
  | "Other";

export type CameraView = KnownCameraView | (string & {});

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
  room_type?: RoomType;
  interior_style?: InteriorStyle;
  mood_lighting?: MoodLighting;
  camera_view?: CameraView;
  created_at: string;
  updated_at: string;
}

export interface UserSession {
  user_id: string;
  recovery_key: string;
  created_at: string;
}

export type TweakSnapshot = {
  prompt: string;
  roomType: RoomType;
  style: InteriorStyle;
  mood: MoodLighting;
  cameraView: CameraView;
  parentImageId: string | null;
  generationSeed: number | null;
  activeImage: GenerationImage | null;
  statusMessage: string | null;
};