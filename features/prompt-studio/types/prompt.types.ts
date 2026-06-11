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