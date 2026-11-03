import { ShieldCheck } from "lucide-react";

const features = [
  {
    title: "Clean Energy Policy & Advocacy",
    description:
      "Advocating for practical clean energy policies and efforts to reduce greenhouse gas emissions.",
    icon: "/home_page/section_2_clean_energy.png",
  },
  {
    title: "Capacity Building & Green Jobs",
    description:
      "Promoting indigenous capacity, green skills and opportunities for green employment.",
    icon: "/home_page/section_2_capacity_building.png",
  },
  {
    title: "Renewable Energy Financing",
    description:
      "Advocating for greater access to financing for renewable energy adoption and deployment.",
    icon: "/home_page/section_2_renewable_energy.png",
  },
  {
    title: "Standards & Awareness",
    description:
      "Supporting industry standards and deeper public awareness of clean energy solutions.",
    icon: null,
  },
];

export default function OurWork() {
  return (
    <section id="our-work" className="relative isolate overflow-hidden bg-[#0b4b2b] text-white">
      <img
        src="/home_page/section_2_bg.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />

      <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[790px] text-center">
          <h2 className="text-balance text-[clamp(2rem,4.4vw,3.35rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[#96d64c]">
            Our work for a sustainable energy future.
          </h2>
          <p className="mx-auto mt-5 max-w-[610px] text-pretty text-[0.9rem] leading-[1.7] text-white/85 sm:text-[0.98rem]">
            CREN connects expertise, advocacy and collaboration to support renewable energy
            development across Nigeria.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-11 sm:grid-cols-2 sm:gap-y-14 lg:mt-16 lg:grid-cols-4 lg:gap-x-6 xl:gap-x-10">
          {features.map((feature) => (
            <article key={feature.title} className="flex flex-col items-center text-center">
              <div className="flex h-20 items-center justify-center sm:h-24">
                {feature.icon ? (
                  <img
                    src={feature.icon}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="max-h-full w-auto object-contain"
                  />
                ) : (
                  <ShieldCheck
                    aria-hidden="true"
                    className="size-20 text-white sm:size-24"
                    strokeWidth={1.1}
                  />
                )}
              </div>
              <h3 className="mt-4 max-w-[210px] text-[1rem] font-semibold leading-[1.35] text-white sm:text-[1.08rem]">
                {feature.title}
              </h3>
              <p className="mt-2 max-w-[235px] text-[0.79rem] leading-[1.65] text-white/80 sm:text-[0.84rem]">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
