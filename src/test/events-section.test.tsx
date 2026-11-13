import { describe, expect, it } from "vitest";

import { isEventPublished } from "@/app/pages/admin/Events/event-status";
import { toEventItems } from "@/routes/-home-comps/EventsSection";
import type { AdminEventItem } from "@/types/api";

const event = (overrides: Partial<AdminEventItem>): AdminEventItem => ({
  id: 1,
  title: "CREN event",
  description: "An event",
  image: "https://example.com/a.png",
  start_date: "2026-11-10T00:00:00.000Z",
  end_date: "2026-11-26T00:00:00.000Z",
  location: "Abuja",
  organizer: "CREN",
  status: "Active",
  ...overrides,
});

describe("toEventItems", () => {
  it("maps the public events payload onto card props", () => {
    const items = toEventItems([event({ id: 2 })]);

    expect(items).toHaveLength(1);
    const item = items[0]!;
    expect(item.title).toBe("CREN event");
    expect(item.description).toBe("An event");
    expect(item.image).toBe("https://example.com/a.png");
    expect(item.location).toBe("Abuja");
    expect(item.date).toBe("10 Nov 2026 – 26 Nov 2026");
  });

  it("collapses a single-day range to one date", () => {
    const items = toEventItems([
      event({ start_date: "2026-11-10T00:00:00.000Z", end_date: "2026-11-10T12:00:00.000Z" }),
    ]);

    expect(items[0]?.date).toBe("10 November 2026");
  });

  it("ignores an end date that falls before the start date", () => {
    const items = toEventItems([
      event({ start_date: "2026-10-21T00:00:00.000Z", end_date: "2026-07-13T00:00:00.000Z" }),
    ]);

    expect(items[0]?.date).toBe("21 October 2026");
  });

  it("keeps events without a date and tolerates a missing image", () => {
    const items = toEventItems([event({ start_date: null, end_date: null, image: null })]);

    expect(items[0]?.date).toBe("");
    expect(items[0]?.image).toBe("");
  });

  it("drops inactive events and events without a title", () => {
    const items = toEventItems([
      event({ id: 1, status: "Inactive" }),
      event({ id: 2, title: null }),
      event({ id: 3 }),
    ]);

    expect(items).toHaveLength(1);
    expect(items[0]?.title).toBe("CREN event");
  });

  it("keeps events whose status is unset", () => {
    const items = toEventItems([event({ status: null })]);

    expect(items).toHaveLength(1);
  });
});

describe("isEventPublished", () => {
  it("normalizes the status shapes the API returns", () => {
    expect(isEventPublished({ status: true })).toBe(true);
    expect(isEventPublished({ status: 1 })).toBe(true);
    expect(isEventPublished({ status: "Active" })).toBe(true);
    expect(isEventPublished({ status: " published " })).toBe(true);

    expect(isEventPublished({ status: false })).toBe(false);
    expect(isEventPublished({ status: 0 })).toBe(false);
    expect(isEventPublished({ status: "Inactive" })).toBe(false);
    expect(isEventPublished({ status: null })).toBe(false);
  });
});
