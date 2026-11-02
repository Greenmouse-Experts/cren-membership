import { createFileRoute } from "@tanstack/react-router";
import AdminLogin from "@/app/pages/AdminLogin";

export const Route = createFileRoute("/admin_/login")({
  head: () => ({
    meta: [
      { title: "Admin login | Council For Renewable Energy Nigeria" },
      {
        name: "description",
        content: "Sign in to the Council For Renewable Energy Nigeria admin portal.",
      },
      { property: "og:title", content: "Admin login | Council For Renewable Energy Nigeria" },
      {
        property: "og:description",
        content: "Sign in to the Council For Renewable Energy Nigeria admin portal.",
      },
    ],
  }),
  component: AdminLogin,
});
