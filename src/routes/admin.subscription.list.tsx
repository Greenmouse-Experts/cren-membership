import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/pages/admin/Subscription/SubList";

export const Route = createFileRoute("/admin/subscription/list")({
  component: Page,
});
