import HomeNav from "@/components/HomeNav";
import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import HomeFooter from "../-home-comps/HomeFooter";

export const Route = createFileRoute("/home")({
  component: RouteComponent,
});

function RouteComponent() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const activeHref = pathname.startsWith("/home/") ? pathname : "#home";

  return (
    <div>
      <HomeNav activeHref={activeHref} />
      <main className="">
        <Outlet />
      </main>
      <HomeFooter />
    </div>
  );
}
