import { useState, useEffect } from "react";
import { Image, Copy, Check, RotateCcw, Zap, Sparkles, Eye, Download, X } from "lucide-react";
import { GenerationImage } from "@/types/commons";

interface PreviewCardProps {
  image: GenerationImage | null;
  generating: boolean;
  error?: string | null;
  onReusePrompt: (img: GenerationImage) => void;
  onGenerateVariation: (img: GenerationImage) => void;
}

export default function PreviewCard({
  image,
  generating,
  error,
  onReusePrompt,
  onGenerateVariation,
}: PreviewCardProps) {
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedFinal, setCopiedFinal] = useState(false);
  const [countdown, setCountdown] = useState(1);
  const [loadingStep, setLoadingStep] = useState(0);
  const [previewImage, setPreviewImage] = useState<GenerationImage | null>(null);
  const [imageRetryToken, setImageRetryToken] = useState(0);
  
  const LOADING_STEPS = [
    {
      title: "Initializing Engine",
      detail: "Setting up sandboxed container for design iteration...",
    },
    {
      title: "Reviewing Layout",
      detail: "Analyzing room type, style, and composition...",
    },
    {
      title: "Building Prompt Details",
      detail:
        "Composing architectural materials, mood, and camera direction...",
    },
    {
      title: "Simulating lighting angles",
      detail: "Modeling light rays and shadows for specified mood...",
    },
    {
      title: "Rendering Textures",
      detail:
        "Constructing woods, stones, marble and textiles (Pollinations)...",
    },
    {
      title: "Polishing Concepts",
      detail: "Applying final realistic details, photography tone...",
    },
  ];

  useEffect(() => {
    let timerID: NodeJS.Timeout;
    if (generating) {
      setCountdown(1);
      setLoadingStep(0);
      const startTime = Date.now();

      timerID = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setCountdown(elapsed + 1);

        const step = Math.min(
          Math.floor(elapsed / 3.5),
          LOADING_STEPS.length - 1,
        );
        setLoadingStep(step);
      }, 1000);
    } else {
      setCountdown(1);
      setLoadingStep(0);
    }

    return () => {
      if (timerID) clearInterval(timerID);
    };
  }, [generating]);

  useEffect(() => {
    setImageRetryToken(0);
  }, [image?.image_url]);

  const getImageSrc = (url: string) => {
    if (!imageRetryToken) return url;
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}retry=${imageRetryToken}`;
  };

  const copyPromptText = (text: string, type: "orig" | "final") => {
    navigator.clipboard.writeText(text);
    if (type === "orig") {
      setCopiedOriginal(true);
      setTimeout(() => setCopiedOriginal(false), 2000);
    } else {
      setCopiedFinal(true);
      setTimeout(() => setCopiedFinal(false), 2000);
    }
  };

  return (
    <div
      className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden text-slate-800 flex flex-col h-full"
      id="preview-card"
    >
      {/* Header */}
      <div className="border-b border-slate-100 p-4 shrink-0 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-750 uppercase tracking-wider flex items-center gap-2">
          <Image className="w-4 h-4 text-indigo-600" /> Design Canvas
        </h3>
        {generating && (
          <span className="text-[10px] bg-indigo-50 text-indigo-700 font-mono font-bold border border-indigo-100 px-2.5 py-0.5 rounded-full animate-pulse flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 inline-block shrink-0 animate-ping"></span>
            ACTIVE: {countdown}s
          </span>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-slate-50 p-6 flex flex-col items-center justify-center min-h-[380px] relative">
        {/* State 1: Active Generating Loading Loader */}
        {generating && (
          <div
            className="space-y-6 text-center max-w-sm px-4 py-8 animate-fade-in"
            id="loading-state"
          >
            {/* Spinning/pulsing graphic */}
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-slate-200/50 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <Image className="w-8 h-8 text-indigo-500 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-bold text-slate-900 transition-opacity duration-300">
                {LOADING_STEPS[loadingStep].title}...
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed font-sans min-h-[40px]">
                {LOADING_STEPS[loadingStep].detail}
              </p>
            </div>

            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-1.5 transition-all duration-500 rounded-full"
                style={{
                  width: `${Math.min(((loadingStep + 1) / LOADING_STEPS.length) * 100, 100)}%`,
                }}
              ></div>
            </div>

            <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
              Rendering engine online. ETA 12-25s.
            </p>
          </div>
        )}

        {/* State 2: Success Completed Image State */}
        {!generating && !error && image && (
          <div className="w-full space-y-6 animate-fade-in" id="success-state">
            {/* Image Box */}
            <div className="relative group border border-slate-250 rounded-2xl overflow-hidden shadow-xl bg-slate-200 aspect-[1024/800] w-[95%] mx-auto">
              <img
                src={getImageSrc(image.image_url)}
                alt={image.prompt}
                referrerPolicy="no-referrer"
                onError={() => {
                  if (imageRetryToken < 2) {
                    setImageRetryToken((token) => token + 1);
                  }
                }}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                id="preview-generated-image"
              />
              <div className="absolute top-3 left-3 bg-slate-900/80 border border-slate-850 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] font-mono text-zinc-100">
                Model: Pollinations
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewImage(image)}
                  className="p-2 rounded-full bg-white/90 border border-slate-200 text-slate-700 shadow-sm backdrop-blur-sm hover:bg-white hover:text-indigo-700 transition-colors"
                  aria-label="Show image preview"
                  title="Show image preview"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <a
                  href={image.image_url}
                  download
                  className="p-2 rounded-full bg-white/90 border border-slate-200 text-slate-700 shadow-sm backdrop-blur-sm hover:bg-white hover:text-indigo-700 transition-colors"
                  aria-label="Download image"
                  title="Download image"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
              {typeof image.seed === "number" && (
                <div className="absolute bottom-3 right-3 bg-white/90 border border-slate-200 backdrop-blur-sm rounded-full px-3 py-1 text-[10px] font-mono font-bold text-slate-700">
                  Seed: {image.seed}
                </div>
              )}
            </div>

            {/* Action controls */}
            <div className="grid grid-cols-2 gap-3 w-[95%] mx-auto">
              <button
                onClick={() => onReusePrompt(image)}
                type="button"
                className="px-3.5 py-2.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200 rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
                id="reuse-prompt-btn"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Load to Prompt Studio
              </button>
              <button
                onClick={() => onGenerateVariation(image)}
                type="button"
                className="px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-xs font-semibold text-white rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-indigo-100"
                id="generate-variation-btn"
              >
                <Zap className="w-3.5 h-3.5 text-indigo-200" /> Tweak Image
              </button>
            </div>

            {/* Prompt details panel */}
            <div className="space-y-4 border-t border-slate-100 pt-5 text-left w-[95%] mx-auto">
              {/* Original user request */}
              <div className="space-y-1.5 bg-white border border-slate-200 rounded-xl p-3.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Your Input Context
                  </span>
                  <button
                    onClick={() => copyPromptText(image.prompt, "orig")}
                    className="text-slate-400 hover:text-indigo-600 p-1 rounded hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Copy Original Prompt"
                  >
                    {copiedOriginal ? (
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-700 font-sans leading-relaxed">
                  {image.prompt}
                </p>
              </div>

              {/* Enriched final prompt */}
              <div className="space-y-1.5 bg-indigo-50/40 border border-indigo-100 rounded-xl p-3.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-indigo-800 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-indigo-600" /> Final
                    Generation Prompt
                  </span>
                  <button
                    onClick={() => copyPromptText(image.final_prompt, "final")}
                    className="text-indigo-700 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors cursor-pointer"
                    title="Copy Enriched prompt"
                  >
                    {copiedFinal ? (
                      <Check className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-650 font-mono leading-relaxed bg-white p-2.5 rounded-lg border border-indigo-100 max-h-[140px] overflow-y-auto">
                  {image.final_prompt}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* State 3: Default/Blank placeholder */}
        {!generating && !error && !image && (
          <div
            className="text-center py-12 max-w-xs space-y-3"
            id="blank-state"
          >
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto shadow-sm">
              <Image className="w-6 h-6 text-slate-400" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-700">
                No active concept loaded
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                Fill style variables and type a room detail, then trigger
                generation to view your layout design.
              </p>
            </div>
          </div>
        )}
      </div>

      {previewImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 p-4 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2.5 rounded-lg bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50"
              aria-label="Close image preview"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={getImageSrc(previewImage.image_url)}
              alt={previewImage.prompt}
              referrerPolicy="no-referrer"
              className="max-w-[80vw] max-h-[80vh] object-contain rounded-xl shadow-2xl bg-slate-900"
            />
          </div>
        </div>
      )}
    </div>
  );
}
