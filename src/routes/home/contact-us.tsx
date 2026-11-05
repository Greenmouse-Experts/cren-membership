import { createFileRoute } from "@tanstack/react-router";

import ContactDetails from "../-home-comps/ContactDetails";
import ContactMap from "../-home-comps/ContactMap";
import Hero from "../-home-comps/Hero";
import HeroContent from "../-home-comps/HeroContent";

export const Route = createFileRoute("/home/contact-us")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Hero
        imgSrc="/contact-us/hero.png"
        heroContent={
          <HeroContent
            title={
              <>
                <span className="block">Let&apos;s connect</span>
                <span className="block">
                  for a <span className="text-[#97d64c]">greener</span>
                </span>
                <span className="block text-[#97d64c]">Nigeria.</span>
              </>
            }
            subtitle="Reach the Council for Renewable Energy Nigeria about clean energy policy, green skills, financing, standards and awareness."
          />
        }
      />
      <ContactDetails />
      <ContactMap />
    </>
  );
}
