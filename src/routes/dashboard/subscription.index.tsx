import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/pages/users/Subscription";

export const Route = createFileRoute("/dashboard/subscription/")({
  component: Page,
});
