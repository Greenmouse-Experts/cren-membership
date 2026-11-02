import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/pages/Home";

export const Route = createFileRoute("/dashboard/")({
  component: Page,
});
