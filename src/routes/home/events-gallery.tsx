import { createFileRoute } from "@tanstack/react-router";

import CollaborationCta from "../-home-comps/CollaborationCta";
import EventsSection from "../-home-comps/EventsSection";
import PageBanner from "../-home-comps/PageBanner";
import PhotoGallerySection from "../-home-comps/PhotoGallerySection";

export const Route = createFileRoute("/home/events-gallery")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <PageBanner
        title={
          <>
            <span className="block">
              Events <span className="text-[#9bd64e]">&</span>
            </span>
            <span className="block">Gallery.</span>
          </>
        }
        description="Updates on CREN programmes and highlights from our events and activities."
      />
      <EventsSection />
      <PhotoGallerySection description="Moments from CREN's recent events and activities." />
      {/*<CollaborationCta />*/}
    </>
  );
}
