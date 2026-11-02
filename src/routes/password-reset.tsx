import { createFileRoute } from "@tanstack/react-router";
import ResetPassword from "@/app/pages/ResetPassword";

export const Route = createFileRoute("/password-reset")({
  head: () => ({
    meta: [
      { title: "Reset password | Ndi Igbo Germany" },
      { name: "description", content: "Choose a new password for your member account." },
      { property: "og:title", content: "Reset password | Ndi Igbo Germany" },
      { property: "og:description", content: "Choose a new password for your member account." },
    ],
  }),
  component: ResetPassword,
});
