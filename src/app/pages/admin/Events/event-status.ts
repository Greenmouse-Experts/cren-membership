import type { AdminEventItem } from "@/types/api";

/**
 * Events are published/unpublished through `admin/event/publish` and
 * `admin/event/unpublish`. The API reports the resulting flag as `status`,
 * which it serializes inconsistently (1/0, "true", "published", "Active"…),
 * so normalize it before reading.
 */
export const isEventPublished = (item: Pick<AdminEventItem, "status">): boolean => {
  const { status } = item;
  if (typeof status === "boolean") return status;
  if (typeof status === "number") return status === 1;
  if (typeof status === "string") {
    return ["1", "true", "published", "active"].includes(status.trim().toLowerCase());
  }
  return false;
};
