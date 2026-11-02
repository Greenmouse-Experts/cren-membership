import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/pages/admin/Payments/Dues";

export const Route = createFileRoute("/admin/payments/dues")({
  component: Page,
});
