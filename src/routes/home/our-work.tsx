import { createFileRoute } from "@tanstack/react-router";

import CollaborationCta from "../-home-comps/CollaborationCta";
import Hero from "../-home-comps/Hero";
import HeroContent from "../-home-comps/HeroContent";
import OurWorkActions from "../-home-comps/OurWorkActions";
import OurWorkMandate from "../-home-comps/OurWorkMandate";

export const Route = createFileRoute("/home/our-work")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Hero
        imgSrc="/our-work/hero.png"
        heroContent={
          <HeroContent
            title={
              <>
                <span className="block">Our work for a</span>
                <span className="block text-[#97d64c]">cleaner Nigeria.</span>
              </>
            }
            subtitle="A not-for-profit professional body bringing stakeholders together to advance renewable and clean energy development across Nigeria."
          />
        }
      />
      <OurWorkMandate />
      <OurWorkActions />
      <CollaborationCta bgSrc="/our-work/green_bg.png" />
    </>
  );
}
