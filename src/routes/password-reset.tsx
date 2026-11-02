import { createFileRoute } from "@tanstack/react-router";
import ResetPassword from "@/app/pages/ResetPassword";

export const Route = createFileRoute("/password-reset")({
  head: () => ({
    meta: [
      { title: "Reset password | Council For Renewable Energy Nigeria" },
      { name: "description", content: "Choose a new password for your member account." },
      { property: "og:title", content: "Reset password | Council For Renewable Energy Nigeria" },
      { property: "og:description", content: "Choose a new password for your member account." },
    ],
  }),
  component: ResetPassword,
});
