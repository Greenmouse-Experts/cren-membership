import { ArrowUpRight } from "lucide-react";

const activities = [
  {
    highlight: "2021",
    title: "Maiden Energy Awards",
    description: "CREN's Maiden Energy Awards took place at the Sheraton in 2021.",
    image: "/home_page/section_3_maiden_energy_awards.png",
  },
  {
    highlight: "Solar PV",
    title: "Solar Skills Training",
    description:
      "Free solar PV training initiatives for returnees, and for youth and women in the Niger Delta.",
    image: "/home_page/section_3_solar_skills_training.png",
  },
  {
    highlight: "Local",
    title: "Battery Storage Advocacy",
    description: "Advocacy for the development of local battery storage manufacturing in Nigeria.",
    image: "/home_page/section_3_battery_storage_advocacy.png",
  },
  {
    highlight: "20M",
    title: "Green Jobs Agenda",
    eyebrow: "Aspirational goal",
    description:
      "Supporting an agenda that aims for 20 million green jobs. This is a target, not jobs already created.",
    image: "/home_page/section_3_green_jobs_agenda.png",
  },
];

const cardShape = {
  clipPath:
    "polygon(16px 0, calc(100% - 16px) 0, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0 calc(100% - 16px), 0 16px)",
};

export default function Activities() {
  return (
    <section id="activities" className="relative isolate overflow-hidden bg-white">
      <img
        src="/home_page/section_3_hex.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute -left-36 top-0 -z-10 w-[680px] max-w-none opacity-80 mix-blend-multiply"
      />
      <img
        src="/home_page/section_3_hex.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute -right-40 bottom-0 -z-10 w-[760px] max-w-none rotate-180 opacity-80 mix-blend-multiply"
      />

      <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-[720px] text-center">
          <h2 className="text-balance text-[clamp(2.15rem,4.6vw,3.4rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[#075b2f]">
            CREN&apos;s activities and priorities.
          </h2>
          <p className="mx-auto mt-5 max-w-[560px] text-pretty text-[0.9rem] leading-[1.75] text-[#6d766f] sm:text-[0.98rem]">
            A snapshot of initiatives, advocacy priorities and programmes highlighted in CREN&apos;s
            materials.
          </p>
        </div>

        <div className="mt-11 grid gap-4 md:grid-cols-2 lg:mt-14">
          {activities.map((activity) => (
            <article
              key={activity.title}
              className="group relative isolate min-h-[245px] overflow-hidden bg-[#1e2321] sm:min-h-[285px]"
              style={cardShape}
            >
              <img
                src={activity.image}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute inset-0 -z-10 h-full w-full object-cover object-left transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />
              <div className="flex min-h-[245px] flex-col p-6 sm:min-h-[285px] sm:p-8">
                <p
                  aria-hidden="true"
                  className="ml-auto text-[clamp(2.4rem,6vw,4.5rem)] font-light leading-none tracking-[-0.04em] text-white/20"
                >
                  {activity.highlight}
                </p>

                <div className="mt-auto max-w-[290px]">
                  <h3 className="text-[1.1rem] font-semibold leading-snug text-white sm:text-[1.25rem]">
                    {activity.title}
                  </h3>
                  {activity.eyebrow && (
                    <p className="mt-1 text-[0.72rem] font-semibold text-[#9bd54e]">
                      {activity.eyebrow}
                    </p>
                  )}
                  <p className="mt-1.5 text-[0.78rem] leading-[1.55] text-white/75 sm:text-[0.8rem]">
                    {activity.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 text-center sm:mt-16">
          <h3 className="text-balance text-[1.4rem] font-semibold tracking-[-0.02em] text-[#075b2f] sm:text-[1.7rem]">
            Let&apos;s advance clean energy together.
          </h3>
          <a
            href="#contact"
            className="group mt-6 inline-flex h-11 items-center justify-center gap-3 bg-[#084c2a] px-5 text-[0.78rem] font-medium text-white transition-colors duration-200 hover:bg-[#063a20] focus-visible:bg-[#063a20] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
            style={{
              clipPath:
                "polygon(9px 0, calc(100% - 9px) 0, 100% 9px, 100% calc(100% - 9px), calc(100% - 9px) 100%, 9px 100%, 0 calc(100% - 9px), 0 9px)",
            }}
          >
            Contact CREN
            <ArrowUpRight
              aria-hidden="true"
              className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              strokeWidth={2.2}
            />
          </a>
        </div>
      </div>
    </section>
  );
}
