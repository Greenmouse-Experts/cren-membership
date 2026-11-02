import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/pages/admin/Messages";

export const Route = createFileRoute("/admin/messages")({
  component: Page,
});
