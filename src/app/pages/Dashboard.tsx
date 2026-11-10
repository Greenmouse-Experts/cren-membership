// @ts-nocheck
import React, { useEffect, useState } from "react";
import Sidenav from "../components/Sidenav";
import { Topnav } from "../components/Topnav";
import { Outlet } from "@tanstack/react-router";
import { NotifyDataContext } from "@/app/services/notify-context";
import { normalizeSubscribed, useAuthStore } from "@/store/auth-store";
import "../stylesheet/layout.css";
import useGetHook from "../hook/useGet";
import SubscribeModal from "../users/SubscribeModal";

const Dashboard = () => {
  const storeSub = useAuthStore((state) => state.user?.isSubscribed);
  // Prefer the persistent store, falling back to the legacy localStorage flag.
  const sub =
    storeSub !== undefined && storeSub !== null
      ? String(normalizeSubscribed(storeSub) ? 1 : 0)
      : localStorage.getItem("igbo_sub");
  const [subModal, setSubModal] = useState(false);

  const [showSidebar, setShowSidebar] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : true,
  );

  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  const { data, isLoading } = useGetHook("member/count/unread/notifications");

  useEffect(() => {
    if (sub === "0") {
      setSubModal(true);
    }
  }, [sub]);

  return (
    <div className="layout min-h-screen bg-[#f6f7fb]">
      <div className={`cide ${showSidebar ? "block z-50" : "hidden md:block"}`}>
        <Sidenav showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
      </div>
      <div className={showSidebar ? "component" : "close-side"}>
        <Topnav
          data={data?.data}
          isLoading={isLoading}
          setShowSidebar={setShowSidebar}
          showSidebar={showSidebar}
          toggleSidebar={toggleSidebar}
        />
        <div className="pages">
          <NotifyDataContext.Provider value={data?.data}>
            <Outlet />
          </NotifyDataContext.Provider>
        </div>
      </div>
      {subModal && <SubscribeModal />}
    </div>
  );
};

export default Dashboard;
