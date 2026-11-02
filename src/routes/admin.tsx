import { createFileRoute } from "@tanstack/react-router";
import Layout from "@/app/admin/AdminDashboard";
import Protect from "@/app/pages/Protect";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin dashboard | Ndi Igbo Germany" },
      { name: "description", content: "Ndi Igbo Germany Admin dashboard." },
      { property: "og:title", content: "Admin dashboard | Ndi Igbo Germany" },
      { property: "og:description", content: "Ndi Igbo Germany Admin dashboard." },
    ],
  }),
  component: () => (
    <Protect>
      <Layout />
    </Protect>
  ),
});
