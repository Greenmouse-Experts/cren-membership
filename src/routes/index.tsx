import { createFileRoute, redirect } from "@tanstack/react-router";
import Register from "@/app/pages/Register";
import HomeNav from "@/components/HomeNav";
import HomeHero from "./-home-comps/HomeHero";
import HomeSections from "./-home-comps/HomeSections";

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
  loader: () =>
    redirect({
      to: "/home",
    }),
  component: () => (
    <>
      <HomeNav />
      <HomeHero />
      <HomeSections />
    </>
  ),
});
