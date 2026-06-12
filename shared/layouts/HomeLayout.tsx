"use client";
import { useEffect, useRef, useState } from "react";
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
import { isNonJsonResponse, readApiResponse } from "@/helpers/functions";
import Container from "@/shared/components/container";
import { GenerationImage, UserSession } from "@/types/database";
import { RefreshCw } from "lucide-react";
import ErrorModal from "../modals/ErrorModal";

export default function Home() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);

  const [roomType, setRoomType] = useState<RoomType>("Bedroom");
  const [style, setStyle] = useState<InteriorStyle>("Japandi");
  const [mood, setMood] = useState<MoodLighting>("Warm");
  const [cameraView, setCameraView] = useState<CameraView>("Wide angle");
  const [prompt, setPrompt] = useState<string>("");
  const [parentImageId, setParentImageId] = useState<string | null>(null);
  const [generationSeed, setGenerationSeed] = useState<number | null>(null);

  const [activeImage, setActiveImage] = useState<GenerationImage | null>(null);
  const [generating, setGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [tweakSnapshot, setTweakSnapshot] = useState<TweakSnapshot | null>(
    null,
  );
  const promptStudioRef = useRef<HTMLElement | null>(null);
  const designCanvasRef = useRef<HTMLElement | null>(null);

  // Gallery board state
  const [gallery, setGallery] = useState<GenerationImage[]>([]);

  const showError = (error: unknown, fallback: string) => {
    const message = error instanceof Error ? error.message : fallback;
    setGenerationError(message || fallback);
  };

  useEffect(() => {
    async function initSession() {
      try {
        const storedId = localStorage.getItem("deco_spacio_user_id");
        const res = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: storedId || undefined }),
        });

        console.log("response from /api/user:", res);

        if (res.ok) {
          const data = await readApiResponse<UserSession>(res);
          if (isNonJsonResponse(data)) {
            setGenerationError(data.error_message);
            return;
          }
          setSession(data);
          localStorage.setItem("deco_spacio_user_id", data.user_id);
          // Load existing gallery
          fetchGallery(data.user_id);
        }
      } catch (err) {
        console.error("Workspace configuration error:", err);
        showError(err, "Unable to initialize your personal workspace.");
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

        //show first index for first
        if (images.length > 0 && !activeImage) {
          setActiveImage(images[0]);
        }
      }
    } catch (err) {
      console.error("Gallery acquisition error:", err);
      showError(err, "Unable to load your saved gallery.");
    }
  };

  const handleGenerate = async () => {
    if (!session) return;

    setGenerating(true);
    setGenerationError(null);
    setActiveImage(null);
    setStatusMessage(null);

    const payload = {
      userId: session.user_id,
      roomType,
      style,
      mood,
      cameraView,
      prompt,
      seed: generationSeed ?? undefined,
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

      if (isNonJsonResponse(data)) {
        setGenerationError(data.error_message);
        return;
      }

      if (!res.ok) {
        setGenerationError(
          data.error_message ||
            data.err ||
            "Server processed generation error.",
        );
        return;
      }

      setActiveImage(data);
      // Prepend to gallery
      setGallery((prev) => [data, ...prev]);

      setParentImageId(null);
      setGenerationSeed(null);
    } catch (err) {
      console.error("Error generating image:", err);
    } finally {
      setGenerating(false);
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

      <ErrorModal
        open={Boolean(generationError)}
        message={generationError}
        onClose={() => setGenerationError(null)}
      />
    </Container>
  );
}
