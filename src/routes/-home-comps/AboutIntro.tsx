import { ArrowUpRight } from "lucide-react";

export default function AboutIntro() {
  return (
    <section id="about" className="relative isolate flex items-center overflow-hidden bg-[#f7f9f7]">
      <img
        src="/assets/Hero2-bg.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute -z-10 inset-0 max-w-none opacity-30"
      />

      <div className="mx-auto grid w-full   items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24 container">
        <div className="max-w-[640px]">
          <h2 className="text-balance text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.03] tracking-[-0.04em] text-[#075b2f]">
            Bringing Nigeria&apos;s clean energy voices together.
          </h2>
          <p className="mt-7 max-w-[600px] text-pretty text-[0.95rem] leading-[1.75] text-[#657068] sm:text-[1.02rem]">
            The Council for Renewable Energy Nigeria (CREN) is a not-for-profit professional body
            that brings together government, academia, industry, finance, civil society and
            end-users to advance renewable energy development in Nigeria.
          </p>
          <a
            href="#our-work"
            className="group mt-8 inline-flex h-11 items-center justify-center gap-3 bg-[#084c2a] px-5 text-[0.76rem] font-medium text-white transition-colors duration-200 hover:bg-[#063a20] focus-visible:bg-[#063a20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
            style={{
              clipPath:
                "polygon(9px 0, calc(100% - 9px) 0, 100% 9px, 100% calc(100% - 9px), calc(100% - 9px) 100%, 9px 100%, 0 calc(100% - 9px), 0 9px)",
            }}
          >
            Learn More About CREN
            <ArrowUpRight
              aria-hidden="true"
              className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              strokeWidth={2.2}
            />
          </a>
        </div>

        <div className="relative">
          <img
            src="/home_page/section_1.png"
            alt="Renewable energy technicians working on an offshore wind turbine"
            loading="lazy"
            className=" w-full object-contain"
          />
        </div>
      </div>
    </section>
  );
}
