import { createFileRoute } from "@tanstack/react-router";
import Login from "@/app/pages/Login";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Member login | Ndi Igbo Germany" },
      { name: "description", content: "Sign in to your Ndi Igbo Germany member portal." },
      { property: "og:title", content: "Member login | Ndi Igbo Germany" },
      { property: "og:description", content: "Sign in to your Ndi Igbo Germany member portal." },
    ],
  }),
  component: Login,
});
