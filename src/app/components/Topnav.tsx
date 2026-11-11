// @ts-nocheck
import React, { useState, useEffect } from "react";
import {
  Menu,
  Bell,
  BellOff,
  Calendar,
  ChevronRight,
  Clock,
  Settings,
  LogOut,
  CreditCard,
  Megaphone,
  User,
} from "lucide-react";
import user from "../image/Ellipse 922.png";
import useGetHook from "../hook/useGet";
import { formatDistanceToNow } from "date-fns";
import dayjs from "dayjs";
import { Link, useNavigate } from "@/lib/router-compat";
import { Custom } from "../services/config";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export const Topnav = ({ toggleSidebar, data }) => {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(localStorage.getItem("igbo_member_avatar"));

  const { data: datas } = useGetHook("member/get/all/unread/notifications");

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
  const email = localStorage.getItem("igbo_email");
  const currentDate = dayjs().format("dddd, D MMMM YYYY");

  // Notifications calculation
  const notificationsList = datas?.data || [];
  const unreadCount = typeof data === "number" ? data : Number(data) || notificationsList.length;

  const formatTimeAgo = (timestamp) => {
    try {
      const apiDate = new Date(timestamp);
      return formatDistanceToNow(apiDate, { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  const handleLogout = async () => {
    try {
      await Custom.post("logout");
    } catch {
      // Proceed with clearing local storage
    }
    localStorage.clear();
    toast.success("Logged Out Successfully");
    navigate("/login");
  };

  const getInitials = (text) => {
    if (!text) return "MB";
    const parts = text.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return text.slice(0, 2).toUpperCase();
  };

  return (
    <header className="w-full bg-white border-b border-border/80 px-4 sm:px-6 py-3 sticky top-0 z-30 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Sidebar Toggle & Greeting */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-9 w-9 px-0 shrink-0 text-gray-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Toggle sidebar"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-col">
            <h1 className="text-sm sm:text-base font-semibold text-gray-900 leading-tight">
              Hello, <span className="text-emerald-800 capitalize">{name || "Member"}</span> 👋
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
              <Calendar className="h-3 w-3 text-emerald-700/70 shrink-0" />
              <span>{currentDate}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Notification Dropdown & Profile Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notifications Center */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-full hover:bg-gray-100 text-gray-600 hover:text-emerald-800 transition-colors"
                aria-label="View notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full flex items-center justify-center text-[10px] font-bold shadow-xs bg-red-600 hover:bg-red-600 text-white border-2 border-white"
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 sm:w-96 p-0 shadow-lg border border-border/80 rounded-xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border/60 bg-muted/30">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-gray-900">Notifications</h4>
                  {unreadCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="text-[11px] bg-emerald-100 text-emerald-800 hover:bg-emerald-100 font-medium"
                    >
                      {unreadCount} unread
                    </Badge>
                  )}
                </div>
                <Link
                  to="/dashboard/notify"
                  className="text-xs font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  View all
                </Link>
              </div>

              <div className="max-h-[320px] overflow-y-auto divide-y divide-border/60">
                {notificationsList.length > 0 ? (
                  notificationsList.slice(0, 5).map((item) => (
                    <Link
                      key={item.id}
                      to="/dashboard/notify"
                      className="p-3.5 flex items-start gap-3 hover:bg-emerald-50/40 transition-colors block"
                    >
                      <div className="mt-0.5 rounded-full bg-emerald-100/70 p-1.5 text-emerald-800 shrink-0">
                        <Bell className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-semibold text-gray-900 truncate">
                            {item.title || "New Notification"}
                          </p>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">{item.body}</p>
                        <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {formatTimeAgo(item.created_at)}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="p-8 text-center flex flex-col items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-2">
                      <BellOff className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-semibold text-gray-700">No new notifications</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      You are completely caught up!
                    </p>
                  </div>
                )}
              </div>

              <div className="p-2 border-t border-border/60 bg-muted/20">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs font-medium text-emerald-800 hover:bg-emerald-50 justify-center h-8"
                >
                  <Link to="/dashboard/notify">
                    Open Notification Center
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="h-6 w-px bg-gray-200 hidden sm:block" />

          {/* User Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100/80 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700/20 cursor-pointer"
                aria-label="User profile menu"
              >
                <Avatar className="h-9 w-9 border-2 border-emerald-600/30">
                  <AvatarImage
                    src={avatar || user}
                    alt={name || "Member Avatar"}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-emerald-800 text-white font-medium text-xs">
                    {getInitials(name)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-semibold text-gray-900 leading-none truncate max-w-[120px]">
                    {name || "Member"}
                  </span>
                  <span className="text-[10px] text-muted-foreground leading-none mt-1">
                    Member Portal
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 shadow-lg border border-border/80 rounded-xl p-1"
            >
              <DropdownMenuLabel className="p-2 font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold text-gray-900 leading-none truncate capitalize">
                    {name || "Member"}
                  </p>
                  {email && (
                    <p className="text-xs text-muted-foreground leading-none truncate">{email}</p>
                  )}
                  <Badge
                    variant="outline"
                    className="mt-1.5 w-fit text-[10px] border-emerald-600/40 text-emerald-800 bg-emerald-50/60"
                  >
                    Active Member
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  to="/dashboard/settings"
                  className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-gray-700 hover:text-emerald-900 cursor-pointer"
                >
                  <User className="h-4 w-4 text-emerald-700" />
                  <span>Profile & Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/dashboard/dues"
                  className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-gray-700 hover:text-emerald-900 cursor-pointer"
                >
                  <CreditCard className="h-4 w-4 text-emerald-700" />
                  <span>My Dues & Invoices</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/dashboard/announce"
                  className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-gray-700 hover:text-emerald-900 cursor-pointer"
                >
                  <Megaphone className="h-4 w-4 text-emerald-700" />
                  <span>Announcements</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/dashboard/notify"
                  className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-gray-700 hover:text-emerald-900 cursor-pointer"
                >
                  <Bell className="h-4 w-4 text-emerald-700" />
                  <span>Notifications</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
