import HomeNav from "@/components/HomeNav";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import HomeFooter from "../-home-comps/HomeFooter";

export const Route = createFileRoute("/home")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <HomeNav />
      <main className="">
        <Outlet />
      </main>
      <HomeFooter />
    </div>
  );
}
