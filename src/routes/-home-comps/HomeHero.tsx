import { ArrowUpRight } from "lucide-react";

import Hero from "./Hero";
import HeroContent from "./HeroContent";

export default function HomeHero() {
  return (
    <Hero
      imgSrc="assets/Hero-bg.gif"
      heroContent={
        <HeroContent
          title={
            <>
              <span className="block">Powering Nigeria&apos;s</span>
              <span className="block text-[#97d64c]">Green Growth,</span>
              <span className="block">Inclusively.</span>
            </>
          }
          subtitle="Bringing government, industry and communities together to advance clean energy policy and a sustainable energy future for Nigeria."
          action={
            <a
              href="#our-work"
              className="group inline-flex h-12 items-center justify-center gap-3 bg-[#97d64c] px-7 text-[0.82rem] font-semibold text-[#182b1b] transition-colors duration-200 hover:bg-[#a9e65a] focus-visible:bg-[#a9e65a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
              style={{
                clipPath:
                  "polygon(9px 0, calc(100% - 9px) 0, 100% 9px, 100% calc(100% - 9px), calc(100% - 9px) 100%, 9px 100%, 0 calc(100% - 9px), 0 9px)",
              }}
            >
              Explore Our Work
              <ArrowUpRight
                aria-hidden="true"
                className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={2.2}
              />
            </a>
          }
        />
      }
    />
  );
}
