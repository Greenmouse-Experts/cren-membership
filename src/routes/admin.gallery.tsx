import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/pages/admin/Gallery";

export const Route = createFileRoute("/admin/gallery")({
  component: Page,
});
