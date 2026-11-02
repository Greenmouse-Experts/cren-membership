import { createFileRoute } from "@tanstack/react-router";
import Layout from "@/app/pages/Dashboard";
import Protect from "@/app/pages/Protect";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Member dashboard | Council For Renewable Energy Nigeria" },
      { name: "description", content: "Council For Renewable Energy Nigeria Member dashboard." },
      { property: "og:title", content: "Member dashboard | Council For Renewable Energy Nigeria" },
      {
        property: "og:description",
        content: "Council For Renewable Energy Nigeria Member dashboard.",
      },
    ],
  }),
  component: () => (
    <Protect>
      <Layout />
    </Protect>
  ),
});
