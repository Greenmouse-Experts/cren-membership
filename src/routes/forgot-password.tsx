import { createFileRoute } from "@tanstack/react-router";
import ForgotPassword from "@/app/pages/ForgotPassword";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot password | Ndi Igbo Germany" },
      { name: "description", content: "Request a password reset for your member account." },
      { property: "og:title", content: "Forgot password | Ndi Igbo Germany" },
      { property: "og:description", content: "Request a password reset for your member account." },
    ],
  }),
  component: ForgotPassword,
});
