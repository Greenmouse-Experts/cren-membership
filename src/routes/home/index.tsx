import { createFileRoute } from "@tanstack/react-router";
import HomeHero from "../-home-comps/HomeHero";
import HomeSections from "../-home-comps/HomeSections";

export const Route = createFileRoute("/home/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <HomeHero />
      <HomeSections />
    </div>
  );
}
