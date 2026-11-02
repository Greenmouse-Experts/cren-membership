import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/pages/admin/Dues/Dues";

export const Route = createFileRoute("/admin/dues/list")({
  component: Page,
});
