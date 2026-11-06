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
        description="Highlights from CREN's leadership inauguration and a renewable energy industry conference in Nigeria."
      />
      <EventsSection />
      <PhotoGallerySection description="Moments from the National Solar Energy Conference & Exhibition 2026." />
      {/*<CollaborationCta />*/}
    </>
  );
}
