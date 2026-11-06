import { Outlet } from "@tanstack/react-router";

import useGetHook from "../hook/useGet";
import { NotifyDataContext } from "@/app/services/notify-context";
import type { AdminProfile } from "@/types/api";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Sidenav from "./Sidenav";
import { Topnav } from "./Topnav";
import "../stylesheet/layout.css";

const AdminDashboard = () => {
  const { data } = useGetHook<AdminProfile>("admin/profile");
  const profile = data?.data;

  return (
    <SidebarProvider>
      <Sidenav profile={profile} />
      <SidebarInset className="min-w-0 bg-muted/30">
        <Topnav profile={profile} />
        <div className="flex-1 p-4 md:p-6">
          <NotifyDataContext.Provider value={profile}>
            <Outlet />
          </NotifyDataContext.Provider>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminDashboard;
