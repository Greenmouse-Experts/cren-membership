import { Calendar } from "lucide-react";

export interface EventItem {
  image: string;
  imageAlt?: string;
  title: string;
  description: string;
  /** Formatted date text shown on the card, e.g. "21 October 2026". */
  date: string;
}

const defaultEvents: EventItem[] = [
  {
    image: "/events/events_1.png",
    imageAlt: "Banner congratulating the new executive members of CREN",
    title: "Inauguration of the New Executive Committee Members, 2026",
    description:
      "CREN's newly constituted executive leadership was inaugurated on 21 October 2026.",
    date: "21 October 2026",
  },
  {
    image: "/events/events_2.png",
    imageAlt: "Speakers and guests on stage at the National Solar Energy Conference",
    title: "National Solar Energy Conference & Exhibition 2026",
    description:
      "Photographs from the conference presented by the Solar Energy Society of Nigeria in collaboration with the African University of Science and Technology.",
    date: "2026",
  },
];

interface EventCardProps {
  event: EventItem;
}

function EventCard({ event }: EventCardProps) {
  return (
    <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_22px_48px_-36px_rgba(7,91,47,0.55)]">
      <div className="relative h-fit overflow-hidden w-full">
        <img
          src={event.image}
          alt={event.imageAlt ?? event.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <h3 className="max-w-[340px] text-pretty text-[1.25rem] font-semibold leading-[1.25] tracking-[-0.015em] text-[#075b2f] sm:text-[1.35rem]">
          {event.title}
        </h3>
        <p className="mt-3 max-w-[380px] text-[0.8rem] leading-[1.65] text-[#5f6a62] sm:text-[0.83rem]">
          {event.description}
        </p>

        <p className="mt-auto flex items-center gap-2.5 pt-5 text-[0.82rem] font-semibold text-[#084c2a] sm:text-[0.86rem]">
          <Calendar aria-hidden="true" className="size-[1.15rem]" strokeWidth={1.9} />
          {event.date}
        </p>
      </div>
    </article>
  );
}

interface EventsSectionProps {
  /** Event cards to render. Defaults to CREN's recent events. */
  events?: EventItem[];
  /** Section heading. */
  title?: string;
  /** Whether to show the extra gallery link. */
  showExtra?: boolean;
}

/**
 * Reusable events section: a heading plus a grid of event cards.
 * Pass `events` to render a custom list; `EventCard` is also exported
 * so cards can be reused in other layouts.
 */
export default function EventsSection({
  events = defaultEvents,
  title = "Events",
  showExtra = false,
}: EventsSectionProps) {
  return (
    <section className="bg-[#f1f5ec]">
      <div className="container mx-auto px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <h2 className="text-balance text-[clamp(2rem,3.8vw,2.9rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#075b2f]">
          {title} {showExtra && <>and Gallery</>}
        </h2>

        <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-2 lg:gap-7">
          {events.map((event, index) => (
            <EventCard key={event.title ?? index} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}

export { EventCard };
