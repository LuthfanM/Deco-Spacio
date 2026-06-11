"use client";

import { useEffect, useState } from "react";

type ApiResult =
  | { type: "image"; src: string }
  | { type: "json"; data: unknown }
  | { type: "text"; data: string };

function getImageUrlFromJson(data: unknown): string | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const record = data as Record<string, unknown>;
  const possibleUrl =
    record.image ||
    record.imageUrl ||
    record.url ||
    record.result ||
    record.output;

  return typeof possibleUrl === "string" ? possibleUrl : null;
}

export default function Home() {
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let objectUrl: string | null = null;
    const controller = new AbortController();

    async function generateImage() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/generate", {
          method: "POST",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const contentType = response.headers.get("content-type") || "";

        if (contentType.startsWith("image/")) {
          const blob = await response.blob();
          objectUrl = URL.createObjectURL(blob);
          setResult({ type: "image", src: objectUrl });
          return;
        }

        if (contentType.includes("application/json")) {
          const data = await response.json();
          const imageUrl = getImageUrlFromJson(data);

          setResult(imageUrl ? { type: "image", src: imageUrl } : { type: "json", data });
          return;
        }

        setResult({ type: "text", data: await response.text() });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError((err as Error).message || "Failed to call generate API");
        }
      } finally {
        setIsLoading(false);
      }
    }

    generateImage();

    return () => {
      controller.abort();

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 p-6 text-white">
      {isLoading && <p className="text-sm text-neutral-300">Generating image...</p>}

      {error && (
        <p className="max-w-xl rounded-md border border-red-400/30 bg-red-950/50 p-4 text-sm text-red-100">
          {error}
        </p>
      )}

      {!isLoading && !error && result?.type === "image" && (
        <img
          src={result.src}
          alt="Generated result"
          className="max-h-[90vh] max-w-full rounded-md object-contain"
        />
      )}

      {!isLoading && !error && result?.type === "json" && (
        <pre className="max-h-[90vh] max-w-4xl overflow-auto rounded-md bg-neutral-900 p-4 text-sm text-neutral-100">
          {JSON.stringify(result.data, null, 2)}
        </pre>
      )}

      {!isLoading && !error && result?.type === "text" && (
        <pre className="max-h-[90vh] max-w-4xl overflow-auto rounded-md bg-neutral-900 p-4 text-sm text-neutral-100">
          {result.data}
        </pre>
      )}
    </main>
  );
}
