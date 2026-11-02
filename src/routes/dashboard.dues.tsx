import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/pages/users/Dues";

export const Route = createFileRoute("/dashboard/dues")({
  component: Page,
});
