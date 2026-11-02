import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/pages/admin/Dues/Category";

export const Route = createFileRoute("/admin/dues/category")({
  component: Page,
});
