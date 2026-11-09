import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  BellRing,
  CheckCheck,
  ChevronDown,
  LogOut,
  RefreshCw,
  Settings2,
} from "lucide-react";

import useGetHook from "../hook/useGet";
import type { AdminNotification, AdminProfile } from "@/types/api";
import { cn } from "@/lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/member": "Members",
  "/admin/subscription/list": "Subscription plans",
  "/admin/subscription/bank": "Subscription banks",
  "/admin/dues/bank": "Dues banks",
  "/admin/dues/category": "Dues categories",
  "/admin/dues/list": "Dues",
  "/admin/payments/dues": "Dues payments",
  "/admin/payments/subscrition": "Subscription payments",
  "/admin/announcements": "Announcements",
  "/admin/notify": "Notifications",
  "/admin/messages": "Messages",
  "/admin/gallery": "Gallery",
  "/admin/settings": "Settings",
};

const pageTitle = (pathname: string) => {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return PAGE_TITLES[clean] ?? "Admin";
};

const initials = (profile?: AdminProfile) => {
  const value = `${profile?.first_name?.[0] ?? ""}${profile?.last_name?.[0] ?? ""}`.trim();
  if (value) return value.toUpperCase();
  return (profile?.username || profile?.email || "AD").slice(0, 2).toUpperCase();
};

const timeAgo = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return formatDistanceToNow(date, { addSuffix: true });
};

export const Topnav = ({ profile }: { profile?: AdminProfile | undefined }) => {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);

  const {
    data: notificationResponse,
    isLoading: notificationsLoading,
    refetch,
  } = useGetHook<AdminNotification[]>("admin/get/all/unread/notifications");

  const notifications = notificationResponse?.data ?? [];
  const unreadLabel = notifications.length === 0 ? "You're all caught up" : "Unread updates";

  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    profile?.username ||
    "Super Admin";
  const displayEmail = profile?.email || "Administrator";

  const today = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const handleLogout = () => {
    localStorage.clear();
    navigate({ to: "/admin/login" });
  };

  return (
    <header className="sticky top-0  flex h-16 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70 md:px-6 z-0">
      <SidebarTrigger className="h-8 w-8" />
      <Separator orientation="vertical" className="h-6" />

      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Admin</span>
          <span aria-hidden="true">/</span>
          <span className="truncate font-medium text-foreground">{pageTitle(pathname)}</span>
        </div>
        <p className="truncate text-sm font-semibold leading-tight">
          Welcome back, {displayName.split(" ")[0]}
        </p>
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-3">
        <span className="hidden text-xs text-muted-foreground lg:block">{today}</span>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9"
              aria-label="Open notifications"
            >
              <Bell className="h-[18px] w-[18px]" />
              {notifications.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
                  {notifications.length > 9 ? "9+" : notifications.length}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[min(20rem,calc(100vw-2rem))] p-0">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Notifications</p>
                <p className="text-xs text-muted-foreground">
                  {unreadLabel}
                  {notifications.length > 0 ? ` · ${notifications.length}` : ""}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => refetch()}
                aria-label="Refresh notifications"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", notificationsLoading && "animate-spin")} />
              </Button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notificationsLoading && notifications.length === 0 ? (
                <div className="space-y-3 p-4">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex gap-3">
                      <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3.5 w-2/3" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 px-6 py-10 text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <CheckCheck className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">No unread notifications</p>
                  <p className="text-xs text-muted-foreground">
                    New activity from members and payments will show up here.
                  </p>
                </div>
              ) : (
                notifications.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 border-b border-border/60 px-4 py-3 last:border-0 hover:bg-muted/50"
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <BellRing className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{item.title || "Notification"}</p>
                      {item.body && (
                        <p className="line-clamp-2 text-xs text-muted-foreground">{item.body}</p>
                      )}
                      <p className="mt-1 text-[11px] text-muted-foreground/80">
                        {timeAgo(item.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t p-2">
              <Button asChild variant="ghost" className="w-full justify-center text-primary">
                <Link to="/admin/notify">View all notifications</Link>
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="hidden h-6 sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-10 gap-2 rounded-full px-1.5 hover:bg-muted sm:pr-2"
            >
              <Avatar className="h-8 w-8 border">
                {profile?.avatar ? <AvatarImage src={profile.avatar} alt={displayName} /> : null}
                <AvatarFallback className="text-xs font-semibold">
                  {initials(profile)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden max-w-[10rem] flex-col items-start sm:flex">
                <span className="w-full truncate text-left text-sm font-medium leading-tight">
                  {displayName}
                </span>
                <span className="w-full truncate text-left text-xs text-muted-foreground">
                  {displayEmail}
                </span>
              </span>
              <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-semibold">{displayName}</p>
              <p className="truncate text-xs text-muted-foreground">{displayEmail}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/admin/settings" className="cursor-pointer">
                <Settings2 className="mr-2 h-4 w-4" />
                Account settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
              onSelect={(event) => {
                event.preventDefault();
                setLogoutOpen(true);
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out of the admin portal?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again to manage members, dues, and payments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default Topnav;
