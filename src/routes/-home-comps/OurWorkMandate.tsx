const focusAreas = [
  {
    title: "Clean Energy Policy & Advocacy",
    body: "Advocating for deployable clean energy policies and the reduction of greenhouse gas emissions.",
    icon: "/our-work/section_2_clean_energy.png",
  },
  {
    title: "Capacity Building & Green Jobs",
    body: "Promoting indigenous expertise, green skills and employment opportunities in renewable energy.",
    icon: "/our-work/section_2_capacity_building.png",
  },
  {
    title: "Renewable Energy Financing",
    body: "Championing accessible financing to support wider renewable energy adoption and deployment.",
    icon: "/our-work/section_2_renewable_energy.png",
  },
  {
    title: "Standards & Awareness",
    body: "Supporting renewable energy standards and deeper public awareness of clean energy technologies.",
    icon: "/our-work/section_2_standards_and_awareness.png",
  },
];

export default function OurWorkMandate() {
  return (
    <section className="relative isolate overflow-hidden border-b border-black/5 bg-[#f7faf6]">
      <img
        src="/assets/Hero4-bg.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-80"
      />

      <div className="container mx-auto px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[640px] text-center">
          <h2 className="text-balance text-[clamp(2.3rem,4.5vw,3.4rem)] font-semibold leading-[1.06] tracking-[-0.035em] text-[#075b2f]">
            <span className="block">Four areas shaping</span>
            <span className="block">our mandate.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[470px] text-pretty text-[0.84rem] leading-[1.7] text-[#6d766f] sm:text-[0.9rem]">
            CREN&apos;s priorities span the policy, people, financing and standards needed to
            advance renewable energy development in Nigeria.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:gap-5">
          {focusAreas.map((area) => (
            <article
              key={area.title}
              className="relative isolate overflow-hidden rounded-2xl border border-[#075b2f]/10 bg-[linear-gradient(140deg,#ffffff_20%,#eef5e8_100%)] p-6 shadow-[0_20px_45px_-38px_rgba(7,91,47,0.6)] sm:p-7 lg:p-8"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-12 -top-16 -z-10 size-40 rounded-full bg-[#97d64c]/15 blur-2xl"
              />
              <img
                src={area.icon}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="h-11 w-auto object-contain sm:h-12"
              />
              <h3 className="mt-5 max-w-[300px] text-[1.2rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[#075b2f] sm:text-[1.35rem]">
                {area.title}
              </h3>
              <p className="mt-2 max-w-[380px] text-[0.82rem] leading-[1.65] text-[#64716a] sm:text-[0.88rem]">
                {area.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
