import { createFileRoute } from "@tanstack/react-router";
import Layout from "@/app/admin/AdminDashboard";
import Protect from "@/app/pages/Protect";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin dashboard | Council For Renewable Energy Nigeria" },
      { name: "description", content: "Council For Renewable Energy Nigeria Admin dashboard." },
      { property: "og:title", content: "Admin dashboard | Council For Renewable Energy Nigeria" },
      {
        property: "og:description",
        content: "Council For Renewable Energy Nigeria Admin dashboard.",
      },
    ],
  }),
  component: () => (
    <Protect>
      <Layout />
    </Protect>
  ),
});
