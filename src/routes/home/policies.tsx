import { createFileRoute, Link } from "@tanstack/react-router";
import CollaborationCta from "../-home-comps/CollaborationCta";
import Hero from "../-home-comps/Hero";
import HeroContent from "../-home-comps/HeroContent";
import PageBanner from "../-home-comps/PageBanner";

export const Route = createFileRoute("/home/policies")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <PageBanner
        title={
          <>
            Website <br /> <span className="text-accent">Policies</span>
          </>
        }
      />
      <CollaborationCta />
    </>
  );
}
