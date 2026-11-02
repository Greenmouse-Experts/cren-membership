import { createFileRoute } from "@tanstack/react-router";
import Register from "@/app/pages/Register";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Register | Ndi Igbo Germany" },
      { name: "description", content: "Become a member of Ndi Igbo Germany." },
      { property: "og:title", content: "Register | Ndi Igbo Germany" },
      { property: "og:description", content: "Become a member of Ndi Igbo Germany." },
    ],
  }),
  component: Register,
});
