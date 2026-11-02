import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/pages/admin/Member";

export const Route = createFileRoute("/admin/member")({
  component: Page,
});
