// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "@/lib/router-compat";
import logo from "../image/logo.png";
import { FiUsers, FiSettings, FiLogOut } from "react-icons/fi";
import {
  MdAccessTime,
  MdOutlinePayment,
} from "react-icons/md";
import { GrTransaction } from "react-icons/gr";

// import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { LuLayoutDashboard } from "react-icons/lu";
import "../stylesheet/component.css";
import { AiOutlineClose } from "react-icons/ai";
import axios from "axios";
import { useNavigate } from "@/lib/router-compat";
import { toast } from "react-toastify";
import { GoBell } from "react-icons/go";
import { Custom } from "../services/config";
import useModal from "../hook/useModal";

const Sidebar = ({ showSidebar, toggleSidebar }) => {
  const [showUsersMenu, setShowUsersMenu] = useState(false);
  // const [showInventoriesMenu, setShowInventoriesMenu] = useState(false);
  const {Modal, setShowModal} = useModal()
  const toggleUsersMenu = () => {
    if (showSidebar) {
      setShowUsersMenu(!showUsersMenu);
    }
  };

  const Navigate = useNavigate();

  const handleLogOut = async () => {
    try {
      Custom.post("logout");
      localStorage.clear();
      toast.success("Logged Out Successfully");
      Navigate("/login");
    } catch (err) {
      toast.error("Log-out failed: " + err);
    }
  };

  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSidebar && sidebarRef.current && window.innerWidth <= 550) {
        const sidebarRect = sidebarRef.current.getBoundingClientRect();
        const isOutsideSidebar =
          event.clientX < sidebarRect.left - 550 ||
          event.clientX > sidebarRect.right + 550 ||
          event.clientY < sidebarRect.top - 550 ||
          event.clientY > sidebarRect.bottom + 550;

        if (isOutsideSidebar) {
          toggleSidebar(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSidebar, toggleSidebar]);

  return (
    <div
      ref={sidebarRef}
      className={showSidebar ? "sidebar" : "sidebar closed"}
    >
      <div className={showSidebar ? "side_img" : "img-side"}>
      <a href="https://ndiigbogermany.org"><img className="img-logo" src={logo} alt="Logo" /></a>{" "}
        <div className="men" onClick={toggleSidebar}>
          <AiOutlineClose />
        </div>
      </div>
      <nav className={`side-nav ${showSidebar ? "active" : ""}`}>
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink to="/dashboard/" className="nav-link">
              <span className="nav-icon">
                <LuLayoutDashboard /> {showSidebar && "Dashboard"}
              </span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="members" className="nav-link">
              <span className="nav-icon">
              <FiUsers />
                {showSidebar && "Members"}
              </span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="announce" className="nav-link">
              <span className="nav-icon">
                <MdAccessTime />
                {showSidebar && "Announcement"}
              </span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="dues" className="nav-link">
              <span className="nav-icon">
                <MdOutlinePayment />
                {showSidebar && "Dues"}
              </span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="transact" className="nav-link">
              <span className="nav-icon">
              <GrTransaction />
                {showSidebar && "Transaction"}
              </span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="notify" className="nav-link">
              <span className="nav-icon">
                <GoBell />
                {showSidebar && "Notification"}
              </span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="settings" className="nav-link">
              <span className="nav-icon">
                <FiSettings />
                {showSidebar && "Settings"}
              </span>
            </NavLink>
          </li>
          <li className="nav-item cursor-pointer">
            <button onClick={() => setShowModal(true)} className="nav-link">
              <span className="nav-icon">
                {" "}
                <FiLogOut /> {showSidebar && "Logout"}
              </span>
            </button>
          </li>
        </ul>
      </nav>
      <Modal title={''} noHead>
        <div className="p-5">
          <p className="text-center">Are you sure you want to logout?</p>
          <div className="mt-6 flex items-center justify-between">
            <button className="px-5 py-2 bg-red-500 rounded text-white" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="px-5 py-2 bg-blue-900 rounded text-white" onClick={handleLogOut}>Logout</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;
