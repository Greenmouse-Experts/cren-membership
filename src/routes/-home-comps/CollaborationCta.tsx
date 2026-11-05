import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

export default function CollaborationCta({
  bgSrc = "/about-us/section_3_bg.png",
}: {
  bgSrc?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[#f7faf6]">
      <img
        src="/assets/Hero4-bg.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-80"
      />

      <div className="container mx-auto px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="relative isolate mx-auto max-w-[830px] overflow-hidden rounded-[1.75rem] bg-[#0b4b2b] px-6 py-14 text-center shadow-[0_40px_80px_-40px_rgba(6,58,32,0.6)] sm:px-10 sm:py-16 lg:py-20">
          <img
            src={bgSrc}
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover"
          />

          <h2 className="mx-auto max-w-[520px] text-balance text-[clamp(2.1rem,4.2vw,3.3rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-white">
            Progress begins with collaboration.
          </h2>
          <p className="mx-auto mt-5 max-w-[460px] text-pretty text-[0.8rem] leading-[1.7] text-white/85 sm:text-[0.86rem]">
            Connect with the Council for Renewable Energy Nigeria on clean energy policy, skills,
            financing, standards and awareness.
          </p>
          <Link
            to="/home/contact-us"
            className="group mt-8 inline-flex h-10 items-center justify-center gap-2.5 rounded-md bg-[#9bd64e] px-5 text-[0.74rem] font-semibold text-[#083d23] transition-colors duration-200 hover:bg-[#aae267] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b4b2b]"
          >
            Contact CREN
            <ArrowUpRight
              aria-hidden="true"
              className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              strokeWidth={2.4}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
