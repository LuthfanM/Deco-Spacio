"use client";

import PromptForm from "@/features/prompt-studio/components/PromptForm";
import {
  CameraView,
  InteriorStyle,
  MoodLighting,
  RoomType,
} from "@/features/prompt-studio/types/prompt.types";
import Container from "@/shared/components/Container";
import { useState } from "react";

export default function Home() {
  const [roomType, setRoomType] = useState<RoomType>("Bedroom");
  const [style, setStyle] = useState<InteriorStyle>("Japandi");
  const [mood, setMood] = useState<MoodLighting>("Warm");
  const [cameraView, setCameraView] = useState<CameraView>("Wide angle");
  const [prompt, setPrompt] = useState<string>("");

  return (
    <Container>
      <main className="flex-1 w-full px-[5%] py-3 sm:py-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-4 items-start">
          {/* SIDEBAR: Prompt Studio */}
          <aside className={`scroll-mt-4`}>
            <PromptForm
              roomType={roomType}
              setRoomType={setRoomType}
              style={style}
              setStyle={setStyle}
              mood={mood}
              setMood={setMood}
              cameraView={cameraView}
              setCameraView={setCameraView}
              prompt={prompt}
              setPrompt={setPrompt}
              parentImageId={null}
              generationSeed={null}
            />
          </aside>
        </div>
      </main>
    </Container>
  );
}
