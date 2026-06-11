"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Download,
  Eye,
  Image as ImageIcon,
  Sparkles,
  X,
} from "lucide-react";
import type { GenerationImage } from "@/types/database";

interface PreviewCardProps {
  image: GenerationImage | null;
}

export default function PreviewCard({ image }: PreviewCardProps) {
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedFinal, setCopiedFinal] = useState(false);
  const [previewImage, setPreviewImage] = useState<GenerationImage | null>(
    null,
  );
  const [imageRetryToken, setImageRetryToken] = useState(0);

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
          <ImageIcon className="w-4 h-4 text-indigo-600" /> Design Canvas
        </h3>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-slate-50 p-6 flex flex-col items-center justify-center min-h-[380px] relative">
        {/* State 1: Success Completed Image State */}
        {image && (
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

        {/* State 2: Default/Blank placeholder */}
        {!image && (
          <div
            className="text-center py-12 max-w-xs space-y-3"
            id="blank-state"
          >
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mx-auto shadow-sm">
              <ImageIcon className="w-6 h-6 text-slate-400" />
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
