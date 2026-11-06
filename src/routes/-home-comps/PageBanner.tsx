import type { ReactNode } from "react";

/** Subtle pointy-top hexagon tiling used as the banner backdrop. */
const hexPattern = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="225.2" height="390" viewBox="0 0 225.2 390"><g fill="none" stroke="#ffffff" stroke-width="2" stroke-opacity="0.05"><polygon points="112.6,0 225.2,65 225.2,195 112.6,260 0,195 0,65"/><polygon points="0,195 112.6,260 112.6,390 0,455 -112.6,390 -112.6,260"/><polygon points="225.2,195 337.8,260 337.8,390 225.2,455 112.6,390 112.6,260"/></g><g fill="#ffffff" fill-opacity="0.03"><polygon points="112.6,390 225.2,455 225.2,585 112.6,650 0,585 0,455"/></g></svg>`,
);

interface PageBannerProps {
  title: ReactNode;
  /** Small supporting copy shown to the right of the title. */
  description?: string;
}

/**
 * Reusable flat dark-green page banner with a hexagon backdrop.
 * Used as the compact hero on inner public pages.
 */
export default function PageBanner({ title, description }: PageBannerProps) {
  return (
    <section
      className="relative isolate overflow-hidden bg-[#1d4430] pt-12"
      // style={{
      //   backgroundImage: `url("data:image/svg+xml,${hexPattern}")`,
      //   backgroundSize: "340px 588px",
      // }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: "url(/green_bg.png)",
        }}
      />

      <div className="container mx-auto px-5 pb-14 pt-16 sm:px-8 sm:pb-16 sm:pt-20 lg:px-10 lg:pb-[4.5rem] lg:pt-24">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-balance text-[clamp(2.6rem,5.4vw,4.6rem)] font-semibold leading-[1.04] tracking-[-0.04em] text-white">
            {title}
          </h1>
          {description && (
            <p className="max-w-[300px] shrink-0 text-pretty text-[0.82rem] leading-[1.7] text-white/90 sm:pb-2 sm:text-right sm:text-[0.86rem]">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
