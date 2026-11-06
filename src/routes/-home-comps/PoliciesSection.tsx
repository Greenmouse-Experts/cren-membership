export interface PolicyTopic {
  title: string;
  /** Paragraph body. May contain JSX such as a styled email link. */
  body: React.ReactNode;
}

const defaultTopics = (
  [
    {
      title: "Privacy & enquiries",
      body: `When you contact CREN, you may share your name, email address, subject and message. The current website form prepares an email draft in your email application. It does not send the message automatically or store your enquiry in the website. CREN should use enquiries to review and respond to your request.`,
    },
    {
      title: "Website information",
      body: `Content on this website provides general information about CREN, its mandate and its activities. It is not individual technical, legal or financial advice. Please contact CREN to confirm information before relying on it for important decisions.`,
    },
    {
      title: "External services",
      body: `Pages may include services such as Google Maps and externally hosted fonts. These providers may handle technical information under their own privacy notices. Links to other websites are provided for convenience, and CREN does not control their content or practices.`,
    },
    {
      title: "Updates & requests",
      body: (
        <>
          These policies may be updated when the website or CREN&rsquo;s practices change. To ask
          about information you have shared, or request a correction, contact{" "}
          <a
            href="mailto:cren.nigeria@gmail.com"
            className="font-semibold text-[#075b2f] hover:underline"
          >
            cren.nigeria@gmail.com
          </a>
          .
        </>
      ),
    },
  ] satisfies PolicyTopic[]
) as PolicyTopic[];

interface PoliciesSectionProps {
  /** Policy topics to render. Defaults to the website policy notes. */
  topics?: PolicyTopic[];
}

/**
 * Reusable two-column grid of policy topics.
 */
export default function PoliciesSection({ topics = defaultTopics }: PoliciesSectionProps) {
  return (
    <section className="bg-white">
      <div className="container mx-auto px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-2 lg:gap-x-24 lg:gap-y-16">
          {topics.map((topic) => (
            <article key={topic.title}>
              <h2 className="text-balance text-[clamp(1.7rem,2.8vw,2.35rem)] font-semibold leading-[1.15] tracking-[-0.02em] text-[#075b2f]">
                {topic.title}
              </h2>
              <p className="mt-5 max-w-[620px] text-pretty text-[0.92rem] leading-[1.75] text-[#5f6a62] sm:text-[0.98rem]">
                {topic.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
