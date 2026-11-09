import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { Calendar, MapPin, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import useModal from "@/app/hook/useModal";
import useGetHook from "@/app/hook/useGet";
import usePostHook from "@/app/hook/usePost";
import ReusableModal from "@/app/components/ReusableModal";
import { useNavigate } from "@/lib/router-compat";
import type { AdminEventItem } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const AdminEventList = () => {
  const query = useGetHook<AdminEventItem[]>("admin/events");
  const navigate = useNavigate();
  const { handlePost, isLoading: isDeleting } = usePostHook();

  const { Modal: Delete, setShowModal: setShowDelete } = useModal();
  const [selected, setSelected] = useState<AdminEventItem | null>(null);
  const [search, setSearch] = useState("");

  const events = query.data?.data ?? [];

  const filteredEvents = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return events;
    return events.filter((item) => {
      const title = item.title?.toLowerCase() ?? "";
      const location = item.location?.toLowerCase() ?? "";
      const organizer = item.organizer?.toLowerCase() ?? "";
      return title.includes(term) || location.includes(term) || organizer.includes(term);
    });
  }, [events, search]);

  const openDelete = (item: AdminEventItem) => {
    setSelected(item);
    setShowDelete(true);
  };

  const handleDelete = () => {
    if (!selected?.id) return;
    handlePost(
      "admin/event/delete",
      {
        event_id: selected.id,
      },
      "application/json",
      () => {
        query.refetch();
        toast.success("Event deleted successfully");
        setShowDelete(false);
      },
    );
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
    <>
      <div className="mx-2 min-h-[70vh] rounded-md bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-[#075b2f]">CREN Events</h1>
            <p className="mt-1 text-sm text-[#62705f]">
              Add, view, edit and delete events shown on the public website.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-64">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search events..."
                className="pl-9"
                aria-label="Search events"
              />
            </div>
            <Button
              onClick={() => navigate("/admin/events/create")}
              className="gap-2 bg-[#015907] text-white"
            >
              <Plus aria-hidden="true" />
              Add
            </Button>
          </div>
        </div>

        <div className="mt-6">
          {query.isLoading ? (
            <div className="grid grid-cols-[repeat(auto-fill,_minmax(22.5rem,_1fr))] gap-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-72 w-full rounded-lg" />
              ))}
            </div>
          ) : query.isError ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="font-semibold text-[#075b2f]">Something went wrong</p>
              <p className="mt-1 text-sm text-[#62705f]">
                Failed to load the events. Please try again.
              </p>
              <Button
                variant="outline"
                onClick={() => query.refetch()}
                className="mt-4 border-[#015907] text-[#015907] hover:bg-[#015907]/5"
              >
                Try Again
              </Button>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="font-semibold text-[#075b2f]">
                {events.length === 0 ? "No events yet" : "No matching events"}
              </p>
              <p className="mt-1 text-sm text-[#62705f]">
                {events.length === 0
                  ? "Click “Add” to create the first event."
                  : "Try a different search term."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,_minmax(22.5rem,_1fr))] gap-8">
              {filteredEvents.map((item, index) => (
                <article
                  key={item.id ?? index}
                  className="group relative isolate flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border border-black/10 bg-white shadow-[0_18px_36px_-30px_rgba(7,91,47,0.55)] transition-transform duration-150 hover:-translate-y-0.5"
                  role="link"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && item.id) {
                      navigate(`/admin/events/${item.id}`);
                    }
                  }}
                  onClick={(event) => {
                    if ((event.target as HTMLElement).closest("button")) return;
                    if (item.id) navigate(`/admin/events/${item.id}`);
                  }}
                >
                  <div className="relative bg-muted">
                    <img
                      src={item.image ?? ""}
                      alt={item.title ?? "Event image"}
                      loading="lazy"
                      className="aspect-[16/9] w-full object-cover"
                    />
                    <div
                      className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-white/95 p-1.5 shadow-sm"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <span className="px-1 text-[0.72rem] text-[#5f6a62]">
                        {item.created_at ? dayjs(item.created_at).format("DD MMM YYYY") : ""}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${item.title ?? "event"}`}
                        onClick={() => navigate(`/admin/events/create?id=${item.id}`)}
                        className="hidden h-7 w-7 text-[#015907] hover:bg-[#015907]/10 group-hover:inline-flex"
                      >
                        <Pencil className="!size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${item.title ?? "event"}`}
                        onClick={() => openDelete(item)}
                        className="hidden h-7 w-7 text-red-600 hover:bg-red-600/10 group-hover:inline-flex"
                      >
                        <Trash2 className="!size-3.5" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col px-4 pb-4 pt-3 group-hover:text-[#075b2f]">
                    <h6 className="text-[1.05rem] font-semibold capitalize text-[#075b2f] line-clamp-2">
                      {item.title}
                    </h6>
                    {item.description && (
                      <p className="mt-1.5 text-sm leading-[1.6] text-[#62705f] line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-3 text-[0.78rem] text-[#5f6a62]">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar aria-hidden="true" className="size-3.5" />
                        {formatRange(item)}
                      </span>
                      {item.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin aria-hidden="true" className="size-3.5" />
                          {item.location}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      <Delete title="" noHead>
        <ReusableModal
          title="Are you sure you want to delete this event?"
          cancelTitle="No, cancel"
          actionTitle="Yes, delete"
          closeModal={() => setShowDelete(false)}
          action={handleDelete}
          isBusy={isDeleting}
        />
      </Delete>
    </>
  );
};

export default AdminEventList;
