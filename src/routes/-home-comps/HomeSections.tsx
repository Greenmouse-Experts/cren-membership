import AboutIntro from "./AboutIntro";
import Activities from "./Activities";
import EventsSection from "./EventsSection";
import HomeFaq from "./HomeFaq";
import HomeFooter from "./HomeFooter";
import OurWork from "./OurWork";

export default function HomeSections() {
  return (
    <>
      <AboutIntro />
      <OurWork />
      <Activities />
      <EventsSection />
      <HomeFaq />
      {/*<HomeFooter />*/}
    </>
  );
}
