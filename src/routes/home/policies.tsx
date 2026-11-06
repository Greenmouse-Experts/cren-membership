import { createFileRoute } from "@tanstack/react-router";
import PageBanner from "../-home-comps/PageBanner";
import PoliciesSection from "../-home-comps/PoliciesSection";
import PolicyCta from "../-home-comps/PolicyCta";

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
      <PoliciesSection />
      <PolicyCta />
    </>
  );
}
