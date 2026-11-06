import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

const chamfer = {
  clipPath:
    "polygon(24px 0, calc(100% - 24px) 0, 100% 24px, 100% calc(100% - 24px), calc(100% - 24px) 100%, 24px 100%, 0 calc(100% - 24px), 0 24px)",
};

const buttonChamfer = {
  clipPath:
    "polygon(11px 0, calc(100% - 11px) 0, 100% 11px, 100% calc(100% - 11px), calc(100% - 11px) 100%, 11px 100%, 0 calc(100% - 11px), 0 11px)",
};

interface PolicyCtaProps {
  title?: string;
  subtitle?: string;
}

/**
 * Dark-green full-width call-to-action band, closing the policies page.
 */
export default function PolicyCta({
  title = "Have a question about these policies?",
  subtitle = "Get in touch with the Council for Renewable Energy Nigeria.",
}: PolicyCtaProps) {
  return (
    <section className="relative isolate bg-white">
      <div
        className="relative isolate flex min-h-[220px] flex-col justify-center gap-7 bg-[#0b4b2b] px-6 py-12 sm:flex-row sm:items-center sm:justify-between sm:gap-10 sm:px-14 sm:py-14 lg:px-20"
        style={chamfer}
      >
        <div>
          <h2 className="max-w-[640px] text-balance text-[clamp(1.7rem,3.2vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-white">
            {title}
          </h2>
          <p className="mt-3 text-[0.82rem] leading-[1.6] text-white/85 sm:text-[0.86rem]">
            {subtitle}
          </p>
        </div>

        <Link
          to="/home/contact-us"
          className="group inline-flex h-12 shrink-0 items-center justify-center gap-3 bg-[#9bd64e] px-6 text-[0.8rem] font-semibold text-[#083d23] transition-colors duration-200 hover:bg-[#aae267] focus-visible:bg-[#aae267] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white sm:self-center"
          style={buttonChamfer}
        >
          Contact CREN
          <ArrowUpRight
            aria-hidden="true"
            className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={2.4}
          />
        </Link>
      </div>
    </section>
  );
}
