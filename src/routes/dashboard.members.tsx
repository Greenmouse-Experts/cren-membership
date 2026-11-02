import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/users/members/Members";

export const Route = createFileRoute("/dashboard/members")({
  component: Page,
});
