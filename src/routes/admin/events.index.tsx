import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/pages/admin/Events/Events";

export const Route = createFileRoute("/admin/events/")({
  component: Page,
});
