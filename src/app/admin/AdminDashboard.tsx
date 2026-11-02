// @ts-nocheck
import React, { useState } from "react";
import useGetHook from "../hook/useGet";
import Sidenav from "./Sidenav";
import { Topnav } from "./Topnav";
import { Outlet } from "@tanstack/react-router";
import { NotifyDataContext } from "@/app/services/notify-context";
import "../stylesheet/layout.css";
import Admin from "./Admin";
import Member from "../pages/admin/Member";
import Associate from "../pages/admin/Associate";
import Notify from "../pages/admin/Notify";
import AdminAnnouncement from "../pages/admin/Announcement";
import AdminBanks from "../pages/admin/Dues/Banks";
import AdminDuesCategory from "../pages/admin/Dues/Category";
import AdminDues from "../pages/admin/Dues/Dues";
import DuesPayments from "../pages/admin/Payments/Dues";
import SubscriptionPayments from "../pages/admin/Payments/Subscription";
import SettingsPage from "../pages/admin/Settings";
import AdminSubBank from "../pages/admin/Subscription/Banks";
import SubList from "../pages/admin/Subscription/SubList";
import Messages from "../pages/admin/Messages";
import Gallery from "../pages/admin/Gallery";


const AdminDashboard = () => {
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 650);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const {data, isLoading } = useGetHook('admin/profile')

  return (
    <div className="layout">
      <div className="cide">
        <Sidenav showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
      </div>
      <div className={showSidebar ? "components" : "close-side"}>
        <div className="top_admin_nav">
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
    </div>
  );
};

export default AdminDashboard;
