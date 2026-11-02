import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/pages/users/Transactions";

export const Route = createFileRoute("/dashboard/transact")({
  component: Page,
});
