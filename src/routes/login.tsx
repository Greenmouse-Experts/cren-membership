import { createFileRoute } from "@tanstack/react-router";
import Login from "@/app/pages/Login";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Member login | Council For Renewable Energy Nigeria" },
      {
        name: "description",
        content: "Sign in to your Council For Renewable Energy Nigeria member portal.",
      },
      { property: "og:title", content: "Member login | Council For Renewable Energy Nigeria" },
      {
        property: "og:description",
        content: "Sign in to your Council For Renewable Energy Nigeria member portal.",
      },
    ],
  }),
  component: Login,
});
