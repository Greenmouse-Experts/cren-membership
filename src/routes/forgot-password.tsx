import { createFileRoute } from "@tanstack/react-router";
import ForgotPassword from "@/app/pages/ForgotPassword";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password | Council For Renewable Energy Nigeria" },
      { name: "description", content: "Request a password reset for your member account." },
      { property: "og:title", content: "Forgot password | Council For Renewable Energy Nigeria" },
      { property: "og:description", content: "Request a password reset for your member account." },
    ],
  }),
  component: ForgotPassword,
});
