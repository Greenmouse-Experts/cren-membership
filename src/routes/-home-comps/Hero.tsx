import type { ReactNode } from "react";

interface HeroProps {
  heroContent: ReactNode;
  imgSrc: string;
}

export default function Hero({ heroContent, imgSrc }: HeroProps) {
  return (
    <section className="relative isolate flex min-h-[620px] items-center overflow-hidden bg-[#1b241e] lg:min-h-[720px]">
      <img
        src={imgSrc}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(9, 22, 12, 0.74) 0%, rgba(9, 22, 12, 0.5) 38%, rgba(9, 22, 12, 0.18) 68%, rgba(9, 22, 12, 0.04) 100%)",
        }}
      />

      <div className="mx-auto w-full max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        {heroContent}
      </div>
    </section>
  );
}
