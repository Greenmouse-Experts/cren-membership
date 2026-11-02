import { createFileRoute } from "@tanstack/react-router";
import Layout from "@/app/pages/Dashboard";
import Protect from "@/app/pages/Protect";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Member dashboard | Ndi Igbo Germany" },
      { name: "description", content: "Ndi Igbo Germany Member dashboard." },
      { property: "og:title", content: "Member dashboard | Ndi Igbo Germany" },
      { property: "og:description", content: "Ndi Igbo Germany Member dashboard." },
    ],
  }),
  component: () => (
    <Protect>
      <Layout />
    </Protect>
  ),
});
