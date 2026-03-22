import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useEffect, useState } from "react";
import { type GalleryImage, defaultGallery } from "../data/defaults";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function GalleryPage() {
  const [gallery] = useLocalStorage<GalleryImage[]>(
    "kanwas_gallery",
    defaultGallery,
  );
  const [lightbox, setLightbox] = useState<number | null>(null);

  const openLightbox = (idx: number) => setLightbox(idx);
  const closeLightbox = () => setLightbox(null);
  const prev = () =>
    setLightbox((i) =>
      i !== null ? (i - 1 + gallery.length) % gallery.length : null,
    );
  const next = () =>
    setLightbox((i) => (i !== null ? (i + 1) % gallery.length : null));

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  return (
    <div className="min-h-screen py-12 px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-3 text-gold">
            हमारी गैलरी
          </p>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-4">
            हमारा काम
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            हमारे द्वारा बनाई गई खूबसूरत पोशाकों की एक झलक।
          </p>
        </div>

        {/* Grid */}
        {gallery.length === 0 ? (
          <div data-ocid="gallery.empty_state" className="text-center py-20">
            <p className="text-4xl mb-4">🖼️</p>
            <p className="text-muted-foreground">अभी कोई फ़ोटो नहीं है।</p>
          </div>
        ) : (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            data-ocid="gallery.list"
          >
            {gallery.map((img, i) => (
              <button
                type="button"
                key={img.id}
                data-ocid={`gallery.item.${i + 1}`}
                onClick={() => openLightbox(i)}
                className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2"
                style={{
                  border: "1px solid oklch(var(--gold-border))",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                }}
                aria-label={`${img.caption} देखें`}
              >
                <img
                  src={img.url}
                  alt={img.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2"
                  style={{ background: "oklch(var(--background) / 0.7)" }}
                >
                  <ZoomIn className="w-8 h-8 text-gold" />
                  <span className="text-xs font-semibold text-foreground text-center px-2">
                    {img.caption}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ background: "rgba(0,0,0,0.95)" }}
          data-ocid="gallery.modal"
        >
          {/* Backdrop */}
          <button
            type="button"
            aria-label="बंद करें"
            className="absolute inset-0 w-full h-full cursor-default"
            onClick={closeLightbox}
          />

          <div className="relative max-w-4xl w-full z-10">
            <img
              src={gallery[lightbox].url}
              alt={gallery[lightbox].caption}
              className="w-full max-h-[80vh] object-contain rounded-xl"
              style={{ border: "1px solid oklch(var(--gold-border))" }}
            />
            <p className="text-center mt-3 text-sm font-semibold text-gold">
              {gallery[lightbox].caption}
            </p>

            <button
              type="button"
              onClick={closeLightbox}
              data-ocid="gallery.close_button"
              className="absolute -top-12 right-0 p-2 rounded-full transition-colors"
              style={{
                color: "oklch(var(--gold))",
                background: "oklch(var(--card))",
              }}
              aria-label="बंद करें"
            >
              <X className="w-6 h-6" />
            </button>

            {gallery.length > 1 && (
              <button
                type="button"
                onClick={prev}
                data-ocid="gallery.pagination_prev"
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all hover:scale-110"
                style={{
                  background: "oklch(var(--card) / 0.8)",
                  color: "oklch(var(--gold))",
                }}
                aria-label="पिछला"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {gallery.length > 1 && (
              <button
                type="button"
                onClick={next}
                data-ocid="gallery.pagination_next"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all hover:scale-110"
                style={{
                  background: "oklch(var(--card) / 0.8)",
                  color: "oklch(var(--gold))",
                }}
                aria-label="अगला"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
