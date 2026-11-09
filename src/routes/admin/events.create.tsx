import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/pages/admin/Events/EventForm";

export const Route = createFileRoute("/admin/events/create")({
  component: Page,
});
