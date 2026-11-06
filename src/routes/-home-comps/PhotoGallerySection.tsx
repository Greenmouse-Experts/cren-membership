export interface GalleryImage {
  src: string;
  alt: string;
}

const galleryAlt = "Moment from the National Solar Energy Conference & Exhibition 2026";

const defaultImages: GalleryImage[] = Array.from({ length: 14 }, (_, index) => ({
  src: `/events/photo_gallery_img_${index + 1}.png`,
  alt: galleryAlt,
}));

interface PhotoGallerySectionProps {
  /** Gallery photos to render. Defaults to the events photo gallery. */
  images?: GalleryImage[];
  /** Section heading. */
  title?: string;
  /** Small supporting copy shown to the right of the heading. */
  description?: string;
}

/**
 * Reusable photo gallery section: a heading row plus a responsive
 * square-thumbnail grid.
 */
export default function PhotoGallerySection({
  images = defaultImages,
  title = "Photo Gallery",
  description,
}: PhotoGallerySectionProps) {
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

        <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 md:gap-3 xl:grid-cols-5 lg:mt-10">
          {images.map((image, index) => (
            <img
              key={image.src ?? index}
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="aspect-square w-full rounded-xl object-cover"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
