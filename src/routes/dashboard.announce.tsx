import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/pages/users/Annoucement";

export const Route = createFileRoute("/dashboard/announce")({
  component: Page,
});
