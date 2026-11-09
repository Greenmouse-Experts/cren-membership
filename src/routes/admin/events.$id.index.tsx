import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/pages/admin/Events/EventDetail";

export const Route = createFileRoute("/admin/events/$id/")({
  component: Page,
});
