import { createFileRoute } from "@tanstack/react-router";
import Register from "@/app/pages/Register";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Register | Council For Renewable Energy Nigeria" },
      { name: "description", content: "Become a member of Council For Renewable Energy Nigeria." },
      { property: "og:title", content: "Register | Council For Renewable Energy Nigeria" },
      {
        property: "og:description",
        content: "Become a member of Council For Renewable Energy Nigeria.",
      },
    ],
  }),
  component: Register,
});
