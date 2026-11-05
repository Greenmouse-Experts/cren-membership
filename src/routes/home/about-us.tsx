import { createFileRoute } from "@tanstack/react-router";
import CollaborationCta from "../-home-comps/CollaborationCta";
import AboutLeadership from "../-home-comps/AboutLeadership";
import AboutStory from "../-home-comps/AboutStory";
import Hero from "../-home-comps/Hero";
import HeroContent from "../-home-comps/HeroContent";

export const Route = createFileRoute("/home/about-us")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Hero
        imgSrc="/about-us/hero.png"
        heroContent={
          <HeroContent
            title={
              <>
                <span className="block">A Shared Voice&apos;s</span>
                <span className="block text-[#97d64c]">
                  <span className="text-white">For</span> Nigerias green
                </span>
                <span className="text-accent">future</span>
              </>
            }
            subtitle="Bringing government, industry and communities together to advance clean energy policy and a sustainable energy future for Nigeria."
          />
        }
      />
      <AboutStory />
      <AboutLeadership />
      <CollaborationCta />
    </>
  );
}
