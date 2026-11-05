const leaders = [
  {
    name: "Engr. Dr. Yusuf Mohammad Ganda",
    role: "National President",
    image: "/about-us/section_2_yusuf.png",
  },
  {
    name: "Dr. Uzodinma A. Adirieje",
    role: "Deputy President",
    image: "/about-us/section_2_uzodinma.png",
  },
  {
    name: "Samuel Ifeanyi Nwosu",
    role: "Secretary General",
    image: "/about-us/section_2_samuel.png",
  },
  {
    name: "Hajia Salma Muhammad",
    role: "Assistant Secretary General",
    image: "/about-us/section_2_haija.png",
  },
  {
    name: "Engr. Dr. Sabo Mahmoud Lurwan",
    role: "Financial Secretary",
    image: "/about-us/section_2_sabo.png",
  },
  {
    name: "Olanike Olugboji-Daramola",
    role: "Treasurer",
    image: "/about-us/section_2_olanike.png",
  },
  {
    name: "Abbas Musa",
    role: "Public Relations Officer",
    image: "/about-us/section_2_abbas.png",
  },
  {
    name: "Prof. Abubakar S. Sambo",
    role: "Advisory Board Chairman",
    image: "/about-us/section_2_abubakar.png",
  },
];

export default function AboutLeadership() {
  return (
    <section className="relative isolate overflow-hidden border-b border-black/5 bg-white">
      <div className="container mx-auto px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-[560px] text-center">
          <h2 className="text-balance text-[clamp(2.4rem,4.7vw,3.7rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-[#075b2f]">
            <span className="block">Meet CREN&apos;s</span>
            <span className="block">leadership.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[430px] text-pretty text-[0.8rem] leading-[1.7] text-[#6d766f] sm:text-[0.86rem]">
            The 2026 executive leadership and board representation, as presented in CREN&apos;s
            supplied organisational materials.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-14 lg:grid-cols-4">
          {leaders.map((leader) => (
            <article
              key={leader.name}
              className="group overflow-hidden rounded-xl bg-white shadow-[0_14px_30px_-26px_rgba(7,91,47,0.55)] ring-1 ring-[#075b2f]/10"
            >
              <div className="overflow-hidden bg-[#f3f7ef]">
                <img
                  src={leader.image}
                  alt={`Portrait of ${leader.name}`}
                  loading="lazy"
                  className="aspect-[5/4] w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <div className="px-3.5 pb-4 pt-3 sm:px-4">
                <h3 className=" font-medium text-lg leading-[1.35] tracking-[-0.01em] text-[#075b2f] ">
                  {leader.name}
                </h3>
                <p className="mt-1 text-sm leading-[1.4] text-[#6e7a71] ">{leader.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
