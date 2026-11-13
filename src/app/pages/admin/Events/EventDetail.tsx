import dayjs from "dayjs";
import { ArrowLeft, Calendar, Eye, EyeOff, MapPin, Pencil, User } from "lucide-react";
import { toast } from "react-toastify";

import useGetHook from "@/app/hook/useGet";
import usePostHook from "@/app/hook/usePost";
import { useNavigate, useParams } from "@/lib/router-compat";
import { isEventPublished } from "./event-status";
import type { AdminEventItem } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const query = useGetHook<AdminEventItem[]>("admin/events");
  const { handlePost, isLoading: isPublishing } = usePostHook();

  const event = (query.data?.data ?? []).find((item) => String(item.id) === String(id));

  const handlePublishToggle = () => {
    if (!event?.id) return;
    const action = isEventPublished(event) ? "unpublish" : "publish";
    handlePost(`admin/event/${action}`, { event_id: event.id }, "application/json", () => {
      query.refetch();
      toast.success(
        action === "publish" ? "Event published successfully" : "Event unpublished successfully",
      );
    });
  };

  const formatRange = (item: AdminEventItem) => {
    const start = item.start_date ? dayjs(item.start_date) : null;
    const end = item.end_date ? dayjs(item.end_date) : null;
    if (start?.isValid() && end?.isValid()) {
      return start.isSame(end, "day")
        ? start.format("DD MMM YYYY")
        : `${start.format("DD MMM YYYY")} – ${end.format("DD MMM YYYY")}`;
    }
    if (start?.isValid()) return start.format("DD MMM YYYY");
    return "—";
  };

  return (
    <div className="mx-2 min-h-[70vh] rounded-md bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            aria-label="Back to events"
            onClick={() => navigate("/admin/events/")}
            className="size-9 border-[#015907]/30 text-[#015907] hover:bg-[#015907]/5"
          >
            <ArrowLeft aria-hidden="true" />
          </Button>
          <h1 className="text-xl font-semibold text-[#075b2f]">Event Details</h1>
        </div>
        {event && (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              disabled={isPublishing}
              onClick={handlePublishToggle}
              className="gap-2 border-[#015907] text-[#015907] hover:bg-[#015907]/5"
            >
              {isEventPublished(event) ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
              {isEventPublished(event) ? "Unpublish" : "Publish"}
            </Button>
            <Button
              onClick={() => navigate(`/admin/events/create?id=${event.id}`)}
              className="gap-2 bg-[#015907] text-white"
            >
              <Pencil aria-hidden="true" />
              Edit Event
            </Button>
          </div>
        )}
      </div>

      <div className="mt-6">
        {query.isLoading ? (
          <Skeleton className="h-96 w-full rounded-lg" />
        ) : query.isError ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="font-semibold text-[#075b2f]">Something went wrong</p>
            <p className="mt-1 text-sm text-[#62705f]">
              Failed to load this event. Please try again.
            </p>
            <Button
              variant="outline"
              onClick={() => query.refetch()}
              className="mt-4 border-[#015907] text-[#015907] hover:bg-[#015907]/5"
            >
              Try Again
            </Button>
          </div>
        ) : !event ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="font-semibold text-[#075b2f]">Event not found</p>
            <p className="mt-1 text-sm text-[#62705f]">
              This event may have been deleted or the link is incorrect.
            </p>
            <Button
              variant="outline"
              onClick={() => navigate("/admin/events/")}
              className="mt-4 border-[#015907] text-[#015907] hover:bg-[#015907]/5"
            >
              Back to Events
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,420px)_1fr]">
            <div>
              {event.image ? (
                <img
                  src={event.image}
                  alt={event.title ?? "Event image"}
                  className="w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-56 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                  No image available
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-[1.35rem] font-semibold leading-snug text-[#075b2f]">
                  {event.title}
                </h2>
                <Badge
                  className={
                    isEventPublished(event)
                      ? "border border-transparent bg-[#075b2f]/10 text-[#075b2f]"
                      : "border border-transparent bg-amber-500/15 text-amber-700"
                  }
                >
                  {isEventPublished(event) ? "Published" : "Draft"}
                </Badge>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#5f6a62]">
                <span className="inline-flex items-center gap-2">
                  <Calendar aria-hidden="true" className="size-4" />
                  {formatRange(event)}
                </span>
                {event.location && (
                  <span className="inline-flex items-center gap-2">
                    <MapPin aria-hidden="true" className="size-4" />
                    {event.location}
                  </span>
                )}
                {event.organizer && (
                  <span className="inline-flex items-center gap-2">
                    <User aria-hidden="true" className="size-4" />
                    {event.organizer}
                  </span>
                )}
              </div>

              {event.description && (
                <p className="mt-5 text-[0.95rem] leading-[1.75] text-[#3e4a40] whitespace-pre-line">
                  {event.description}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetailPage;
