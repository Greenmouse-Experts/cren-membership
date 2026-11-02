import { createFileRoute } from "@tanstack/react-router";
import AdminLogin from "@/app/pages/AdminLogin";

export const Route = createFileRoute("/admin_/login")({
  head: () => ({
    meta: [
      { title: "Admin login | Ndi Igbo Germany" },
      { name: "description", content: "Sign in to the Ndi Igbo Germany admin portal." },
      { property: "og:title", content: "Admin login | Ndi Igbo Germany" },
      { property: "og:description", content: "Sign in to the Ndi Igbo Germany admin portal." },
    ],
  }),
  component: AdminLogin,
});
