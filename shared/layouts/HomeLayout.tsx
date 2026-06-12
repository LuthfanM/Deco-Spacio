"use client";
import { useEffect, useState } from "react";
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
import { GenerationImage, UserSession } from "@/types/database";
import { RefreshCw } from "lucide-react";

export default function Home() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  const [roomType, setRoomType] = useState<RoomType>("Bedroom");
  const [style, setStyle] = useState<InteriorStyle>("Japandi");
  const [mood, setMood] = useState<MoodLighting>("Warm");
  const [cameraView, setCameraView] = useState<CameraView>("Wide angle");
  const [prompt, setPrompt] = useState<string>("");

  const [generationSeed, setGenerationSeed] = useState<number | null>(null);
  const [activeImage, setActiveImage] = useState<GenerationImage | null>(null);
  const [gallery, setGallery] = useState<GenerationImage[]>([]);

  useEffect(() => {
    async function initSession() {
      try {
        const storedId = localStorage.getItem("room_muse_user_id");
        const res = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: storedId || undefined }),
        });

        console.log("response from /api/user:", res);

        if (res.ok) {
          const data = await readApiResponse<UserSession>(res);
          setSession(data);
          localStorage.setItem("room_muse_user_id", data.user_id);
          // Load existing gallery
          fetchGallery(data.user_id);
        }
      } catch (err) {
        console.error("Workspace configuration error:", err);
      } finally {
        setSessionLoading(false);
      }
    }
    initSession();
  }, []);

  const fetchGallery = async (userId: string) => {
    try {
      const res = await fetch(`/api/images?userId=${userId}`);
      if (res.ok) {
        const images = await readApiResponse<GenerationImage[]>(res);
      
        setGallery(images);
        // Default first image as active if none is loaded yet
        if (images.length > 0 && !activeImage) {
          setActiveImage(images[0]);
        }
      }
    } catch (err) {
      console.error("Gallery acquisition error:", err);
      
    }
  };

  const handleGenerate = async () => {
    if (!session) return;

    const payload = {
      userId: session.user_id,
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

      const data = await readApiResponse(res);
      setActiveImage(data);
      // Prepend to gallery
      setGallery((prev) => [data, ...prev]);

    } catch (err) {
      console.error("Error generating image:", err);
    }
  };

  return (
    <Container>
      {sessionLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 bg-slate-50">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-xs text-slate-500 font-mono">
            Initializing personal studio workspace...
          </p>
        </div>
      ) : (
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
      )}
    </Container>
  );
}
