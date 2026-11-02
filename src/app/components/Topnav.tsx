// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { LuMenu } from "react-icons/lu";
import "../stylesheet/component.css";
import { GoBell } from "react-icons/go";
import user from "../image/Ellipse 922.png"; // Default user image
import useGetHook from "../hook/useGet";
import { formatDistanceToNow } from "date-fns";
import { Link } from "@/lib/router-compat";

export const Topnav = ({ toggleSidebar, data }) => {
  const formatTimeAgo = (timestamp) => {
    const apiDate = new Date(timestamp);
    return formatDistanceToNow(apiDate);
  };

  const [activeDropdown, setActiveDropdown] = useState(false);
  const [avatar, setAvatar] = useState(localStorage.getItem("igbo_member_avatar"));

  const { data: datas, isLoading } = useGetHook("member/get/all/unread/notifications");

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "igbo_member_avatar") {
        setAvatar(event.newValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    setAvatar(localStorage.getItem("igbo_member_avatar"));
  }, [avatar]);

  const name = localStorage.getItem("fName");
  const currentDate = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const day = currentDate.getDate();
  const month = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  const formattedDate = `${day} ${month} ${year}`;

  const popup = () => {
    setActiveDropdown(!activeDropdown);
  };

  const bellIconRef = useRef(null);
  const handleClickOutside = (event) => {
    if (bellIconRef.current && !bellIconRef.current.contains(event.target) && !activeDropdown) {
      setActiveDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="top_nav">
      <div className="icon_menu">
        <div className="menu-icon" onClick={toggleSidebar}>
          <LuMenu />
        </div>
        <div className="icon_text">
          <h3>Hello {name}</h3>
          <p>{formattedDate}</p>
        </div>
      </div>
      <div className="icon_menu">
        <div onClick={popup} ref={bellIconRef} className="bell">
          <GoBell />
          <span>{data}</span>
          {activeDropdown && (
            <div className="bell_drop">
              <div className="add_head">
                <p>Recent Notification</p>
              </div>
              {datas?.data.length > 0 ? (
                datas.data.map((item) => (
                  <div key={item.id}>
                    <div className="bell_body">
                      <GoBell />
                      <div>
                        <h3>
                          {item.body} <span>{item.title}</span>
                        </h3>
                        <p>{formatTimeAgo(item.created_at)} ago</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>
                  <div className="add_head">
                    <p>Recent Notification</p>
                  </div>
                  <p className="no_body">No Notifications</p>
                </div>
              )}
              <Link to="notify">View Details</Link>
            </div>
          )}
        </div>
        <img src={avatar || user} alt="User Avatar" />
      </div>
    </div>
  );
};
