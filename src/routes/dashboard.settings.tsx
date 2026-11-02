import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/pages/users/Setting";

export const Route = createFileRoute("/dashboard/settings")({
  component: Page,
});
