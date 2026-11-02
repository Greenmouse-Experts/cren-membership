import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/pages/admin/Payments/Subscription";

export const Route = createFileRoute("/admin/payments/subscrition")({
  component: Page,
});
