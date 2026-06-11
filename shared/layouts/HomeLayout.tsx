"use client";

import PreviewCard from "@/features/main-canvas/components/PreviewCard";
import PromptForm from "@/features/prompt-studio/components/PromptForm";
import {
  CameraView,
  InteriorStyle,
  MoodLighting,
  RoomType,
} from "@/features/prompt-studio/types/prompt.types";
import IdentitySettings from "@/features/workspace/components/IdentitySettings";
import PersonalGallery from "@/features/workspace/components/PersonalGallery";
import { readApiResponse } from "@/helpers/functions";
import Container from "@/shared/components/container";
import { GenerationImage } from "@/types/database";
import { useState } from "react";

export default function Home() {  
  const [roomType, setRoomType] = useState<RoomType>("Bedroom");
  const [style, setStyle] = useState<InteriorStyle>("Japandi");
  const [mood, setMood] = useState<MoodLighting>("Warm");
  const [cameraView, setCameraView] = useState<CameraView>("Wide angle");
  const [prompt, setPrompt] = useState<string>("");

  const [generationSeed, setGenerationSeed] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState<GenerationImage | null>(null);
  const [gallery, setGallery] = useState<GenerationImage[]>([]);
  
  const session = null;

  const handleGenerate = async () => {
    const payload = {
      roomType,
      style,
      mood,
      cameraView,
      prompt,
      seed: generationSeed ?? 1000,
      generationType: "generate",
    };

    console.log("Submitting generation request with payload:", payload);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });


    } catch (err) {
      console.error("Error generating image:", err);
    }
  };

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
              onSubmit={handleGenerate}
            />
          </aside>

          <section className="scroll-mt-4">
            <PreviewCard image={activeImage} />
          </section>
        </div>
        <section className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
          <div className="xl:col-span-8">
            <PersonalGallery
              images={gallery}
              selectedImageId={"1"}
              onSelectImage={() => {}}
            />
          </div>

          <div className="xl:col-span-4">
            <IdentitySettings session={session} />
          </div>
        </section>
      </main>
    </Container>
  );
}
