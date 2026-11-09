import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import useGetHook from "@/app/hook/useGet";
import type { GalleryItem } from "@/types/api";

export interface GalleryImage {
  src: string;
  alt: string;
}

const galleryAlt = "CREN gallery moment";

const toGalleryImages = (items: GalleryItem[]): GalleryImage[] =>
  items
    .filter((item) => !!item.image)
    .map((item) => ({
      src: item.image as string,
      alt: item.title ?? galleryAlt,
    }));

interface PhotoGallerySectionProps {
  /** Gallery photos to render. Defaults to the public `get/galleries` endpoint. */
  images?: GalleryImage[];
  /** Section heading. */
  title?: string;
  /** Small supporting copy shown to the right of the heading. */
  description?: string;
}

/**
 * Reusable photo gallery section backed by the public gallery endpoint
 * (`get/galleries`). Clicking a thumbnail opens a lightbox with the full
 * image, navigable with arrow keys or on-screen buttons.
 */
export default function PhotoGallerySection({
  images,
  title = "Photo Gallery",
  description,
}: PhotoGallerySectionProps) {
  const galleryQuery = useGetHook<GalleryItem[]>("get/galleries");
  const galleryImages = images ?? toGalleryImages(galleryQuery.data?.data ?? []);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const showPrev = useCallback(() => {
    setLightboxIndex((current) =>
      current === null ? null : (current - 1 + galleryImages.length) % galleryImages.length,
    );
  }, [galleryImages.length]);

  const showNext = useCallback(() => {
    setLightboxIndex((current) =>
      current === null ? null : (current + 1) % galleryImages.length,
    );
  }, [galleryImages.length]);

  useEffect(() => {
    if (lightboxIndex === null) return undefined;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, closeLightbox, showPrev, showNext]);

  useEffect(() => {
    if (lightboxIndex !== null && lightboxIndex >= galleryImages.length) {
      setLightboxIndex(galleryImages.length ? galleryImages.length - 1 : null);
    }
  }, [galleryImages.length, lightboxIndex]);

  const lightboxImage = lightboxIndex === null ? null : galleryImages[lightboxIndex];

  return (
    <section className="bg-white">
      <div className="container mx-auto px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-balance text-[clamp(2rem,3.8vw,2.9rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#075b2f]">
            {title}
          </h2>
          {description && (
            <p className="max-w-[300px] pb-1 text-pretty text-[0.8rem] leading-[1.7] text-[#5f6a62] sm:max-w-[340px] sm:text-[0.84rem]">
              {description}
            </p>
          )}
        </div>

        {galleryQuery.isLoading ? (
          <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 md:gap-3 xl:grid-cols-5 lg:mt-10">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                aria-hidden="true"
                className="aspect-square animate-pulse rounded-xl bg-[#f1f5ec]"
              />
            ))}
          </div>
        ) : galleryImages.length === 0 ? (
          <p className="mt-8 text-pretty text-[0.9rem] text-[#5f6a62] lg:mt-10">
            Gallery images will appear here soon.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 md:gap-3 xl:grid-cols-5 lg:mt-10">
            {galleryImages.map((image, index) => (
            <button
              key={`${image.src}-${index}`}
              type="button"
              onClick={() => setLightboxIndex(index)}
              aria-label={`View full image: ${image.alt}`}
              className="group overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075b2f] focus-visible:ring-offset-2"
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.05]"
              />
            </button>
          ))}
          </div>
        )}
      </div>

      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image viewer"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            type="button"
            aria-label="Close viewer"
            onClick={closeLightbox}
            className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X aria-hidden="true" className="size-5" />
          </button>

          {galleryImages.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrev();
                }}
                className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 lg:left-6"
              >
                <ChevronLeft aria-hidden="true" className="size-6" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 lg:right-6"
              >
                <ChevronRight aria-hidden="true" className="size-6" />
              </button>
            </>
          )}

          <figure
            className="max-h-full max-w-full animate-in"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              className="max-h-[82vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
            />
            <figcaption className="mt-4 text-center text-[0.82rem] text-white/85">
              {lightboxImage.alt}
              <span className="ml-2 text-white/60">
                {lightboxIndex === null ? "" : `${lightboxIndex + 1} / ${galleryImages.length}`}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
