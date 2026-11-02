import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/pages/admin/Dues/Banks";

export const Route = createFileRoute("/admin/dues/bank")({
  component: Page,
});
