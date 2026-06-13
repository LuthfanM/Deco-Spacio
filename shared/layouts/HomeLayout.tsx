"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import PreviewCard from "@/features/main-canvas/components/PreviewCard";
import PromptForm from "@/features/prompt-studio/components/PromptForm";
import IdentitySettings from "@/features/workspace/components/IdentitySettings";
import PersonalGallery from "@/features/workspace/components/PersonalGallery";
import {
  inferSavedControls,
  isNonJsonResponse,
  readApiResponse,
} from "@/helpers/functions";
import Container from "@/shared/components/Container";
import {
  CameraView,
  GenerationImage,
  InteriorStyle,
  MoodLighting,
  RoomType,
  TweakSnapshot,
  UserSession,
} from "@/types/commons";
import { RefreshCw } from "lucide-react";
import ErrorModal from "../modals/ErrorModal";

type ApiErrorResponse = {
  error?: string;
  error_message?: string;
};

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

  const readErrorMessage = async (
    res: Response,
    fallback: string,
  ): Promise<string> => {
    const data = await readApiResponse<ApiErrorResponse>(res);

    if (isNonJsonResponse(data)) {
      return data.error_message;
    }

    return data.error_message || data.error || fallback;
  };

  const fetchGallery = useCallback(async (userId: string) => {
    try {
      const res = await fetch(`/api/images?userId=${userId}`);

      if (res.ok) {
        const images = await readApiResponse<GenerationImage[]>(res);
        if (isNonJsonResponse(images)) {
          setGenerationError(images.error_message);
          return;
        }
        setGallery(images);

        //show first index for first
        if (images.length > 0) {
          setActiveImage((currentImage) => currentImage || images[0]);
        }
      }
    } catch (err) {
      console.error("Gallery acquisition error:", err);
      showError(err, "Unable to load your saved gallery.");
    }
  }, []);

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

        const fallback = "Unable to initialize your personal workspace.";

        if (!res.ok) {
          setGenerationError(await readErrorMessage(res, fallback));
          return;
        }

        const data = await readApiResponse<UserSession>(res);
        if (isNonJsonResponse(data)) {
          setGenerationError(data.error_message);
          return;
        }
        setSession(data);
        localStorage.setItem("deco_spacio_user_id", data.user_id);
        // Load existing gallery
        fetchGallery(data.user_id);
      } catch (err) {
        console.error("Workspace configuration error:", err);
        showError(err, "Unable to initialize your personal workspace.");
      } finally {
        setSessionLoading(false);
      }
    }
    initSession();
  }, [fetchGallery]);

  const handleResetSession = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear your local session and start a new anonymous phase? Your current generated items will be archived and inaccessible without your Recovery Key.",
      )
    ) {
      return;
    }
    setSessionLoading(true);
    localStorage.removeItem("deco_spacio_user_id");
    setGallery([]);
    setActiveImage(null);
    setGenerationError(null);
    setPrompt("");
    setRoomType("Bedroom");
    setStyle("Japandi");
    setMood("Warm");
    setCameraView("Wide angle");
    setParentImageId(null);
    setGenerationSeed(null);
    setTweakSnapshot(null);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const fallback = "Unable to start a new workspace session.";

      if (!res.ok) {
        setGenerationError(await readErrorMessage(res, fallback));
        return;
      }

      const data = await readApiResponse<UserSession>(res);
      if (isNonJsonResponse(data)) {
        setGenerationError(data.error_message);
        return;
      }
      setSession(data);
      localStorage.setItem("deco_spacio_user_id", data.user_id);
    } catch (err) {
      console.error("New workspace allocation error:", err);
      showError(err, "Unable to start a new workspace session.");
    } finally {
      setSessionLoading(false);
    }
  };

  const handleRestoreGallery = async (
    recoveryKey: string,
  ): Promise<boolean> => {
    try {
      const res = await fetch("/api/user/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recoveryKey }),
      });

      const fallback = "Unable to restore your gallery.";

      if (!res.ok) {
        setGenerationError(await readErrorMessage(res, fallback));
        return false;
      }

      const data = await readApiResponse(res);
      if (isNonJsonResponse(data)) {
        setGenerationError(data.error_message);
        return false;
      }
      const updatedSession: UserSession = {
        user_id: data.userId,
        recovery_key: data.recoveryKey,
        created_at: new Date().toISOString(),
      };
      setSession(updatedSession);
      localStorage.setItem("deco_spacio_user_id", data.userId);

      fetchGallery(data.userId);
      return true;
    } catch (err) {
      console.error("Restoration submission error:", err);
      showError(err, "Unable to restore your gallery.");
    }
    return false;
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
      parentImageId: parentImageId || undefined,
      seed: generationSeed ?? undefined,
      generationType: tweakSnapshot ? "edit" : "generate",
    };

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
      setGallery((prev) => [data, ...prev]);

      setParentImageId(null);
      setGenerationSeed(null);
      setTweakSnapshot(null);
    } catch (err) {
      console.error("Error generating image:", err);
      showError(err, "An unexpected network block happened.");
    } finally {
      setGenerating(false);
    }
  };

  const handleReusePrompt = (img: GenerationImage) => {
    const savedControls = inferSavedControls(img);

    setRoomType(savedControls.roomType);
    setPrompt(img.prompt);
    setStyle(savedControls.style);
    setMood(savedControls.mood);
    setCameraView(savedControls.cameraView);
    setParentImageId(null);
    setGenerationSeed(null);
    setTweakSnapshot(null);

    setStatusMessage(
      "Prompt details loaded back to input fields. You can edit and generate a new concept.",
    );
    promptStudioRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleGenerateVariation = (img: GenerationImage) => {
    const savedControls = inferSavedControls(img);

    setTweakSnapshot({
      prompt,
      roomType,
      style,
      mood,
      cameraView,
      parentImageId,
      generationSeed,
      activeImage,
      statusMessage,
    });

    setPrompt(img.prompt);
    setRoomType(savedControls.roomType);
    setStyle(savedControls.style);
    setMood(savedControls.mood);
    setCameraView(savedControls.cameraView);
    setParentImageId(img.id);
    setGenerationSeed(typeof img.seed === "number" ? img.seed : null);
    setActiveImage(img);
    setGenerationError(null);
    setStatusMessage(
      `Modified image ${img.id.substring(0, 8)} with its current settings and seed.`,
    );

    requestAnimationFrame(() => {
      promptStudioRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  const handleCancelTweak = () => {
    if (!tweakSnapshot) return;
    setPrompt(tweakSnapshot.prompt);
    setRoomType(tweakSnapshot.roomType);
    setStyle(tweakSnapshot.style);
    setMood(tweakSnapshot.mood);
    setCameraView(tweakSnapshot.cameraView);
    setParentImageId(tweakSnapshot.parentImageId);
    setGenerationSeed(tweakSnapshot.generationSeed);
    setActiveImage(tweakSnapshot.activeImage);
    setStatusMessage(tweakSnapshot.statusMessage);
    setTweakSnapshot(null);
  };

  const handleSelectImage = (img: GenerationImage) => {
    setActiveImage(img);
    setGenerationError(null);
    designCanvasRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
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
          {tweakSnapshot && (
            <div className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-[1px] pointer-events-none" />
          )}
          <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-4 items-start">
            {/* SIDEBAR: Prompt Studio */}
            <aside
              ref={promptStudioRef}
              className={`scroll-mt-4 ${tweakSnapshot ? "relative z-40" : ""}`}
            >
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
                onSubmit={handleGenerate}
                generating={generating}
                parentImageId={parentImageId}
                generationSeed={generationSeed}
                tweakMode={Boolean(tweakSnapshot)}
                onClearParentReference={() => {
                  setParentImageId(null);
                  setGenerationSeed(null);
                  setTweakSnapshot(null);
                }}
                onCancelTweak={handleCancelTweak}
              />
            </aside>

            <section ref={designCanvasRef} className="scroll-mt-4">
              <PreviewCard
                image={activeImage}
                generating={generating}
                error={null}
                onReusePrompt={handleReusePrompt}
                onGenerateVariation={handleGenerateVariation}
              />
            </section>
          </div>

          <section className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-start">
            <div className="xl:col-span-8">
              <PersonalGallery
                images={gallery}
                selectedImageId={activeImage?.id || null}
                onSelectImage={handleSelectImage}
              />
            </div>

            <div className="xl:col-span-4">
              <IdentitySettings
                session={session}
                onRestore={handleRestoreGallery}
                onResetSession={handleResetSession}
                statusMessage={statusMessage}
                setStatusMessage={setStatusMessage}
              />
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
