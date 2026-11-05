const actions = [
  {
    title: "Maiden Energy Awards",
    body: "CREN's Maiden Energy Awards were held at Sheraton in 2021.",
    icon: "/our-work/section_3_maiden_energy.png",
  },
  {
    title: "Solar PV Training",
    body: "Free solar PV training for returnees, and for youths and women in the Niger Delta.",
    icon: "/our-work/section_3_solar_pv.png",
  },
  {
    title: "Local Battery Storage",
    body: "Advocacy for local battery storage manufacturing as part of Nigeria's clean energy development.",
    icon: "/our-work/section_3_local_battery.png",
  },
  {
    title: "20 Million Green Jobs Agenda",
    body: "CREN's agenda sets a goal of 20 million green jobs to support a greener Nigerian economy.",
    icon: "/our-work/section_3_25_million.png",
  },
];

const cardShape = {
  clipPath:
    "polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)",
};

export default function OurWorkActions() {
  return (
    <section className="relative isolate overflow-hidden border-b border-black/5 bg-[#f7faf6]">
      <img
        src="/assets/Hero4-bg.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full -scale-x-100 object-cover opacity-70"
      />

      <div className="container mx-auto px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[600px] text-center">
          <h2 className="text-balance text-[clamp(2.3rem,4.5vw,3.4rem)] font-semibold leading-[1.06] tracking-[-0.035em] text-[#075b2f]">
            <span className="block">Where our priorities</span>
            <span className="block">meet action.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[430px] text-pretty text-[0.84rem] leading-[1.7] text-[#6d766f] sm:text-[0.9rem]">
            Selected activities and ambitions from CREN&apos;s work in training, recognition,
            industry development and green employment.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:gap-5">
          {actions.map((action) => (
            <article
              key={action.title}
              className="group relative isolate flex min-h-[220px] flex-col overflow-hidden bg-[#1a211d] p-6 text-white sm:min-h-[250px] sm:p-7 lg:p-8"
              style={cardShape}
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_0%,rgba(151,214,76,0.14),transparent_58%)]"
              />
              <img
                src={action.icon}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="h-9 w-fit object-contain transition-transform duration-500 ease-out group-hover:scale-[1.05] sm:h-10"
              />
              <div className="mt-auto pt-10">
                <h3 className="text-[1.15rem] font-semibold leading-[1.25] tracking-[-0.015em] text-white sm:text-[1.3rem]">
                  {action.title}
                </h3>
                <p className="mt-2 max-w-[340px] text-[0.8rem] leading-[1.6] text-white/70 sm:text-[0.86rem]">
                  {action.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
