import { GenerationImage } from "@/types/commons";
import { Grid3X3, Image as ImageIcon, Sparkles, Calendar } from "lucide-react";

interface PersonalGalleryProps {
  images: GenerationImage[];
  selectedImageId: string | null;
  onSelectImage: (img: GenerationImage) => void;
}

export default function PersonalGallery({
  images,
  selectedImageId,
  onSelectImage
}: PersonalGalleryProps) {
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "Just now";
    }
  };

  return (
    <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 text-slate-800 flex flex-col h-full" id="personal-gallery">
      {/* Header section with grid info */}
      <div className="flex items-center justify-between mb-5 shrink-0 border-b border-slate-100 pb-4">
        <h3 className="text-sm font-bold tracking-wider uppercase text-slate-800 flex items-center gap-2">
          <Grid3X3 className="w-4 h-4 text-indigo-600" />
          Saved Ideas Gallery
        </h3>
        <span className="text-xs bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full text-indigo-700 font-bold">
          {images.length} Concepts
        </span>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[640px] pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-slate-50">
        {images.length === 0 ? (
          /* Blank state gallery */
          <div className="text-center py-16 px-4 space-y-3" id="gallery-empty-state">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400 shadow-sm">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-700">Your personal board is empty</p>
              <p className="text-[11px] text-slate-450 leading-relaxed max-w-[200px] mx-auto">
                Successfully generated room layout concepts will appear here as saveable design cards.
              </p>
            </div>
          </div>
        ) : (
          /* Grid list of stored cards */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-3" id="gallery-grid">
            {images.map((img) => {
              const isSelected = selectedImageId === img.id;
              return (
                <article
                  key={img.id}
                  className={`border rounded-xl overflow-hidden shadow-sm transition-all duration-300 bg-white ${
                    isSelected
                      ? "ring-2 ring-indigo-500 border-indigo-500 shadow-indigo-100"
                      : "border-slate-200 hover:border-slate-350 bg-slate-50 hover:shadow-md"
                  }`}
                  id={`gallery-item-${img.id}`}
                >
                  <button
                    type="button"
                    onClick={() => onSelectImage(img)}
                    className="aspect-square w-full bg-slate-100 overflow-hidden cursor-pointer group block text-left"
                    aria-label={`Select generated image ${img.id}`}
                  >
                    <img
                      src={img.image_url}
                      alt={img.prompt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </button>

                  <div className="p-3 space-y-3">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-700 line-clamp-2 leading-snug font-medium">
                      {img.prompt}
                      </p>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-450">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {formatDate(img.created_at)}
                        </span>
                        {img.parent_image_id && (
                          <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full px-2 py-0.5 flex items-center gap-1 font-bold">
                            <Sparkles className="w-2.5 h-2.5 text-indigo-600" /> Var
                          </span>
                        )}
                      </div>
                      {typeof img.seed === "number" && (
                        <p className="text-[10px] font-mono text-slate-400">
                          Seed: <span className="font-bold text-slate-600">{img.seed}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
