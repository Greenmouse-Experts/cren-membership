type Pillar = {
  title: string;
  body: string;
  featured?: boolean;
};

const pillars: Pillar[] = [
  {
    title: "Our Beginning",
    body: "CREN's pioneer leadership was under Prof. Titilayo Kuku. The organisation continues its work under a reconstituted national executive council.",
  },
  {
    title: "A Renewed Council",
    body: "The new executive leadership was inaugurated on 21 October 2026, with Engr. Dr. Yusuf Mohammad Ganda as National President.",
    featured: true,
  },
  {
    title: "Working Together",
    body: "Government, industry, academia, finance and civil society align their efforts to advance Nigeria's renewable energy transition.",
  },
];

function PillarCard({ title, body, featured }: Pillar) {
  if (featured) {
    return (
      <article className="relative isolate overflow-hidden rounded-xl bg-[#0b4b2b] p-6 text-white shadow-[0_26px_50px_-30px_rgba(6,58,32,0.75)] sm:p-7 md:min-h-[190px]">
        <img
          src="/about-us/section_3_bg.png"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <h3 className="text-[1.45rem] font-semibold leading-[1.15] tracking-[-0.025em] text-white">
          {title}
        </h3>
        <p className="mt-3 text-[0.78rem] leading-[1.7] text-white/80 sm:text-[0.82rem]">{body}</p>
      </article>
    );
  }

  return (
    <article className="relative isolate overflow-hidden rounded-xl border border-[#075b2f]/10 bg-[linear-gradient(145deg,#ffffff_15%,#eef5e7_100%)] p-6 shadow-[0_18px_40px_-34px_rgba(7,91,47,0.6)] sm:p-7 md:min-h-[150px]">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-12 -z-10 size-36 rounded-full bg-[#97d64c]/20 blur-2xl"
      />
      <h3 className="text-[1.45rem] font-semibold leading-[1.15] tracking-[-0.025em] text-[#075b2f]">
        {title}
      </h3>
      <p className="mt-3 text-[0.78rem] leading-[1.7] text-[#62705f] sm:text-[0.82rem]">{body}</p>
    </article>
  );
}

export default function AboutStory() {
  return (
    <section className="relative isolate overflow-hidden border-b border-black/5 bg-[#f7faf6]">
      <img
        src="/assets/Hero4-bg.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full -scale-x-100 object-cover opacity-80"
      />

      <div className="container mx-auto px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-20">
          <h2 className="text-balance text-[clamp(2.6rem,5vw,4.05rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-[#075b2f]">
            <span className="block">One council.</span>
            <span className="block">Many voices.</span>
            <span className="block">Shared purpose.</span>
          </h2>
          <p className="max-w-[470px] text-pretty text-[0.92rem] leading-[1.75] text-[#5f6b62] sm:text-[0.96rem] lg:justify-self-end lg:pt-2">
            The Council for Renewable Energy Nigeria (CREN) is a not-for-profit professional body
            bringing together government, industry, academia, finance, civil society and energy
            users to advance renewable energy adoption, policy and sustainable development in
            Nigeria.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3 md:items-center lg:mt-12 lg:gap-5">
          {pillars.map((pillar) => (
            <PillarCard key={pillar.title} {...pillar} />
          ))}
        </div>
      </div>
    </section>
  );
}
