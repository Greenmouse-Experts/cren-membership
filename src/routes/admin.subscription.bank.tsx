import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/pages/admin/Subscription/Banks";

export const Route = createFileRoute("/admin/subscription/bank")({
  component: Page,
});
