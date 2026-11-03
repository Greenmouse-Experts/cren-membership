import HomeNav from "@/components/HomeNav";
import { createFileRoute, Outlet } from "@tanstack/react-router";

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
    </div>
  );
}
