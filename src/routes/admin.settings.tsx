import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/pages/admin/Settings";

export const Route = createFileRoute("/admin/settings")({
  component: Page,
});
