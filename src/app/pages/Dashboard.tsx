// @ts-nocheck
import React, { useEffect, useState } from "react";
import Sidenav from "../components/Sidenav";
import { Topnav } from "../components/Topnav";
import { Outlet } from "@tanstack/react-router";
import { NotifyDataContext } from "@/app/services/notify-context";
import "../stylesheet/layout.css";
import Home from "./Home";
import Notify from "./Notify";
import useGetHook from "../hook/useGet";
import SubscribeModal from "../users/SubscribeModal";
import MembersAnnoucement from "./users/Annoucement";
import MembersTransactions from "./users/Transactions";
import MembersSetting from "./users/Setting";
import MembersDues from "./users/Dues";
import Members from "../users/members/Members";


const Dashboard = () => {
  const sub = localStorage.getItem("igbo_sub");
  const [subModal, setSubModal] = useState(false);

  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 650);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const { data, isLoading } = useGetHook("member/count/unread/notifications");
  
  useEffect(() => {
    if (sub === "0") {
      setSubModal(true);
    }
  }, [sub]);

  return (
    <div className="layout">
      <div className="cide">
        <Sidenav showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
      </div>
      <div className={showSidebar ? "component" : "close-side"}>
        <div className="pl-4">
          <Topnav
            data={data?.data}
            isLoading={isLoading}
            setShowSidebar={setShowSidebar}
            showSidebar={showSidebar}
            toggleSidebar={toggleSidebar}
          />
        </div>
        <div className="pages">
          <NotifyDataContext.Provider value={data?.data}>
            <Outlet />
          </NotifyDataContext.Provider>
        </div>
      </div>
      {subModal && (
        <SubscribeModal/>
      )}
    </div>
  );
};

export default Dashboard;
