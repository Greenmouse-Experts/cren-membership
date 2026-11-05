import { ArrowUpRight } from "lucide-react";

const ADDRESS = "Bright Star Plaza, 50 Ebiu Ukuwe Street, Jabi, Abuja, Nigeria";
const MAP_SRC = `https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&z=15&output=embed`;
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ADDRESS)}`;

export default function ContactMap() {
  return (
    <section className="bg-[#f2f9e6]">
      <div className="container mx-auto px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-balance text-[clamp(2.2rem,4.2vw,3.2rem)] font-semibold leading-[1.06] tracking-[-0.035em] text-[#075b2f]">
              Find us in Abuja.
            </h2>
            <p className="mt-3 text-[0.84rem] leading-[1.7] text-[#5f6b62] sm:text-[0.9rem]">
              Bright Star Plaza, 50 Ebiu Ukuwe Street, Jabi, Abuja, Nigeria
            </p>
          </div>

          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex h-11 shrink-0 items-center justify-center gap-2.5 self-start rounded-lg bg-[#084c2a] px-5 text-[0.76rem] font-semibold text-white transition-colors duration-200 hover:bg-[#063a20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#075b2f] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f2f9e6] sm:self-auto"
          >
            Get Directions
            <ArrowUpRight
              aria-hidden="true"
              className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              strokeWidth={2.4}
            />
          </a>
        </div>

        <div className="relative mt-8 overflow-hidden rounded-lg">
          <iframe
            src={MAP_SRC}
            title="Map showing Bright Star Plaza, Jabi, Abuja"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[320px] w-full border-0 sm:h-[380px]"
          />

          <div className="pointer-events-none absolute left-3 top-3 max-w-[235px] rounded-md bg-white p-4 shadow-[0_18px_35px_-22px_rgba(7,40,22,0.55)] sm:left-4 sm:top-4">
            <h3 className="text-[0.86rem] font-bold text-[#17241c]">Bright Star Plaza</h3>
            <p className="mt-1 text-[0.68rem] leading-[1.5] text-[#5f6b62]">
              50 Ebiu Ukuwe Street, Jabi, Abuja
              <br />
              900108, Federal Capital Territory, Nigeria
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
