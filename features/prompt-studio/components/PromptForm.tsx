import React, { useEffect, useRef, useState } from "react";
import { AlertTriangle, ArrowRight, Sparkles } from "lucide-react";
import {
  PresetOption,
  ROOM_TYPES,
  INTERIOR_STYLES,
  MOOD_LIGHTING,
  CAMERA_VIEWS,
} from "@/helpers/presets";
import {
  CameraView,
  InteriorStyle,
  MoodLighting,
  RoomType,
} from "@/types/commons";
import { validateImagePrompt } from "../validations/PromptValidation";

interface PromptFormProps {
  roomType: RoomType;
  setRoomType: (val: RoomType) => void;
  style: InteriorStyle;
  setStyle: (val: InteriorStyle) => void;
  mood: MoodLighting;
  setMood: (val: MoodLighting) => void;
  cameraView: CameraView;
  setCameraView: (val: CameraView) => void;
  prompt: string;
  setPrompt: (val: string) => void;
  onSubmit: () => void;
  generating: boolean;
  parentImageId: string | null;
  generationSeed: number | null;
  tweakMode: boolean;
  onClearParentReference: () => void;
  onCancelTweak: () => void;
}

export default function PromptForm({
  roomType,
  setRoomType,
  style,
  setStyle,
  mood,
  setMood,
  cameraView,
  setCameraView,
  prompt,
  setPrompt,
  onSubmit,
  generating,
  parentImageId,
  generationSeed,
  tweakMode,
  onClearParentReference,
  onCancelTweak,
}: PromptFormProps) {
  
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const customInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (errorLocal) {
      setErrorLocal(null);
    }
  }, [prompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateImagePrompt(prompt);

    if (validation.valid === false) {
      setErrorLocal(validation.message);
      return;
    }

    setErrorLocal(null);
    onSubmit();
  };

  const focusCustomInput = (id: string) => {
    requestAnimationFrame(() => {
      customInputRefs.current[id]?.focus();
    });
  };

  const renderPresetGroup = <T extends string>({
    id,
    label,
    options,
    value,
    setValue,
    gridClassName,
  }: {
    id: string;
    label: string;
    options: PresetOption<T>[];
    value: T;
    setValue: (val: T) => void;
    gridClassName: string;
  }) => {
    const presetValues = options.map((opt) => opt.value);
    const selectedPreset = presetValues.includes(value);
    const customValue = selectedPreset ? "" : value;
    const customSelected = value === "Other" || Boolean(customValue.trim());

    return (
      <div className="space-y-2">
        <label className="block text-xs font-semibold tracking-wider text-slate-700 uppercase">
          {label}
        </label>
        <div className={gridClassName}>
          {options.map((opt) => {
            const isCustomOption = opt.value === "Other";
            const isSelected = isCustomOption
              ? customSelected
              : value === opt.value;

            if (isCustomOption) {
              return (
                <div
                  key={opt.value}
                  onClick={() => {
                    if (!customValue) {
                      setValue("Other" as T);
                    }
                    focusCustomInput(id);
                  }}
                  className={`p-2.5 rounded-xl border text-xs text-left font-medium transition-all cursor-text ${
                    isSelected
                      ? "bg-indigo-50/70 border-indigo-500 text-indigo-700 shadow-sm"
                      : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-800"
                  }`}
                  title={opt.description}
                >
                  <input
                    ref={(node) => {
                      customInputRefs.current[id] = node;
                    }}
                    type="text"
                    value={customValue}
                    onFocus={() => {
                      if (!customValue) {
                        setValue("Other" as T);
                      }
                    }}
                    onChange={(e) => {
                      const nextValue = e.target.value;
                      setValue((nextValue || "Other") as T);
                    }}
                    placeholder={opt.label}
                    className="block w-full bg-transparent font-semibold text-xs text-inherit placeholder:text-slate-500 focus:outline-none"
                    disabled={generating}
                  />
                  <div className="text-[10px] text-slate-400 font-normal truncate mt-0.5">
                    {opt.description}
                  </div>
                </div>
              );
            }

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue(opt.value)}
                className={`p-2.5 rounded-xl border text-xs text-left font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-indigo-50/70 border-indigo-500 text-indigo-700 shadow-sm"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-800"
                }`}
                disabled={generating}
                title={opt.description}
              >
                <div className="font-semibold">{opt.label}</div>
                <div className="text-[10px] text-slate-400 font-normal truncate mt-0.5">
                  {opt.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-slate-200 rounded-2xl p-6 text-slate-800 space-y-6 shadow-sm"
      id="prompt-form"
    >
      <div>
        <h2 className="text-lg font-bold tracking-tight text-slate-900 mb-1 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
          Prompt Studio
        </h2>
        <p className="text-xs text-slate-500">
          Configure parameters or click a preset generator to start designing.
        </p>
      </div>

      {/* Parent Image Reference Indicator */}
      {(parentImageId || generationSeed !== null) && (
        <div
          className="bg-indigo-50 border border-indigo-100 rounded-xl p-3 flex items-center justify-between text-xs text-indigo-700"
          id="parent-ref-alert"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span>
              {tweakMode
                ? "Tweaking image"
                : "Regenerating / tweaking reference"}
              {parentImageId && (
                <>
                  {" "}
                  <strong>{parentImageId.substring(0, 10)}...</strong>
                </>
              )}
              {generationSeed !== null && (
                <>
                  {" "}
                  with seed <strong>{generationSeed}</strong>
                </>
              )}
            </span>
          </div>
          <button
            type="button"
            onClick={onClearParentReference}
            className="text-[10px] text-indigo-500 hover:text-indigo-800 underline underline-offset-2 font-mono ml-4"
          >
            Clear Ref
          </button>
        </div>
      )}

      {renderPresetGroup({
        id: "room-type",
        label: "1. Room Type",
        options: ROOM_TYPES,
        value: roomType,
        setValue: setRoomType,
        gridClassName: "grid grid-cols-2 xs:grid-cols-3 gap-2",
      })}

      {renderPresetGroup({
        id: "style-preset",
        label: "2. Style Preset",
        options: INTERIOR_STYLES,
        value: style,
        setValue: setStyle,
        gridClassName: "grid grid-cols-2 xs:grid-cols-3 gap-2",
      })}

      {renderPresetGroup({
        id: "mood-lighting",
        label: "3. Atmosphere & Light",
        options: MOOD_LIGHTING,
        value: mood,
        setValue: setMood,
        gridClassName: "grid grid-cols-2 xs:grid-cols-3 gap-2",
      })}

      {renderPresetGroup({
        id: "camera-view",
        label: "4. Camera View / Composition",
        options: CAMERA_VIEWS,
        value: cameraView,
        setValue: setCameraView,
        gridClassName: "grid grid-cols-2 xs:grid-cols-2 gap-2",
      })}

      {/* 5. Textarea Input */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-xs font-semibold tracking-wider text-slate-700 uppercase">
            5. Design Details Description
          </label>
          <span className="text-[10px] text-slate-450">
            {prompt.length} chars
          </span>
        </div>
        <textarea
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. small apartment flat, brick fireplace accents, wooden desk near a tall frame window, no plastic elements..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans"
          id="prompt-textarea"
        />
        {errorLocal && (
          <p className="text-xs text-red-700 flex items-center gap-1 mt-1 font-medium bg-red-50 border border-red-200 rounded-lg px-2.5 py-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600" />{" "}
            {errorLocal}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div
        className={`grid gap-2 ${tweakMode ? "grid-cols-[1fr_auto]" : "grid-cols-1"}`}
      >
        <button
          type="submit"
          disabled={generating}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm tracking-wide uppercase rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          id="generate-button"
        >
          <Sparkles className="w-4 h-4 text-indigo-200" />
          {generating ? "Generating Room Concept..." : "Generate Concept"}
          <ArrowRight className="w-4 h-4 text-indigo-200 ml-1" />
        </button>
        {tweakMode && (
          <button
            type="button"
            onClick={onCancelTweak}
            disabled={generating}
            className="px-4 py-4 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-bold text-xs tracking-wide uppercase rounded-xl border border-slate-200 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
