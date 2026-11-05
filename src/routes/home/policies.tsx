import { createFileRoute, Link } from "@tanstack/react-router";
import CollaborationCta from "../-home-comps/CollaborationCta";
import Hero from "../-home-comps/Hero";
import HeroContent from "../-home-comps/HeroContent";

export const Route = createFileRoute("/home/policies")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <Hero
        imgSrc="/policies/hero.png"
        heroContent={
          <HeroContent
            title="Public Policies"
            subtitle="Advancing renewable energy policy and sustainable development in Nigeria."
            action={
              <Link
                to="/home/contact-us"
                className="group inline-flex h-12 items-center justify-center gap-3 bg-[#97d64c] px-7 text-[0.82rem] font-semibold text-[#182b1b] transition-colors duration-200 hover:bg-[#a9e65a] focus-visible:bg-[#a9e65a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
                style={{
                  clipPath:
                    "polygon(9px 0, calc(100% - 9px) 0, 100% 9px, 100% calc(100% - 9px), calc(100% - 9px) 100%, 9px 100%, 0 calc(100% - 9px), 0 9px)",
                }}
              >
                Contact CREN
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  strokeWidth={2.2}
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                >
                  <path d="M5 12h3M17 12h3m0 0h3m-3-3h3m3-3h3" />
                </svg>
              </Link>
            }
          />
        }
      />
      <CollaborationCta />
    </>
  );
}
