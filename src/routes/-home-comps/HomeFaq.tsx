import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    value: "what-is-cren",
    question: "What is CREN?",
    answer:
      "CREN is the Council for Renewable Energy Nigeria, a not-for-profit professional body working to advance renewable and clean energy development in Nigeria.",
  },
  {
    value: "who-does-cren-bring-together",
    question: "Who does CREN bring together?",
    answer:
      "CREN brings together government, academia, industry, finance, civil society and end-users to advance renewable energy development in Nigeria.",
  },
  {
    value: "main-areas-of-work",
    question: "What are CREN's main areas of work?",
    answer:
      "Our work spans clean energy policy and advocacy, capacity building and green jobs, renewable energy financing, and standards and public awareness.",
  },
  {
    value: "past-activities",
    question: "What activities has CREN been involved in?",
    answer:
      "CREN's activities include the Maiden Energy Awards, solar PV skills training, battery storage advocacy and its green jobs agenda.",
  },
  {
    value: "green-jobs-ambition",
    question: "What is CREN's green jobs ambition?",
    answer:
      "CREN supports an agenda aiming for 20 million green jobs. This is a target, not jobs already created.",
  },
];

export default function HomeFaq() {
  return (
    <section
      id="faq"
      className="relative isolate overflow-hidden bg-[#f7faf8] border-t border-black/20"
    >
      <img
        src="/home_page/section_3_hex.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute -bottom-24 -right-40 -z-10 w-[780px] max-w-none opacity-80 mix-blend-multiply"
      />

      <div className="mx-auto grid container gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-20 lg:py-24">
        <div>
          <h2 className="max-w-[360px] text-balance text-[clamp(2.4rem,4.8vw,3.65rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-[#075b2f]">
            Frequently asked questions.
          </h2>
          <p className="mt-6 max-w-[285px] text-[0.88rem] leading-[1.75] text-[#707971] sm:text-[0.94rem]">
            Find out more about CREN, the communities it brings together and its renewable energy
            priorities.
          </p>
        </div>

        <Accordion type="single" collapsible defaultValue="what-is-cren">
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.value}
              value={faq.value}
              className="border-b border-[#075b2f]/20 first:border-t bg-white rounded-xl px-4 my-2"
            >
              <AccordionTrigger className="py-4 text-left text-[0.82rem] font-semibold  text-[#075b2f] hover:no-underline sm:text-[0.88rem] [&>svg]:size-3.5 [&>svg]:text-[#a43f2e]">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 pr-8 text-[0.76rem] leading-[1.7] text-[#68716a] sm:text-[0.82rem]">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
