import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/pages/admin/Announcement";

export const Route = createFileRoute("/admin/announcements")({
  component: Page,
});
