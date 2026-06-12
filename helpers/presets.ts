import { RoomType, InteriorStyle, MoodLighting, CameraView } from "@/types/commons";
export interface PresetOption<T> {
  value: T;
  label: string;
  description: string;
}

export const ROOM_TYPES: PresetOption<RoomType>[] = [
  { value: "Bedroom", label: "Bedroom", description: "Private sanctuary for rest and rejuvenation" },
  { value: "Living Room", label: "Living Room", description: "Social gathering space with seating layouts" },
  { value: "Kitchen", label: "Kitchen", description: "Functional workspace, cabinetry and fittings" },
  { value: "Workspace", label: "Workspace", description: "Productive setup, desk and task lighting" },
  { value: "Bathroom", label: "Bathroom", description: "Spacious layout with contemporary fixtures" },
  { value: "Other", label: "Specify room type", description: "Custom architectural space description" }
];

export const INTERIOR_STYLES: PresetOption<InteriorStyle>[] = [
  { value: "Minimalist", label: "Minimalist", description: "Clean lines, sparse furniture, functional layouts" },
  { value: "Japandi", label: "Japandi", description: "Infuses Japanese simplicity with Scandinavian warmth" },
  { value: "Scandinavian", label: "Scandinavian", description: "Light wood tones, organic textures, functional design" },
  { value: "Industrial", label: "Industrial", description: "Exposed brick, steel framing, raw textured concrete" },
  { value: "Modern Luxury", label: "Modern Luxury", description: "Meticulous marble, gold brass detailing, velvet fabrics" },
  { value: "Other", label: "Specify style", description: "Alternative design style of your choosing" }
];

export const MOOD_LIGHTING: PresetOption<MoodLighting>[] = [
  { value: "Warm", label: "Warm & Ambient", description: "Dim setting, sunset glow, fireplace embers" },
  { value: "Bright", label: "Bright & Airy", description: "Overhead light flow, diffuse soft white" },
  { value: "Cozy", label: "Cozy & Intimate", description: "Fairy light strings, candle warmth" },
  { value: "Dark", label: "Dark & Moody", description: "Lowkey shadows, highlights, spotlight glow" },
  { value: "Natural", label: "Natural Daylight", description: "Sun beams flowing through large glass windows" },
  { value: "Other", label: "Specify mood", description: "Custom atmospheric look" }
];

export const CAMERA_VIEWS: PresetOption<CameraView>[] = [
  { value: "Wide angle", label: "Wide angle", description: "Room-spanning editorial frame" },
  { value: "Corner view", label: "Corner view", description: "Diagonal perspective from a corner" },
  { value: "Top-down layout", label: "Top-down layout", description: "Plan-like view for spatial layout" },
  { value: "Straight-on view", label: "Straight-on view", description: "Balanced front-facing composition" },
  { value: "Close-up detail", label: "Close-up detail", description: "Focused material and decor detail" },
  { value: "Other", label: "Specify camera view", description: "Custom composition prompt" }
];
