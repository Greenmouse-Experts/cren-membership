import dayjs from "dayjs";
import { Calendar, MapPin } from "lucide-react";

import useGetHook from "@/app/hook/useGet";
import { isEventPublished } from "@/app/pages/admin/Events/event-status";
import type { AdminEventItem } from "@/types/api";

export interface EventItem {
  image: string;
  imageAlt?: string;
  title: string;
  description: string;
  /** Formatted date text shown on the card, e.g. "21 October 2026". */
  date: string;
  /** Event venue, when the API provides one. */
  location?: string | undefined;
}

const toEventItems = (items: AdminEventItem[]): EventItem[] =>
  items
    // Only published events appear on the public site; `status` is unset on legacy
    // records, which should stay visible.
    .filter((item) => {
      if (!item.title) return false;
      return item.status === null || item.status === undefined || isEventPublished(item);
    })
    .map((item) => {
      const start =
        item.start_date && dayjs(item.start_date).isValid() ? dayjs(item.start_date) : null;
      const end = item.end_date && dayjs(item.end_date).isValid() ? dayjs(item.end_date) : null;
      // Some records carry an end date before the start date; ignore those rather than
      // rendering a reversed or nonsensical range.
      const validEnd = start && end && end.isAfter(start, "day") ? end : null;
      const date =
        start && validEnd
          ? start.isSame(validEnd, "day")
            ? start.format("DD MMMM YYYY")
            : `${start.format("DD MMM YYYY")} – ${validEnd.format("DD MMM YYYY")}`
          : start
            ? start.format("DD MMMM YYYY")
            : "";
      return {
        image: item.image ?? "",
        imageAlt: item.title ?? "CREN event",
        title: item.title ?? "",
        description: item.description ?? "",
        date,
        location: item.location ?? undefined,
      };
    });

interface EventCardProps {
  event: EventItem;
}

function EventCard({ event }: EventCardProps) {
  return (
    <article className="group relative isolate flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_22px_48px_-36px_rgba(7,91,47,0.55)]">
      <div className="relative h-fit overflow-hidden w-full bg-muted">
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
        {event.description && (
          <p className="mt-3 max-w-[380px] text-[0.8rem] leading-[1.65] text-[#5f6a62] sm:text-[0.83rem]">
            {event.description}
          </p>
        )}

        {event.date && (
          <p className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5 text-[0.82rem] font-semibold text-[#084c2a] sm:text-[0.86rem]">
            <span className="flex items-center gap-2.5">
              <Calendar aria-hidden="true" className="size-[1.15rem]" strokeWidth={1.9} />
              {event.date}
            </span>
            {event.location && (
              <span className="flex items-center gap-1.5 font-medium text-[#5f6a62]">
                <MapPin aria-hidden="true" className="size-[1.05rem]" strokeWidth={1.9} />
                {event.location}
              </span>
            )}
          </p>
        )}
      </div>
    </article>
  );
}

interface EventsSectionProps {
  /** Event cards to render. Defaults to events from the events endpoint. */
  events?: EventItem[];
  /** Section heading. */
  title?: string;
  /** Whether to show the extra gallery link. */
  showExtra?: boolean;
}

/**
 * Reusable events section: a heading plus a grid of event cards backed by the
 * public events endpoint (`get/events`). `EventCard` is also exported so cards
 * can be reused in other layouts.
 */
export default function EventsSection({
  events,
  title = "Events",
  showExtra = false,
}: EventsSectionProps) {
  const eventsQuery = useGetHook<AdminEventItem[]>("get/events");
  const apiEvents = toEventItems(eventsQuery.data?.data ?? []);
  const visibleEvents = events ?? apiEvents;

  return (
    <section className="bg-[#f1f5ec]">
      <div className="container mx-auto px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
        <h2 className="text-balance text-[clamp(2rem,3.8vw,2.9rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-[#075b2f]">
          {title} {showExtra && <>and Gallery</>}
        </h2>

        {eventsQuery.isLoading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:mt-10 lg:gap-7">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="h-[420px] animate-pulse rounded-2xl bg-white/70" />
            ))}
          </div>
        ) : visibleEvents.length === 0 ? (
          <p className="mt-8 text-pretty text-[0.9rem] text-[#5f6a62] lg:mt-10">
            There are no events to show right now. Please check back soon.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-2 lg:gap-7">
            {visibleEvents.map((event, index) => (
              <EventCard key={event.title ?? index} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export { EventCard, toEventItems };
