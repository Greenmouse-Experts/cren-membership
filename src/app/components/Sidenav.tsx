// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "@/lib/router-compat";
import logo from "../image/logo.png";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  CreditCard,
  ArrowLeftRight,
  Bell,
  Settings,
  LogOut,
  X,
  Menu,
  BadgeCheck,
} from "lucide-react";
import { Custom } from "../services/config";
import { toast } from "react-toastify";
import useGetHook from "../hook/useGet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

const Sidenav = ({ showSidebar, toggleSidebar }) => {
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const sidebarRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const { data: countData } = useGetHook("member/count/unread/notifications");
  const unreadCount = Number(countData?.data) || 0;

  // Below md the sidebar is an overlay drawer; from md up it is the persistent rail.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Lock page scroll while the mobile drawer is open.
  useEffect(() => {
    if (!isMobile || !showSidebar) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMobile, showSidebar]);

  const handleLogOut = async () => {
    try {
      await Custom.post("logout");
    } catch {
      // Ignore network errors and complete logout
    }
    localStorage.clear();
    toast.success("Logged Out Successfully");
    navigate("/login");
  };

  // Close on outside click on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showSidebar &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 768
      ) {
        toggleSidebar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSidebar, toggleSidebar]);

  const navItems = [
    {
      to: "/dashboard/",
      label: "Dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      to: "members",
      label: "Members",
      icon: Users,
    },
    {
      to: "announce",
      label: "Announcements",
      icon: Megaphone,
    },
    {
      to: "dues",
      label: "Dues",
      icon: CreditCard,
    },
    {
      to: "subscription",
      label: "Subscription",
      icon: BadgeCheck,
    },
    {
      to: "transact",
      label: "Transactions",
      icon: ArrowLeftRight,
    },
    {
      to: "notify",
      label: "Notifications",
      icon: Bell,
      badge: unreadCount,
    },
    {
      to: "settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <TooltipProvider delayDuration={150}>
      {/* Mobile Backdrop */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
          onClick={() => toggleSidebar(false)}
        />
      )}

      {/* The parent wrapper hides itself on mobile when the drawer is closed, so the
          aside always renders; widths below apply to the rail (md+) only. */}
      <aside
        ref={sidebarRef}
        aria-label="Member navigation"
        className={cn(
          "relative h-full bg-white border-r border-border/80 flex flex-col justify-between select-none",
          // Overlay drawer on mobile, full height regardless of zoom level
          "fixed inset-y-0 left-0 z-50 w-64 shadow-2xl transition-transform duration-200 ease-out",
          showSidebar ? "translate-x-0" : "-translate-x-full",
          // Static rail from md up (never translated off-screen)
          "md:static md:z-40 md:translate-x-0 md:shadow-none md:transition-[width]",
          showSidebar ? "md:w-56" : "md:w-24",
        )}
      >
        {/* Top: Branding / Logo Header */}
        <div>
          <div
            className={cn(
              "flex items-center border-b border-border/70 py-4 px-3 sm:px-4",
              showSidebar ? "justify-between" : "justify-center",
            )}
          >
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 overflow-hidden group"
            >
              <img
                src={logo}
                alt="CREN Logo"
                className={cn(
                  "object-contain transition-transform group-hover:scale-105",
                  showSidebar ? "h-12 w-auto" : "h-8",
                )}
              />
              {/*{showSidebar && (
                <div className="flex flex-col text-left">
                  <Menu />
                </div>
              )}*/}
            </Link>

            {/* Mobile close button */}
            {showSidebar && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => toggleSidebar(false)}
                className="md:hidden h-8 w-8 text-gray-500 hover:text-gray-900 rounded-md"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-9rem)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const linkContent = (
                <NavLink
                  key={item.to}
                  to={item.to}
                  activeOptions={item.exact ? { exact: true } : undefined}
                  className={cn(
                    "flex items-center rounded-lg text-sm font-medium transition-all group relative cursor-pointer",
                    showSidebar || isMobile
                      ? "gap-3 px-3 py-2.5 justify-start text-gray-700 hover:text-emerald-900 hover:bg-emerald-50/70 [&.active]:bg-emerald-800 [&.active]:text-white [&.active]:shadow-xs"
                      : "justify-center p-2.5 text-gray-700 hover:text-emerald-900 hover:bg-emerald-50/70 [&.active]:bg-emerald-800 [&.active]:text-white [&.active]:shadow-xs",
                  )}
                  onClick={() => {
                    if (isMobile) {
                      toggleSidebar(false);
                    }
                  }}
                >
                  <Icon className="h-5 w-5 shrink-0 transition-colors" />

                  {(showSidebar || isMobile) && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}

                  {/* Badge for notifications */}
                  {Boolean(item.badge && item.badge > 0) && (
                    <Badge
                      variant="destructive"
                      className={cn(
                        "rounded-full text-[10px] font-bold shrink-0",
                        showSidebar || isMobile
                          ? "ml-auto px-1.5 py-0 h-4 min-w-4 flex items-center justify-center bg-red-600 text-white"
                          : "absolute -top-1 -right-1 px-1 py-0 h-4 min-w-4 flex items-center justify-center bg-red-600 text-white",
                      )}
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </Badge>
                  )}
                </NavLink>
              );

              if (!showSidebar && !isMobile) {
                return (
                  <Tooltip key={item.to}>
                    <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                    <TooltipContent side="right" className="font-medium text-xs">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return linkContent;
            })}
          </nav>
        </div>

        {/* Bottom Section: Logout Action */}
        <div className="p-3 border-t border-border/70 bg-gray-50/50">
          {showSidebar || isMobile ? (
            <button
              type="button"
              onClick={() => setLogoutOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              <span className="truncate">Logout</span>
            </button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setLogoutOpen(true)}
                  className="w-full flex items-center justify-center p-2.5 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                className="font-medium text-xs text-red-600 bg-white border shadow-md"
              >
                Logout
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent className="w-11/12 max-w-md rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-gray-900">
              <LogOut className="h-5 w-5 text-red-600" />
              Log Out of Your Account
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-sm">
              Are you sure you want to end your session? You will need your login credentials to
              access the portal again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 gap-2 sm:gap-0">
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogOut}
              className="bg-red-600 hover:bg-red-700 text-white cursor-pointer font-medium"
            >
              Yes, Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};

export default Sidenav;
