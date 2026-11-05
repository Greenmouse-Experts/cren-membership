// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "@/lib/router-compat";
import logo from "../image/logo.png";
import { FiSettings, FiLogOut } from "react-icons/fi";
import { MdOutlineManageAccounts, MdAnnouncement, MdOutlinePayment } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { GrGallery, GrTransaction } from "react-icons/gr";
import { GoBell } from "react-icons/go";
import { LuLayoutDashboard } from "react-icons/lu";
import "../stylesheet/component.css";
import { AiOutlineClose } from "react-icons/ai";
import useModal from "../hook/useModal";
import { TiMessages } from "react-icons/ti";
import { Link } from "@tanstack/react-router";

const Sidebar = ({ showSidebar, toggleSidebar }) => {
  const [showUsersMenu, setShowUsersMenu] = useState(false);
  const [duesMenu, setDuesMenu] = useState(false);
  const [subscriptionMenu, setSubscriptionMenu] = useState(false);
  const [payments, setPayments] = useState(false);
  const navigate = useNavigate();
  const { Modal, setShowModal } = useModal();
  const toggleUsersMenu = () => {
    if (showSidebar) {
      setShowUsersMenu(!showUsersMenu);
    }
  };

  const toggleDuesMenu = () => {
    if (showSidebar) {
      setDuesMenu(!duesMenu);
    }
  };
  const toggleSubscriptionMenu = () => {
    if (showSidebar) {
      setSubscriptionMenu(!duesMenu);
    }
  };

  const togglePaymentMenu = () => {
    if (showSidebar) {
      setPayments(!payments);
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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  return (
    <div ref={sidebarRef} className={showSidebar ? "sidebar" : "sidebar closed"}>
      <div className={showSidebar ? "side_img" : "img-side"}>
        <Link to="/">
          <img className="img-logo" src={logo} alt="Logo" />
        </Link>{" "}
        <div className="men" onClick={toggleSidebar}>
          <AiOutlineClose />
        </div>
      </div>
      <nav className={`side-nav ${showSidebar ? "active" : ""}`}>
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink to="/admin/" className="nav-link" activeOptions={{ exact: true }}>
              <span className="nav-icon">
                <LuLayoutDashboard /> {showSidebar && "Dashboard"}
              </span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="member" className="nav-link">
              <span className="nav-icon">
                <MdOutlineManageAccounts /> {showSidebar && "Members"}
              </span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="subscription/list" className="nav-link">
              <span className="nav-icon">
                <MdOutlineManageAccounts /> {showSidebar && "subscription"}
              </span>
            </NavLink>
          </li>
          {/* <li className="submenu-item">
                  <NavLink to="subscription/list" className="nav-link">
                    {showSidebar && "Add Subscription"}
                  </NavLink>
                </li> */}
          {/* <li className="nav-item">
            <span className="nav-link" onClick={toggleUsersMenu}>
              <span className="nav-icon">
                <MdOutlineManageAccounts /> {showSidebar && "Members"}
              </span>
              {showSidebar && (
                <div className="bb">
                  {showUsersMenu ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </div>
              )}
            </span>
            {showUsersMenu && (
              <ul className="submenu">
                <li className="submenu-item">
                  <NavLink to="fellow" className="nav-link">
                    {showSidebar && "Fellow"}
                  </NavLink>
                </li>
                <li className="submenu-item">
                  <NavLink to="associate" className="nav-link">
                    {showSidebar && "Associate"}
                  </NavLink>
                </li>
              </ul>
            )}
          </li> */}
          {/* <li className="nav-item">
            <span className="nav-link" onClick={toggleSubscriptionMenu}>
              <span className="nav-icon">
                <MdOutlinePayment /> {showSidebar && "Subscription"}
              </span>
              {showSidebar && (
                <div className="bb">
                  {duesMenu ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </div>
              )}
            </span>
            {subscriptionMenu && (
              <ul className="submenu">


                <li className="submenu-item">
                  <NavLink to="subscription/list" className="nav-link">
                    {showSidebar && "Add Subscription"}
                  </NavLink>
                </li>
              </ul>
            )}
          </li> */}
          <li className="nav-item">
            <span className="nav-link" onClick={toggleDuesMenu}>
              <span className="nav-icon">
                <MdOutlinePayment /> {showSidebar && "Dues"}
              </span>
              {showSidebar && (
                <div className="bb">{duesMenu ? <IoIosArrowUp /> : <IoIosArrowDown />}</div>
              )}
            </span>
            {duesMenu && (
              <ul className="submenu">
                <li className="submenu-item">
                  <NavLink to="dues/bank" className="nav-link">
                    {showSidebar && "Bank"}
                  </NavLink>
                </li>
                <li className="submenu-item">
                  <NavLink to="dues/category" className="nav-link">
                    {showSidebar && "Category"}
                  </NavLink>
                </li>
                <li className="submenu-item">
                  <NavLink to="dues/list" className="nav-link">
                    {showSidebar && "Dues List"}
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
          <li className="nav-item">
            <span className="nav-link" onClick={togglePaymentMenu}>
              <span className="nav-icon">
                <GrTransaction /> {showSidebar && "Payments"}
              </span>
              {showSidebar && (
                <div className="bb">{payments ? <IoIosArrowUp /> : <IoIosArrowDown />}</div>
              )}
            </span>
            {payments && (
              <ul className="submenu">
                <li className="submenu-item">
                  <NavLink to="payments/dues" className="nav-link">
                    {showSidebar && "Dues"}
                  </NavLink>
                </li>
                <li className="submenu-item">
                  <NavLink to="payments/subscrition" className="nav-link">
                    {showSidebar && "Subscription"}
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
          <li className="nav-item">
            <NavLink to="/admin/announcements" className="nav-link">
              <span className="nav-icon">
                <MdAnnouncement />
                {showSidebar && "Announcement"}
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
            <NavLink to="messages" className="nav-link">
              <span className="nav-icon">
                <TiMessages />
                {showSidebar && "Messages"}
              </span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="gallery" className="nav-link">
              <span className="nav-icon">
                <GrGallery />
                {showSidebar && "Gallery"}
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
          <li className="nav-item" onClick={() => setShowModal(true)}>
            <div className="nav-link">
              <span className="nav-icon">
                {" "}
                <FiLogOut /> {showSidebar && "Logout"}
              </span>
            </div>
          </li>
        </ul>
      </nav>
      <Modal title={""} noHead>
        <div className="p-5">
          <p className="text-center">Are you sure you want to logout?</p>
          <div className="mt-6 flex items-center justify-between">
            <button
              className="px-5 py-2 bg-red-500 rounded text-white"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button className="px-5 py-2 bg-blue-900 rounded text-white" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Sidebar;
