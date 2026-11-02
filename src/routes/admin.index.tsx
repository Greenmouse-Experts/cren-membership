import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/admin/Admin";

export const Route = createFileRoute("/admin/")({
  component: Page,
});
